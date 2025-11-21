import { seed_decks } from "./seed_decks"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export const seed_cards_french_to_korean: CardEntity[] = [
  {
    id: "french-to-korean-1",
    deck_id: "french-to-korean",
    front: "Je vais au marché ce matin.",
    back: "오늘 아침에 시장에 가요.",
    front_audio_url: "http://localhost:5173/seed/audio/404.mp3",
    back_audio_url: "http://localhost:5173/seed/audio/back.mp3",
  },
  {
    id: "french-to-korean-2",
    deck_id: "french-to-korean",
    front: "Hier j'ai mangé avec mes parents et c'était délicieux.",
    back: "어제 저녁에 부모님과 함께 식사를 했고 맛있었어요.",
    front_audio_url: "http://localhost:5173/seed/audio/404.mp3",
    back_audio_url: "http://localhost:5173/seed/audio/back.mp3",
  },
]

export const seed_cards: CardEntity[] = seed_decks
  .flatMap((deck) =>
    Array.from({ length: deck.number_of_cards }, (_, i) => ({
      id: `${deck.id}-${i + 1}`,
      deck_id: deck.id,
      front: `${deck.front_language} ${i + 1}`,
      back: `${deck.back_language} ${i + 1}`,
      front_audio_url: "http://localhost:5173/seed/audio/404.mp3",
      back_audio_url: "http://localhost:5173/seed/audio/back.mp3",
    })),
  )
  .concat(seed_cards_french_to_korean)
