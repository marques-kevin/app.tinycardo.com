import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type {
  AiAssistantMessageEntity,
  AiAssistantToolDispatch,
} from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import type { AsyncThunkConfig } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export const open = createAction("ai_assistant/open")

export const close = createAction("ai_assistant/close")

export const store_new_message = createAction<AiAssistantMessageEntity>(
  "ai_assistant/store_new_message",
)

export const create_cards = createAsyncThunk<
  void,
  { cards: Array<{ front: string; back: string; lesson_id?: string | null }> },
  AsyncThunkConfig
>(
  "ai_assistant/create_cards",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const lessons = state.ai_assistant.view.lessons

    const cards = params.cards.map((card) => ({
      ...card,
      lesson_id: card.lesson_id ? lessons[card.lesson_id]?.id || null : null,
    }))

    dispatch(
      deck_update_actions.create_cards({
        cards,
      }),
    )
  },
)

export const update_cards = createAsyncThunk<
  void,
  { cards: Array<{ id: string; front: string; back: string }> },
  AsyncThunkConfig
>(
  "ai_assistant/update_cards",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const cards = state.ai_assistant.view.cards

    for (const card of params.cards) {
      dispatch(
        deck_update_actions.update_card({
          id: cards[card.id].id,
          field: "front",
          value: card.front,
        }),
      )
      dispatch(
        deck_update_actions.update_card({
          id: cards[card.id].id,
          field: "back",
          value: card.back,
        }),
      )
    }
  },
)

export const create_lessons = createAsyncThunk<
  void,
  { lessons: Array<{ name: string }> },
  AsyncThunkConfig
>(
  "ai_assistant/create_lessons",
  async (params, { getState, dispatch, extra }) => {
    for (const lesson of params.lessons) {
      await dispatch(deck_update_actions.create_lesson())
      const state = getState()

      const created_lesson =
        state.deck_update.lessons[state.deck_update.lessons.length - 1]

      if (created_lesson) {
        dispatch(
          deck_update_actions.rename_lesson({
            lesson_id: created_lesson.id,
            name: lesson.name,
          }),
        )
      }
    }
  },
)

export const update_lessons = createAsyncThunk<
  void,
  { lessons: Array<{ id: string; name: string }> },
  AsyncThunkConfig
>(
  "ai_assistant/update_lessons",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const lessons = state.ai_assistant.view.lessons

    for (const lesson of params.lessons) {
      dispatch(
        deck_update_actions.rename_lesson({
          lesson_id: lessons[lesson.id].id,
          name: lesson.name,
        }),
      )
    }
  },
)

export const delete_lessons = createAsyncThunk<
  void,
  { lesson_ids: string[] },
  AsyncThunkConfig
>(
  "ai_assistant/delete_lessons",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const lessons = state.ai_assistant.view.lessons

    for (const lesson_id of params.lesson_ids) {
      dispatch(
        deck_update_actions.delete_lesson({ lesson_id: lessons[lesson_id].id }),
      )
    }
  },
)

export const delete_cards = createAsyncThunk<
  void,
  { card_ids: string[] },
  AsyncThunkConfig
>(
  "ai_assistant/delete_cards",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const cards = state.ai_assistant.view.cards

    for (const card_id of params.card_ids) {
      dispatch(deck_update_actions.delete_card({ id: cards[card_id].id }))
    }
  },
)

export const move_cards_to_a_lesson = createAsyncThunk<
  void,
  { card_ids: string[]; lesson_id: string },
  AsyncThunkConfig
>(
  "ai_assistant/move_cards_to_a_lesson",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()
    const cards = state.ai_assistant.view.cards
    const lessons = state.ai_assistant.view.lessons

    dispatch(
      deck_update_actions.move_cards_to_a_lesson({
        card_ids: params.card_ids.map((card_id) => cards[card_id].id),
        lesson_id: lessons[params.lesson_id].id,
      }),
    )
  },
)

export const create_a_view_mapping = createAsyncThunk<
  { lessons: Array<LessonEntity>; cards: Array<CardEntity> },
  void,
  AsyncThunkConfig
>(
  "ai_assistant/create_a_view_mapping",
  async (params, { getState, dispatch, extra }) => {
    const state = getState()

    return {
      lessons: state.deck_update.lessons,
      cards: Object.values(state.deck_update.cards_map),
    }
  },
)

export const dispatch_tool = createAsyncThunk<
  unknown,
  AiAssistantToolDispatch,
  AsyncThunkConfig
>(
  "ai_assistant/dispatch_tool",
  async (params, { getState, dispatch, extra }) => {
    if (params.tool_name === "request_cards_and_lessons_context") {
      await dispatch(create_a_view_mapping())

      const state = getState()

      return params.callback({
        cards: Object.entries(state.ai_assistant.view.cards).map(
          ([id, card]) => ({
            id,
            front: card.front,
            back: card.back,
            lesson_id: card.lesson_id,
          }),
        ),
        lessons: Object.entries(state.ai_assistant.view.lessons).map(
          ([id, lesson]) => ({
            id,
            name: lesson.name,
          }),
        ),
      })
    } else if (params.tool_name === "create_cards") {
      await dispatch(
        create_cards({
          cards: params.values_returned_by_ai.cards,
        }),
      )

      return params.callback({ type: "text", value: "Cards created" })
    } else if (params.tool_name === "create_lessons") {
      await dispatch(
        create_lessons({
          lessons: params.values_returned_by_ai.lessons,
        }),
      )

      return params.callback({ type: "text", value: "Lessons created" })
    } else if (params.tool_name === "move_cards_to_a_lesson") {
      await dispatch(
        move_cards_to_a_lesson({
          card_ids: params.values_returned_by_ai.card_ids,
          lesson_id: params.values_returned_by_ai.lesson_id,
        }),
      )

      return params.callback({ type: "text", value: "Cards moved to lessons" })
    } else if (params.tool_name === "update_cards") {
      await dispatch(
        update_cards({
          cards: params.values_returned_by_ai.cards,
        }),
      )

      return params.callback({ type: "text", value: "Cards updated" })
    } else if (params.tool_name === "delete_cards") {
      await dispatch(
        delete_cards({
          card_ids: params.values_returned_by_ai.card_ids,
        }),
      )

      return params.callback({ type: "text", value: "Cards deleted" })
    } else if (params.tool_name === "update_lessons") {
      await dispatch(
        update_lessons({
          lessons: params.values_returned_by_ai.lessons,
        }),
      )

      return params.callback({ type: "text", value: "Lessons updated" })
    } else if (params.tool_name === "delete_lessons") {
      await dispatch(
        delete_lessons({
          lesson_ids: params.values_returned_by_ai.lesson_ids,
        }),
      )

      return params.callback({ type: "text", value: "Lessons deleted" })
    }

    return params.callback({
      type: "text",
      value: `Tool ${params.tool_name} not found`,
    })
  },
)

export const send_message = createAsyncThunk<
  void,
  { content: string },
  AsyncThunkConfig
>(
  "ai_assistant/send_message",
  async (params, { getState, dispatch, extra }) => {},
)
