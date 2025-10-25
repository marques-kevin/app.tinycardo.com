import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import { parse_csv_to_json } from "@/modules/decks/utils/parse_csv_to_json"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { open as open_dialog } from "@/modules/dialog/redux/dialog_actions"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import type { MessageI18nKeys } from "@/intl"

export const _store_decks_stats = createAction<
  Record<
    string,
    {
      deck_id: string
      number_of_cards: number
      number_of_cards_ready_to_be_reviewed: number
      number_of_cards_not_ready_to_be_reviewed: number
    }
  >
>("decks/_store_decks_stats")

export const _store_decks = createAction<DeckEntity[]>("decks/_store_decks")

export const go_on_deck_details_page = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/go_on_deck_details_page", async ({ deck_id }, { extra }) => {
  extra.location_service.navigate(`/decks/${deck_id}/`)
})

export const go_on_update_deck_page = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/go_on_update_deck_page", async ({ deck_id }, { extra }) => {
  extra.location_service.navigate(`/decks/${deck_id}/update`)
})

export const create_deck = createAsyncThunk<void, void, AsyncThunkConfig>(
  "decks/create_deck",
  async (_, { dispatch, extra }) => {
    const deck = await extra.decks_repository.create_deck({
      name: "New Deck",
      back_language: "en",
      front_language: "fr",
    })

    dispatch(go_on_update_deck_page({ deck_id: deck.id }))
  },
)

export const exit_update_deck_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/exit_update_deck_page", async (_, { dispatch, extra }) => {
  extra.location_service.navigate("/")
  dispatch(reset_create_deck())
})

export const fetch_decks = createAsyncThunk<void, void, AsyncThunkConfig>(
  "decks/fetch_decks",
  async (params, { dispatch, extra }) => {
    const decks_response = await extra.decks_repository.fetch_decks()

    dispatch(_store_decks(decks_response))

    const decks_history = await Promise.all(
      decks_response.map(async (deck) => {
        const [cards, history] = await Promise.all([
          extra.decks_repository.fetch_cards({ deck_id: deck.id }),
          extra.sessions_repository.fetch_history({
            deck_id: deck.id,
          }),
        ])

        const cards_ready_to_be_reviewed = history.filter(
          (h) => h.next_due_at < new Date(),
        )

        const cards_not_ready_to_be_reviewed = history.filter(
          (h) => h.next_due_at > new Date(),
        )

        return {
          deck_id: deck.id,
          number_of_cards: cards.length,
          number_of_cards_ready_to_be_reviewed:
            cards_ready_to_be_reviewed.length,
          number_of_cards_not_ready_to_be_reviewed:
            cards_not_ready_to_be_reviewed.length,
        }
      }),
    )

    dispatch(
      _store_decks_stats(
        decks_history.reduce(
          (acc, curr) => {
            acc[curr.deck_id] = curr
            return acc
          },
          {} as Record<
            string,
            {
              deck_id: string
              number_of_cards: number
              number_of_cards_ready_to_be_reviewed: number
              number_of_cards_not_ready_to_be_reviewed: number
            }
          >,
        ),
      ),
    )
  },
)

export const _create_deck_add_new_card = createAction<void>(
  "decks/_create_deck_add_new_card",
)

export const create_deck_add_new_card = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "decks/create_deck_add_new_card",
  async (_, { dispatch, extra, getState }) => {
    dispatch(_create_deck_add_new_card())
  },
)

export const create_deck_remove_card = createAction<{ id: string }>(
  "decks/create_deck_remove_card",
)

export const create_deck_update_card = createAction<{
  id: string
  field: "front" | "back"
  value: string
}>("decks/create_deck_update_card")

export const _open_csv_import_dialog = createAction<{
  headers: string[]
  rows: string[][]
  selected_front: number
  selected_back: number
}>("decks/_open_csv_import_dialog")

export const _update_csv_import_dialog = createAction<{
  selected_front?: number
  selected_back?: number
}>("decks/_update_csv_import_dialog")

export const _close_csv_import_dialog = createAction(
  "decks/_close_csv_import_dialog",
)

