import { seed_decks } from "./seed_decks"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export const seed_cards: CardEntity[] = seed_decks.flatMap((deck) =>
  Array.from({ length: deck.number_of_cards }, (_, i) => ({
    id: `${deck.id}-${i + 1}`,
    deck_id: deck.id,
    front: `${deck.front_language} ${i + 1}`,
    back: `${deck.back_language} ${i + 1}`,
  })),
)
