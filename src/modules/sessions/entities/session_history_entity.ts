import { type CardEntity } from "@/modules/decks/entities/card_entity"

export interface SessionHistoryEntity {
  deck_id: string
  card_id: string
  repetition_count: number
  ease_factor: number
  next_due_at: Date
  last_reviewed_at: Date
}

export type SessionHistoryWithCardEntity = SessionHistoryEntity & {
  front: CardEntity["front"]
  back: CardEntity["back"]
}
