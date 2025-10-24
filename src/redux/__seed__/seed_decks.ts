import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

export const seed_decks: DeckEntity[] = [
  {
    id: "1",
    name: "Learn simple spanish words",
    front_language: "en",
    back_language: "es",
    user_id: "1",
    updated_at: new Date(),
    created_at: new Date(),
    visibility: "private",
    number_of_cards: 234,
  },
  {
    id: "2",
    name: "Apprendre le coréen en s'amusant",
    front_language: "fr",
    back_language: "ko",
    user_id: "1",
    updated_at: new Date(),
    created_at: new Date(),
    visibility: "private",
    number_of_cards: 123,
  },
]
