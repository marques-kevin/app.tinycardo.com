import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export const seed_discover_decks: DiscoverDeckEntity[] = [
  {
    id: "1",
    name: "Deck 1",
    front_language: "en",
    back_language: "es",
    number_of_cards_in_the_deck: 234,
    number_of_users_using_this_deck: 986543,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "2",
    name: "Deck 2",
    front_language: "en",
    back_language: "es",
    number_of_cards_in_the_deck: 123,
    number_of_users_using_this_deck: 456789,
    created_at: new Date(),
    updated_at: new Date(),
  },
]
