import { createReducer } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import * as actions from "@/modules/deck_details/redux/deck_details_actions"
import type { LessonEntityWithStats } from "@/modules/decks/entities/lesson_entity"
import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"

export interface DecksDetailsState {
  deck: DeckEntity | null
  cards: CardEntity[]
  lessons: LessonEntityWithStats[]
  history: SessionHistoryEntity[]
  is_fetching: boolean
  lesson_cards_modal: {
    is_open: boolean
    lesson_id: string | null
    lesson_name: string | null
    cards: CardEntity[]
  }
}

const initial_state: DecksDetailsState = {
  deck: null,
  cards: [],
  lessons: [],
  history: [],
  is_fetching: false,
  lesson_cards_modal: {
    is_open: false,
    lesson_id: null,
    lesson_name: null,
    cards: [],
  },
}

export const decks_details_reducers = createReducer(
  initial_state,
  (builder) => {
    builder.addCase(actions.fetch_deck_details.pending, (state) => {
      state.is_fetching = true
    })

    builder.addCase(actions.fetch_deck_details.fulfilled, (state, action) => {
      state.is_fetching = false

      state.deck = action.payload.deck
      state.cards = action.payload.cards
      state.lessons = action.payload.lessons.map((lesson) => {
        const cards_in_lesson = action.payload.cards.filter((card) =>
          lesson.cards.includes(card.id),
        )

        const history_cards_in_lesson = action.payload.history.filter(
          (history) =>
            cards_in_lesson.some((card) => card.id === history.card_id),
        )

        return {
          ...lesson,
          number_of_cards: cards_in_lesson.length,
          number_of_cards_ready_to_be_reviewed: history_cards_in_lesson.filter(
            (history) => history.next_due_at < new Date(),
          ).length,
          number_of_cards_not_ready_to_be_reviewed:
            history_cards_in_lesson.filter(
              (history) => history.next_due_at >= new Date(),
            ).length,
        }
      })
      state.history = action.payload.history

      const cards_not_in_lessons = action.payload.cards.filter(
        (card) =>
          !action.payload.lessons?.some((lesson) =>
            lesson.cards.includes(card.id),
          ),
      )

      if (cards_not_in_lessons.length > 0) {
        const history_other_cards = action.payload.history.filter((history) =>
          cards_not_in_lessons.some((card) => card.id === history.card_id),
        )

        state.lessons = [
          ...state.lessons,
          {
            id: "__other__",
            name: "__other__",
            deck_id: action.payload.deck.id,
            cards: cards_not_in_lessons.map((card) => card.id),
            position: state.lessons.length + 1,
            created_at: new Date(),
            updated_at: new Date(),
            number_of_cards: cards_not_in_lessons.length,
            number_of_cards_ready_to_be_reviewed: history_other_cards.filter(
              (history) => history.next_due_at < new Date(),
            ).length,
            number_of_cards_not_ready_to_be_reviewed:
              history_other_cards.filter(
                (history) => history.next_due_at >= new Date(),
              ).length,
          },
        ]
      }
    })

    builder.addCase(actions.fetch_deck_details.rejected, (state) => {
      state.is_fetching = false
    })

    builder.addCase(
      actions.open_lesson_cards_modal.fulfilled,
      (state, action) => {
        const lesson = state.lessons.find(
          (l) => l.id === action.payload.lesson_id,
        )
        const cards = lesson
          ? state.cards.filter((card) => lesson.cards.includes(card.id))
          : []

        state.lesson_cards_modal.is_open = true
        state.lesson_cards_modal.lesson_id = action.payload.lesson_id
        state.lesson_cards_modal.lesson_name = lesson?.name || null
        state.lesson_cards_modal.cards = cards
      },
    )

    builder.addCase(actions.close_lesson_cards_modal.fulfilled, (state) => {
      state.lesson_cards_modal.is_open = false
    })
  },
)
