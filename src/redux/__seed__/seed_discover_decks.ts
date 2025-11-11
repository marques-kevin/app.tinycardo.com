import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export const seed_discover_decks: DiscoverDeckEntity[] = Array.from({
  length: 10,
}).map((_, index) => ({
  id: `deck-${index + 1}`,
  name: `Deck ${index + 1}`,
  front_language: "en",
  back_language: "fr",
  user_id: "unknown",
  number_of_cards_in_the_deck: 234,
  number_of_users_using_this_deck: 986543,
  created_at: new Date(),
  updated_at: new Date(),
}))
