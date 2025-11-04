import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"

/**
 *
 * Filters the provided list of card IDs based on a selected lesson.
 *
 * For example, if the user selects a lesson, only cards that are in the lesson should be displayed.
 *
 * If no lesson is selected, it should return only orphan cards.
 *
 */
export const deck_update_filter_cards_by_lesson = (params: {
  cards: CardEntity["id"][]
  lessons: LessonEntity[]
  lesson_id: string | null
}): CardEntity["id"][] => {
  const { cards, lessons, lesson_id } = params

  const active_lesson = lessons.find((l) => l.id === lesson_id)

  if (lesson_id === null || !active_lesson) {
    return cards.filter(
      (card_id) => !lessons.some((l) => l.cards.includes(card_id)),
    )
  }

  return cards.filter((card_id) => active_lesson.cards.includes(card_id))
}