export const _open_deck_actions_dialog = createAction<{
  deck: {
    id: string
    name: string
    front_language: string
    back_language: string
    number_of_cards: number
    number_of_cards_ready_to_be_reviewed: number
    number_of_cards_not_ready_to_be_reviewed: number
  }
}>("decks/_open_deck_actions_dialog")

export const _close_deck_actions_dialog = createAction(
  "decks/_close_deck_actions_dialog",
)

export const fetch_cards = createAsyncThunk<
  CardEntity[],
  { deck_id: string },
  AsyncThunkConfig
>("decks/fetch_cards", async ({ deck_id }, { extra }) => {
  return await extra.decks_repository.fetch_cards({ deck_id })
})

export const import_cards_from_csv = createAsyncThunk<
  { front: string; back: string }[] | void,
  { content: string },
  AsyncThunkConfig
>("decks/import_cards_from_csv", async ({ content }, { dispatch }) => {
  const { headers, rows } = parse_csv_to_json(content)

  if (rows.length === 0) return

  if (headers.includes("front") && headers.includes("back")) {
    const mapped = rows
      .map((row) => ({
        front: row.front ?? "",
        back: row.back ?? "",
      }))
      .filter((r) => r.front || r.back)
    return mapped
  }

  dispatch(
    _open_csv_import_dialog({
      headers,
      rows: rows.map((r) => Object.values(r)),
      selected_front: 0,
      selected_back: 1,
    }),
  )
})

export const apply_csv_import_mapping = createAsyncThunk<
  { front: string; back: string }[],
  void,
  AsyncThunkConfig
>("decks/apply_csv_import_mapping", async (_, { getState, dispatch }) => {
  const { decks } = getState()

  if (!decks.create_deck.csv_import_dialog.open) return []

  const data_rows = decks.create_deck.csv_import_dialog.rows

  const mapped = data_rows
    .map((cols) => ({
      front: cols[decks.create_deck.csv_import_dialog.selected_front] ?? "",
      back: cols[decks.create_deck.csv_import_dialog.selected_back] ?? "",
    }))
    .filter((r) => r.front || r.back)

  dispatch(_close_csv_import_dialog())

  return mapped
})

export const delete_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/delete_deck", async ({ deck_id }, { extra }) => {
  await extra.decks_repository.delete_deck({ id: deck_id })

  extra.location_service.navigate("/")
})

/**
 *
 *
 *
 *
 *
 * GLOBAL EVENT HANDLERS
 *
 *
 *
 *
 */

export const global_app_initialized = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/global_app_initialized", async (params, { dispatch }) => {})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/global_route_changed", async (_, { dispatch, extra }) => {
  dispatch(when_user_is_on_update_deck_page())
  dispatch(when_user_is_on_home_page())
})

export const when_user_is_on_update_deck_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "decks/when_user_is_on_update_deck_page",
  async (_, { dispatch, extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) return

    const location = extra.location_service.get_current_url()
    const { pathname } = new URL(location)
    const { deck_id } = UrlMatcherService.extract({
      pattern: "/decks/:deck_id/update",
      url: pathname,
    })

    if (!deck_id) return

    await dispatch(load_deck_into_create_form({ deck_id }))
  },
)

export const when_user_is_on_home_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "decks/when_user_is_on_home_page",
  async (_, { dispatch, extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) return

    const location = extra.location_service.get_current_url()
    const { pathname } = new URL(location)
    const is_on_home_page = UrlMatcherService.exact_match({
      url: pathname,
      pattern: "/",
    })

    if (!is_on_home_page) return

    dispatch(fetch_decks())
  },
)

/** ==============================================
 *
 *
 *
 *
 *
 * UPDATE DECK ACTIONS
 *
 *
 *
 * ============================================== */

export const update_deck_set_visibility = createAction<{
  visibility: "public" | "private" | "unlisted"
}>("decks/update_deck_set_visibility")

export const update_deck_set_title = createAction<{ title: string }>(
  "decks/update_deck_set_title",
)
export const update_deck_set_description = createAction<{
  description: string
}>("decks/update_deck_set_description")

export const update_deck_toggle_select_card = createAction<{
  card_id: string
}>("decks/update_deck_toggle_select_card")

export const update_deck_toggle_select_all_cards = createAction<void>(
  "decks/update_deck_toggle_select_all_cards",
)

