import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

export type LessonEntity = {
  id: string
  name: string
  deck_id: DeckEntity["id"]
  cards: CardEntity["id"][]
  position: number
  created_at: Date
  updated_at: Date
}

export type LessonEntityWithStats = LessonEntity & {
  number_of_cards: number
  number_of_cards_ready_to_be_reviewed: number
  number_of_cards_not_ready_to_be_reviewed: number
}
