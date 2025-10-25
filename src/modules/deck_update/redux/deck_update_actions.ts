import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import { parse_csv_to_json } from "@/modules/decks/utils/parse_csv_to_json"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { open as open_dialog } from "@/modules/dialog/redux/dialog_actions"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import type { MessageI18nKeys } from "@/intl"
import type { DeckUpdateState } from "@/modules/deck_update/redux/deck_update_reducers"

export const update_deck_set_visibility = createAction<{
  visibility: "public" | "private" | "unlisted"
}>("deck_update/update_deck_set_visibility")

export const update_deck_set_title = createAction<{ title: string }>(
  "decks/update_deck_set_title",
)
export const update_deck_set_description = createAction<{
  description: string
}>("deck_update/update_deck_set_description")

export const update_deck_toggle_select_card = createAction<{
  card_id: string
}>("deck_update/update_deck_toggle_select_card")

export const update_deck_toggle_select_all_cards = createAction<void>(
  "decks/update_deck_toggle_select_all_cards",
)

export const _draft_add_card = createAction<CardEntity>(
  "deck_update/_draft_add_card",
)
export const _draft_update_card = createAction<{
  id: string
  field: "front" | "back"
  value: string
}>("deck_update/_draft_update_card")
export const _draft_remove_card = createAction<{ id: string }>(
  "decks/_draft_remove_card",
)
export const _draft_add_cards_bulk = createAction<CardEntity[]>(
  "decks/_draft_add_cards_bulk",
)
export const _draft_clear = createAction("deck_update/_draft_clear")

export const create_deck_update_front_language = createAction<{
  language: string
}>("deck_update/create_deck_update_front_language")

export const create_deck_update_back_language = createAction<{
  language: string
}>("deck_update/create_deck_update_back_language")

export const _create_deck_set_cards = createAction<CardEntity[]>(
  "decks/_create_deck_set_cards",
)

export const reset_create_deck = createAction("deck_update/reset_create_deck")

export const load_deck_into_create_form = createAsyncThunk<
  { deck: DeckEntity; cards: CardEntity[] } | null,
  { deck_id: string },
  AsyncThunkConfig
>("deck_update/load_deck_into_create_form", async ({ deck_id }, { extra }) => {
  const decks = await extra.decks_repository.fetch_decks()
  const deck = decks.find((d) => d.id === deck_id)
  const cards = await extra.decks_repository.fetch_cards({ deck_id })

  if (!deck) return null

  return {
    deck,
    cards,
  }
})

const validate_update_deck = (create: DeckUpdateState) => {
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

  if (create.front_language === create.back_language) {
    errors.push(
      "decks_actions/dialog/create_deck/errors/languages_cannot_match",
    )
  }

  return errors
}

export const update_deck = createAsyncThunk<void, void, AsyncThunkConfig>(
  "decks/update_deck",
  async (_, { getState, dispatch, extra }) => {
    const { deck_update } = getState()

    const errors = validate_update_deck(deck_update)

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

    await extra.decks_repository.update_deck({
      id: extracted.deck_id!,
      name: deck_update.title.trim(),
      front_language: deck_update.front_language,
      back_language: deck_update.back_language,
    })

    const cards = deck_update.cards
      .map((c) => ({
        id: c,
        front: deck_update.cards_map[c]?.front.trim(),
        back: deck_update.cards_map[c]?.back.trim(),
      }))
      .filter((c) => c.front || c.back)

    await extra.decks_repository.upsert_cards({
      deck_id: extracted.deck_id!,
      cards,
    })
  },
)

export const update_deck_delete_selected_cards = createAction<void>(
  "decks/update_deck_delete_selected_cards",
)

export const exit_update_deck_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "deck_update/exit_update_deck_page",
  async (_, { dispatch, extra, getState }) => {
    const { deck_id } = getState().deck_update

    extra.location_service.navigate(`/decks/${deck_id}/`)

    dispatch(reset_create_deck())
  },
)

export const _open_csv_import_dialog = createAction<{
  headers: string[]
  rows: string[][]
  selected_front: number
  selected_back: number
}>("deck_update/_open_csv_import_dialog")

export const _update_csv_import_dialog = createAction<{
  selected_front?: number
  selected_back?: number
}>("deck_update/_update_csv_import_dialog")

export const _close_csv_import_dialog = createAction(
  "decks/_close_csv_import_dialog",
)

export const import_cards_from_csv = createAsyncThunk<
  { front: string; back: string }[] | void,
  { content: string },
  AsyncThunkConfig
>("deck_update/import_cards_from_csv", async ({ content }, { dispatch }) => {
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
>("deck_update/apply_csv_import_mapping", async (_, { getState, dispatch }) => {
  const { deck_update } = getState()

  if (!deck_update.csv_import_dialog.open) return []

  const data_rows = deck_update.csv_import_dialog.rows

  const mapped = data_rows
    .map((cols) => ({
      front: cols[deck_update.csv_import_dialog.selected_front] ?? "",
      back: cols[deck_update.csv_import_dialog.selected_back] ?? "",
    }))
    .filter((r) => r.front || r.back)

  dispatch(_close_csv_import_dialog())

  return mapped
})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("deck_update/global_route_changed", async (_, { dispatch, extra }) => {
  dispatch(when_user_is_on_update_deck_page())
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
