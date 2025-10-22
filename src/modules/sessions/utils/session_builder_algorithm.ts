import type { CardEntity } from "@/modules/decks/entities/card_entity"
import {
  type SessionHistoryEntity,
  type SessionHistoryWithCardEntity,
} from "@/modules/sessions/entities/session_history_entity"
import { BASE_EASE_FACTOR } from "@/modules/sessions/utils/flashcards_due_date_algorithm"
import { shuffle } from "lodash"

/**
 * Filter the flashcard history by status
 *
 * @param flashcard_history - Array of flashcard history
 * @param status - Status to filter by
 * @returns Array of flashcard history filtered by status
 */
const filter_by_status = <T extends { next_due_at: Date }>(
  flashcard_history: T[],
  status: "due" | "not_due",
): T[] => {
  return flashcard_history.filter(
    (history) =>
      status === (history.next_due_at > new Date() ? "not_due" : "due"),
  )
}

/**
 * This algorithm builds a list of cards to review
 */
export const session_builder_algorithm = (params: {
  cards: CardEntity[]
  history: SessionHistoryEntity[]
  mode?: "review" | "learn_new_words" | "randomized"
  count?: number
}): SessionHistoryWithCardEntity[] => {
  const { cards, history, count = 10, mode = "review" } = params

  const history_to_card_entity = history.map(
    (history): SessionHistoryWithCardEntity => ({
      ...history,
      front: cards.find((card) => card.id === history.card_id)!.front,
      back: cards.find((card) => card.id === history.card_id)!.back,
    }),
  )

  if (mode === "randomized") {
    return shuffle(history_to_card_entity).slice(0, count)
  }

  const due_words = filter_by_status(history_to_card_entity, "due")

  if (mode === "review") {
    return shuffle(due_words).slice(0, count)
  }

  if (mode === "learn_new_words") {
    const never_reviewed_words = cards.filter(
      (card) => !history_to_card_entity.some((h) => h.card_id === card.id),
    )

    const shuffled_never_reviewed_words = shuffle(never_reviewed_words)

    return shuffled_never_reviewed_words
      .map(
        (card): SessionHistoryWithCardEntity => ({
          card_id: card.id,
          last_reviewed_at: new Date(),
          deck_id: card.deck_id,
          repetition_count: 0,
          ease_factor: BASE_EASE_FACTOR,
          next_due_at: new Date(),
          front: card.front,
          back: card.back,
        }),
      )
      .slice(0, count)
  }

  throw new Error(`Invalid mode: ${mode}`)
}
