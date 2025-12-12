import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"

export interface AiAssistantState {
  is_open: boolean
  is_fetching: boolean
  view: {
    lessons: Record<string, LessonEntity>
    cards: Record<string, CardEntity & { lesson_id: string }>
  }
}

const initialState: AiAssistantState = {
  is_open: false,
  is_fetching: false,
  view: {
    lessons: {},
    cards: {},
  },
}

export const ai_assistant_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions.open, (state) => {
    state.is_open = true
  })

  builder.addCase(actions.close, (state) => {
    state.is_open = false
  })

  builder.addCase(actions.send_message.pending, (state) => {
    state.is_fetching = true
  })

  builder.addCase(actions.send_message.fulfilled, (state) => {
    state.is_fetching = false
  })

  builder.addCase(actions.send_message.rejected, (state) => {
    state.is_fetching = false
  })

  builder.addCase(actions.create_a_view_mapping.fulfilled, (state, action) => {
    const card_to_lesson_id_map: Record<string, string> = {}

    state.view.lessons = action.payload.lessons.reduce(
      (acc, lesson) => {
        acc[lesson.id] = lesson
        lesson.cards.forEach((card_id) => {
          card_to_lesson_id_map[card_id] = lesson.id
        })
        return acc
      },
      {} as Record<string, LessonEntity>,
    )

    state.view.cards = action.payload.cards.reduce(
      (acc, card) => {
        acc[card.id] = {
          ...card,
          lesson_id: card_to_lesson_id_map[card.id] || "",
        }
        return acc
      },
      {} as Record<string, CardEntity & { lesson_id: string }>,
    )
  })
})
