import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

export const seed_decks: DeckEntity[] = [
  {
    id: "1",
    name: "Deck 1",
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
    name: "Deck 2",
    front_language: "en",
    back_language: "es",
    user_id: "1",
    updated_at: new Date(),
    created_at: new Date(),
    visibility: "private",
    number_of_cards: 123,
  },
]
