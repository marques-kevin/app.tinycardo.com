import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import { parse_csv_to_json } from "@/modules/decks/utils/parse_csv_to_json"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { open as open_dialog } from "@/modules/dialog/redux/dialog_actions"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import type { MessageI18nKeys } from "@/intl"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import { v4 } from "uuid"

/**
 *
 * ------------------------------------------------------------
 *
 *
 *
 *
 *
 *
 * CARDS ACTIONS
 *
 *
 *
 *
 *
 *
 * ------------------------------------------------------------
 *
 */
export const toggle_select_card = createAction<{
  card_id: string
}>("deck_update/toggle_select_card")

export const toggle_select_all_cards = createAction<void>(
  "decks/toggle_select_all_cards",
)

export const update_card = createAction<{
  id: string
  field: "front" | "back"
  value: string
}>("deck_update/update_card")

export const update_field = createAction<
  Partial<
    Omit<
      DeckEntity,
      | "id"
      | "user_id"
      | "updated_at"
      | "created_at"
      | "number_of_cards"
      | "number_of_cards_ready_to_be_reviewed"
      | "number_of_cards_not_ready_to_be_reviewed"
      | "number_of_users_using_this_deck"
    >
  >
>("deck_update/update_field")

export const reset_create_deck = createAction("deck_update/reset_create_deck")

export const load_deck_into_create_form = createAsyncThunk<
  { deck: DeckEntity; cards: CardEntity[]; lessons: LessonEntity[] } | null,
  { deck_id: string },
  AsyncThunkConfig
>(
  "deck_update/load_deck_into_create_form",
  async ({ deck_id }, { extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) return null

    const deck = await extra.decks_repository.get_deck_by_id({
      deck_id: deck_id,
      user_id: authentication.user.id,
    })
    const cards = await extra.decks_repository.fetch_cards({ deck_id })
    const lessons = await extra.decks_repository.fetch_lessons({
      deck_id,
      user_id: authentication.user.id,
    })

    if (!deck) throw new Error(`Deck not found`)

    return {
      deck,
      cards,
      lessons,
    }
  },
)

const validate_update_deck = (params: {
  deck: DeckEntity
  cards: CardEntity[]
}) => {
  const errors: MessageI18nKeys[] = []

  if (!params.deck.name || params.deck.name.trim().length === 0) {
    errors.push("decks_actions/dialog/create_deck/errors/title_required")
  }
  if (params.deck.name.trim().length > 50) {
    errors.push("decks_actions/dialog/create_deck/errors/title_too_long")
  }
  if (params.cards.length < 1) {
    errors.push("decks_actions/dialog/create_deck/errors/at_least_one_card")
  }
  if (params.cards.filter((c) => c.front.trim() && c.back.trim()).length < 1) {
    errors.push("decks_actions/dialog/create_deck/errors/at_least_one_card")
  }

  if (params.deck.front_language === params.deck.back_language) {
    errors.push(
      "decks_actions/dialog/create_deck/errors/languages_cannot_match",
    )
  }

  return errors
}

export const save = createAsyncThunk<void, void, AsyncThunkConfig>(
  "deck_update/save",
  async (_, { getState, dispatch, extra }) => {
    const { deck_update, authentication } = getState()

    if (!authentication.user) throw new Error("user cannot be null")
    if (!deck_update.deck) throw new Error("deck cannot be null")

    const errors = validate_update_deck({
      deck: deck_update.deck,
      cards: deck_update.cards.map((c) => deck_update.cards_map[c]),
    })

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

    if (!deck_update.deck) throw new Error("deck cannot be null")

    await extra.decks_repository.update_deck({
      id: deck_update.deck.id,
      name: deck_update.deck.name,
      front_language: deck_update.deck.front_language,
      back_language: deck_update.deck.back_language,
      description: deck_update.deck.description ?? "",
      visibility: deck_update.deck.visibility,
    })

    const cards = deck_update.cards
      .map((c) => ({
        id: c,
        front: deck_update.cards_map[c]?.front.trim(),
        back: deck_update.cards_map[c]?.back.trim(),
      }))
      .filter((c) => c.front || c.back)

    await extra.decks_repository.upsert_cards({
      deck_id: deck_update.deck.id,
      cards,
    })

    await extra.decks_repository.upsert_lessons({
      user_id: authentication.user!.id,
      deck_id: deck_update.deck.id,
      lessons: deck_update.lessons.map((lesson) => ({
        ...lesson,
        cards: lesson.cards.filter((card_id) =>
          cards.some((c) => c.id === card_id),
        ),
      })),
    })

    await extra.toast_service.toast({
      title: "deck_update_actions/toast/deck_updated",
      description: "deck_update_actions/toast/deck_updated/description",
      type: "success",
    })
  },
)

