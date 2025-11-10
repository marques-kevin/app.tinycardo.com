import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import { seed_decks } from "./seed_decks"
import { seed_cards } from "./seed_cards"

export const seed_lessons: LessonEntity[] = [
  {
    id: "1",
    name: "Verbs",
    deck_id: seed_decks[0].id,
    cards: seed_cards
      .slice(0, 10)
      .filter((card) => card.deck_id === seed_decks[0].id)
      .map((card) => card.id),
    position: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]
