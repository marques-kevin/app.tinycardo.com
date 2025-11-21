import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import type { SessionsState } from "@/modules/sessions/redux/sessions_reducers"
import { session_builder_algorithm } from "@/modules/sessions/utils/session_builder_algorithm"
import { flashcards_due_date_algorithm } from "@/modules/sessions/utils/flashcards_due_date_algorithm"
import type { AsyncThunkConfig } from "@/redux/store"
import * as global_actions from "@/modules/global/redux/global_actions"
import { build_help_history_id } from "../utils/build_help_history_id"

/**
 *
 *
 *
 *
 *
 *
 * SESSION USER EXPERIENCE
 *
 *
 *
 *
 *
 *
 */

export const _set_is_loading = createAction<{
  is_loading: boolean
}>("sessions/_set_is_loading")

export const _set_is_flipped = createAction<{
  is_card_flipped?: SessionsState["is_card_flipped"]
}>("sessions/_set_is_flipped")

export const _start_session = createAction<{
  words_to_review: SessionsState["words_to_review"]
  deck_id: SessionsState["deck_id"]
  mode: SessionsState["mode"]
  review_mode?: SessionsState["review_mode"]
  front_language: string
  back_language: string
}>("sessions/_start_session")

export const _reset_session = createAction("sessions/_reset_session")

export const _update_session = createAction<
  Pick<
    SessionsState,
    "known_words" | "unknown_words" | "current_index" | "is_ended"
  >
>("sessions/_update_session")

export const go_on_session_page = createAsyncThunk<
  void,
  {
    deck_id: string
    mode: SessionsState["mode"]
    review_mode?: SessionsState["review_mode"]
  },
  AsyncThunkConfig
>("sessions/go_on_session_page", async (params, { extra }) => {
  extra.location_service.navigate(
    `/sessions/${params.deck_id}/${params.mode}${params.review_mode ? `?review_mode=${params.review_mode}` : ""}`,
  )
})

export const no_cards_to_review = createAsyncThunk<
  SessionsState["no_cards_to_review"],
  SessionsState["no_cards_to_review"],
  AsyncThunkConfig
>("sessions/no_cards_to_review", async (_) => {
  return _
})

export const preload_next_audio_file = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("sessions/preload_next_audio_file", async (_, { extra, getState }) => {
  const { sessions } = getState()

  const next_word = sessions.words_to_review[sessions.current_index + 1]

  if (!next_word) return

  await extra.audio_service.preload({ url: next_word.back_audio_url })
  await extra.audio_service.preload({ url: next_word.front_audio_url })
})

export const start_session = createAsyncThunk<
  void,
  {
    deck_id?: string
    mode?: SessionsState["mode"]
    review_mode?: SessionsState["review_mode"]
  },
  AsyncThunkConfig
>("sessions/start_session", async (_, { dispatch, extra, getState }) => {
  try {
    const { params, authentication } = getState()
    const location = extra.location_service.get_current_url()
    const pathname = new URL(location).pathname
    const user_id = authentication.user?.id ?? ""

    const matched = UrlMatcherService.extract({
      pattern: `/sessions/:deck_id/:mode`,
      url: pathname,
    })

    let deck_id = matched.deck_id
    let mode = matched.mode as SessionsState["mode"]

    if (_.mode) mode = _.mode
    if (_.deck_id) deck_id = _.deck_id
    if (!deck_id) throw new Error(`deck_id is undefined`)

    dispatch(_set_is_loading({ is_loading: true }))

    const [cards, history, deck] = await Promise.all([
      extra.decks_repository.fetch_cards({
        deck_id,
      }),
      extra.sessions_repository.fetch_history({ deck_id, user_id }),
      extra.decks_repository.get_deck_by_id({
        deck_id,
        user_id,
      }),
    ])

    dispatch(_set_is_loading({ is_loading: false }))

    const cards_to_review = session_builder_algorithm({
      cards: cards,
      history: history,
      mode: mode,
      count: {
        review: params.how_many_words_to_review,
        learn_new_words: params.how_many_words_to_learn_new_words,
        randomized: params.how_many_words_to_randomized,
      },
    })

    if (cards_to_review.length === 0) {
      if (history.length === cards.length) {
        dispatch(no_cards_to_review("reviewed_and_learned_all_cards"))
      } else if (mode === "review") {
        dispatch(no_cards_to_review("reviewed_all_cards"))
      } else if (mode === "learn_new_words") {
        dispatch(no_cards_to_review("learned_all_cards"))
      }

      return
    }

    dispatch(
      _start_session({
        words_to_review: cards_to_review,
        mode,
        deck_id,
        front_language: deck.front_language,
        back_language: deck.back_language,
        review_mode: _.review_mode,
      }),
    )

    if (_.review_mode === "audio") {
      dispatch(preload_next_audio_file())
      dispatch(
        tts({
          side: "back",
        }),
      )
    }
  } catch (e) {
    dispatch(_reset_session())

    throw e
  }
})

export const restart_session = createAsyncThunk<void, void, AsyncThunkConfig>(
  "sessions/restart_session",
  async (_, { dispatch, getState }) => {
    const { sessions } = getState()

    dispatch(
      start_session({
        deck_id: sessions.deck_id,
        mode: sessions.mode,
      }),
    )
  },
)

export const tts = createAsyncThunk<
  void,
  {
    side?: "front" | "back"
  },
  AsyncThunkConfig