export const delete_selected_cards = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("deck_update/delete_selected_cards", async (_, { extra }) => {})

export const exit_update_deck_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "deck_update/exit_update_deck_page",
  async (_, { dispatch, extra, getState }) => {
    const { deck } = getState().deck_update

    extra.location_service.navigate(`/decks/${deck?.id}/`)

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

  if (!deck_update.csv_import_dialog.is_open) return []

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

export const when_user_is_on_update_deck_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "deck_update/when_user_is_on_update_deck_page",
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

/**
 * ------------------------------------------------------------
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
 * ------------------------------------------------------------
 */

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("deck_update/global_route_changed", async (_, { dispatch }) => {
  dispatch(when_user_is_on_update_deck_page())
})

/**
 * ------------------------------------------------------------
 *
 *
 *
 *
 *
 *
 *
 * LESSON ACTIONS
 *
 *
 *
 *
 *
 *
 *
 * ------------------------------------------------------------
 */

export const open_rename_lesson_modal = createAction<{ lesson_id: string }>(
  "deck_update/open_rename_lesson_modal",
)

export const close_rename_lesson_modal = createAction(
  "deck_update/close_rename_lesson_modal",
)

export const set_active_lesson = createAction<{ lesson_id: string | null }>(
  "deck_update/set_active_lesson",
)

export const open_add_cards_to_lesson_modal = createAction(
  "deck_update/open_add_cards_to_lesson_modal",
)

export const close_add_cards_to_lesson_modal = createAction(
  "deck_update/close_add_cards_to_lesson_modal",
)

export const open_reorder_lessons_modal = createAction(
  "deck_update/open_reorder_lessons_modal",
)

export const close_reorder_lessons_modal = createAction(
  "deck_update/close_reorder_lessons_modal",
)

export const add_selected_cards_to_lesson = createAsyncThunk<
  { lesson_id: string },
  { lesson_id: string },
  AsyncThunkConfig
>(
  "deck_update/set_add_cards_to_lesson_selected_lesson",
  async ({ lesson_id }, { extra }) => {
    await extra.toast_service.toast({
      title:
        "deck_update_actions/toast/set_add_cards_to_lesson_selected_lesson",
      type: "success",
    })

    return { lesson_id }
  },
)

export const create_lesson = createAsyncThunk<
  LessonEntity,
  void,
  AsyncThunkConfig
>("deck_update/create_lesson", async (_, { getState, extra }) => {
  const { deck_update } = getState()

  const lesson: LessonEntity = {
    id: v4(),
    deck_id: deck_update.deck!.id,
    name: "Untitled",
    cards: [],
    position: deck_update.lessons.length,
    created_at: new Date(),
    updated_at: new Date(),
  }

  return lesson
})

export const rename_lesson = createAsyncThunk<
  LessonEntity,
  { lesson_id: string; name: string },
  AsyncThunkConfig
>("deck_update/rename_lesson", async (_, { getState, extra }) => {
  const { deck_update } = getState()

  if (!deck_update.deck) {
    throw new Error("Deck not found")
  }

  const lesson = deck_update.lessons.find((l) => l.id === _.lesson_id)

  if (!lesson) {
    throw new Error("Lesson not found")
  }

  extra.toast_service.toast({
    title: "deck_update_actions/toast/lesson_renamed",
    description: "deck_update_actions/toast/lesson_renamed/description",
    type: "success",
  })

  return {
    ...lesson,
    name: _.name,
  }
})

export const delete_lesson = createAsyncThunk<
  { lesson_id: string },
  { lesson_id: string },
  AsyncThunkConfig
>("deck_update/delete_lesson", async ({ lesson_id }, { extra }) => {
  await extra.toast_service.toast({
    title: "deck_update_actions/toast/lesson_deleted",
    description: "deck_update_actions/toast/lesson_deleted/description",
    type: "success",
  })

  return { lesson_id }
})

export const reorder_lessons = createAsyncThunk<
  void,
  { reorder_data: Array<{ lesson_id: string; position: number }> },
  AsyncThunkConfig
>(
  "deck_update/reorder_lessons",
  async ({ reorder_data }, { getState, extra }) => {
    const { deck_update, authentication } = getState()

    if (!authentication.user) {
      throw new Error("User not authenticated")
    }

    if (!deck_update.deck) {
      throw new Error("Deck not found")
    }

    await extra.toast_service.toast({
      title: "deck_update_reorder_lessons_modal/lessons_reordered",
      type: "success",
    })
  },
)
