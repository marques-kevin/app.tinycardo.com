import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import { seed_discover_decks } from "./seed_discover_decks"

export const seed_decks: DeckEntity[] = [
  {
    id: "1",
    name: "Learn simple spanish words",
    description:
      "This deck contains simple Spanish vocabulary for beginners. It covers essential words and phrases that you'll need to start speaking Spanish. Perfect for building a basic foundation in Spanish language learning.",
    front_language: "en",
    back_language: "es",
    user_id: "1",
    updated_at: new Date("2025-06-01"),
    created_at: new Date("2025-01-01"),
    visibility: "private",
    number_of_cards: 20,
    number_of_cards_ready_to_be_reviewed: 10,
    number_of_cards_not_ready_to_be_reviewed: 10,
    number_of_users_using_this_deck: 1,
  },
  {
    id: "french-to-korean",
    name: "Apprendre le coréen en s'amusant",
    description:
      "Ce paquet de cartes contient du vocabulaire coréen pour débutants. Il couvre les mots et expressions essentiels dont vous aurez besoin pour commencer à parler coréen. Parfait pour construire une base solide dans l'apprentissage de la langue coréenne.",
    front_language: "fr",
    back_language: "ko",
    user_id: "1",
    updated_at: new Date("2025-06-01"),
    created_at: new Date("2025-01-01"),
    visibility: "private",
    number_of_cards: 0,
    number_of_cards_ready_to_be_reviewed: 5,
    number_of_cards_not_ready_to_be_reviewed: 5,
    number_of_users_using_this_deck: 1,
  },
  ...seed_discover_decks.map((deck) => ({
    id: deck.id,
    name: deck.name,
    front_language: deck.front_language,
    back_language: deck.back_language,
    user_id: "unknown",
    description: null,
    visibility: "unlisted" as const,
    number_of_cards: deck.number_of_cards_in_the_deck,
    number_of_cards_ready_to_be_reviewed: 0,
    number_of_cards_not_ready_to_be_reviewed: 0,
    number_of_users_using_this_deck: deck.number_of_users_using_this_deck,
    updated_at: deck.updated_at,
    created_at: deck.created_at,
  })),
]