>("sessions/tts", async (_, { getState, extra }) => {
  const { sessions } = getState()

  const current_word = sessions.current_word

  if (!current_word) throw new Error(`no current word found`)

  const side = _.side ? _.side : sessions.is_card_flipped ? "back" : "front"
  const text = side === "front" ? current_word.front : current_word.back
  const audio_url =
    side === "front"
      ? current_word.front_audio_url
      : current_word.back_audio_url
  const language =
    side === "front" ? sessions.front_language : sessions.back_language

  const response = await extra.audio_service.play({ url: audio_url })

  if (response.success) return

  extra.audio_service.text_to_speech({ text, language })
})

export const on_session_ended = createAsyncThunk<void, void, AsyncThunkConfig>(
  "sessions/on_session_ended",
  async (params, { dispatch }) => {
    dispatch(global_actions.session_ended())
  },
)

export const flip_card = createAsyncThunk<void, void, AsyncThunkConfig>(
  "sessions/flip_card",
  async (params, { dispatch }) => {
    dispatch(_set_is_flipped({}))
  },
)

export const set_review_word = createAsyncThunk<
  void,
  { status: "known" | "unknown" },
  AsyncThunkConfig
>(
  "sessions/set_review_word",
  async ({ status }, { dispatch, getState, extra }) => {
    const { sessions } = getState()

    const current_card_reviewed =
      sessions.words_to_review[sessions.current_index]

    if (!current_card_reviewed) return

    const known_words = [...sessions.known_words]
    const unknown_words = [...sessions.unknown_words]

    const updated_card_reviewed =
      sessions.mode !== "randomized"
        ? flashcards_due_date_algorithm({
            history: current_card_reviewed,
            status,
          })
        : current_card_reviewed

    if (status === "known") {
      known_words.unshift(updated_card_reviewed)
    } else {
      unknown_words.unshift(updated_card_reviewed)
    }

    if (sessions.mode !== "randomized") {
      extra.sessions_repository.update_card_status(updated_card_reviewed)
    }

    dispatch(
      _set_is_flipped({
        is_card_flipped: false,
      }),
    )

    const is_ended =
      sessions.words_to_review.length === sessions.current_index + 1

    dispatch(
      _update_session({
        known_words,
        unknown_words,
        current_index: sessions.current_index + 1,
        is_ended: is_ended,
      }),
    )

    if (is_ended) {
      dispatch(global_actions.session_ended())
    } else {
      if (sessions.review_mode === "audio") {
        dispatch(preload_next_audio_file())
        dispatch(
          tts({
            side: "back",
          }),
        )
      }
    }
  },
)

/**
 *
 *
 *
 *
 *
 *
 *
 * HELP DIALOG MANAGMENT
 *
 *
 *
 *
 *
 *
 *
 */

export const _store_help_content = createAction<{
  help_content: string
}>("sessions/_store_help_content")

export const _set_help_open = createAction<{ is_open: boolean }>(
  "sessions/_set_help_open",
)

export const _set_help_loading = createAction<{ is_loading: boolean }>(
  "sessions/_set_help_loading",
)

export const help_close = createAsyncThunk<void, void, AsyncThunkConfig>(
  "sessions/help_close",
  async (_, { dispatch }) => {
    dispatch(_set_help_open({ is_open: false }))
  },
)

export const help_open = createAsyncThunk<void, void, AsyncThunkConfig>(
  "sessions/request_help",
  async (_, { dispatch, getState, extra }) => {
    const { sessions, decks, language } = getState()
    const current = sessions.current_word
    const deck = decks.decks.find((d) => d.id === sessions.deck_id)

    if (!current) throw new Error(`card is undefined`)
    if (!deck) throw new Error(`deck is undefined`)

    const is_front = !sessions.is_card_flipped

    const is_already_help =
      sessions.help.history[
        build_help_history_id({ is_front, card_id: current.card_id })
      ]

    if (is_already_help) {
      dispatch(_set_help_open({ is_open: true }))
      dispatch(
        _store_help_content({
          help_content: is_already_help,
        }),
      )
      return
    }

    dispatch(_set_help_loading({ is_loading: true }))
    dispatch(_set_help_open({ is_open: true }))

    const sentence_to_explain = is_front ? current.front : current.back

    const help = await extra.session_help_service.explain_sentence({
      sentence_to_explain: sentence_to_explain,
      language_of_sentence: is_front ? deck.front_language : deck.back_language,
      language_of_the_explanation: language.lang,
    })

    dispatch(
      _store_help_content({
        help_content: help,
      }),
    )
    dispatch(_set_help_loading({ is_loading: false }))
  },
)

/**
 *
 *
 *
 *
 *
 *
 *
 * GLOBAL APP ACTIONS
 *
 *
 *
 *
 *
 *
 *
 */

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("sessions/global_route_changed", async (params, { dispatch, extra }) => {
  const location = extra.location_service.get_current_url()
  const url = new URL(location)
  const { deck_id, mode } = UrlMatcherService.extract({
    pattern: "/sessions/:deck_id/:mode",
    url: url.pathname,
  })

  const review_mode =
    (url.searchParams.get("review_mode") as SessionsState["review_mode"]) ||
    "text"

  if (deck_id && mode) {
    await dispatch(
      start_session({
        deck_id,
        mode: mode as SessionsState["mode"],
        review_mode,
      }),
    )
  }
})
