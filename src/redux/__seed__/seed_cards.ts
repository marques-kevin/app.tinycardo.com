import { seed_decks } from "./seed_decks"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export const seed_cards: CardEntity[] = seed_decks.flatMap((deck) =>
  Array.from({ length: deck.number_of_cards }, (_, i) => ({
    id: `${deck.id}-${i + 1}`,
    deck_id: deck.id,
    front: i % 2 === 0 ? `Bonjour` : `Comment tu vas ?`,
    back: i % 2 === 0 ? `안녕하세요` : `어떻게 지내세요 ?`,
  })),
)