export const _draft_add_card = createAction<CardEntity>("decks/_draft_add_card")
export const _draft_update_card = createAction<{
  id: string
  field: "front" | "back"
  value: string
}>("decks/_draft_update_card")
export const _draft_remove_card = createAction<{ id: string }>(
  "decks/_draft_remove_card",
)
export const _draft_add_cards_bulk = createAction<CardEntity[]>(
  "decks/_draft_add_cards_bulk",
)
export const _draft_clear = createAction("decks/_draft_clear")

export const create_deck_update_front_language = createAction<{
  language: string
}>("decks/create_deck_update_front_language")

export const create_deck_update_back_language = createAction<{
  language: string
}>("decks/create_deck_update_back_language")

export const _create_deck_set_cards = createAction<CardEntity[]>(
  "decks/_create_deck_set_cards",
)

export const reset_create_deck = createAction("decks/reset_create_deck")
export const load_deck_into_create_form = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>(
  "decks/load_deck_into_create_form",
  async ({ deck_id }, { dispatch, extra }) => {
    const decks = await extra.decks_repository.fetch_decks()
    const deck = decks.find((d) => d.id === deck_id)
    const cards = await extra.decks_repository.fetch_cards({ deck_id })

    if (!deck) return

    dispatch(update_deck_set_title({ title: deck.name }))
    dispatch(update_deck_set_description({ description: "" }))
    dispatch(update_deck_set_visibility({ visibility: deck.visibility }))
    dispatch(
      create_deck_update_front_language({ language: deck.front_language }),
    )
    dispatch(create_deck_update_back_language({ language: deck.back_language }))
    dispatch(
      _create_deck_set_cards(
        cards.map((c) => ({ id: c.id, front: c.front, back: c.back, deck_id })),
      ),
    )
  },
)

export const create_deck_submit = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/create_deck_submit", async (_, { getState, dispatch, extra }) => {
  const { decks } = getState()
  const create = decks.create_deck

  const errors: MessageI18nKeys[] = []

  if (!create.title || create.title.trim().length === 0) {
    errors.push("decks_actions/dialog/create_deck/errors/title_required")
  }
  if (create.title.trim().length > 50) {
    errors.push("decks_actions/dialog/create_deck/errors/title_too_long")
  }
  if (create.cards.length < 1) {
    errors.push("decks_actions/dialog/create_deck/errors/at_least_one_card")
  }
  const has_empty = create.cards.some(
    (c) =>
      (create.cards_map[c]?.front ?? "").trim() === "" ||
      (create.cards_map[c]?.back ?? "").trim() === "",
  )
  if (has_empty) {
    errors.push("decks_actions/dialog/create_deck/errors/front_back_required")
  }
  if (create.front_language === create.back_language) {
    errors.push(
      "decks_actions/dialog/create_deck/errors/languages_cannot_match",
    )
  }

  if (errors.length > 0) {
    await dispatch(
      open_dialog({
        type: "error",
        title: "decks_actions/dialog/create_deck/title",
        description: errors[0],
      }),
    )
    return
  }

  const pathname = new URL(extra.location_service.get_current_url()).pathname
  const extracted = UrlMatcherService.extract({
    pattern: "/decks/:deck_id/update",
    url: pathname,
  })

  let deck: DeckEntity

  if (extracted.deck_id) {
    // Update existing deck
    deck = await extra.decks_repository.update_deck({
      id: extracted.deck_id,
      name: create.title.trim(),
      front_language: create.front_language,
      back_language: create.back_language,
    })
  } else {
    deck = await extra.decks_repository.create_deck({
      name: create.title.trim(),
      front_language: create.front_language,
      back_language: create.back_language,
    })
  }

  const cards = create.cards.map((c) => ({
    id: c,
    front: create.cards_map[c]?.front.trim(),
    back: create.cards_map[c]?.back.trim(),
  }))

  await extra.decks_repository.upsert_cards({
    deck_id: deck.id,
    cards,
  })

  await dispatch(fetch_decks())

  extra.location_service.navigate("/")
})

export const update_deck_delete_selected_cards = createAction<void>(
  "decks/update_deck_delete_selected_cards",
)
