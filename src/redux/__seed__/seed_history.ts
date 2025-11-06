import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"
import { seed_cards } from "./seed_cards"

export const seed_history: SessionHistoryEntity[] = seed_cards.flatMap(
  (card) => {
    return {
      card_id: card.id,
      deck_id: card.deck_id,
      ease_factor: 2.5,
      last_reviewed_at: new Date("1999-01-01"),
      next_due_at: new Date("2025-01-01"),
      repetition_count: 1,
    }
  },
)
