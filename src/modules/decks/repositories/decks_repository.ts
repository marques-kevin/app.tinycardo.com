import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export interface DecksRepository {
  fetch_decks(): Promise<DeckEntity[]>

  get_deck_by_id(params: {
    deck_id: string
    user_id: string
  }): Promise<DeckEntity>

  duplicate_deck(params: {
    deck_id: string
    user_id: string
  }): Promise<DeckEntity>

  create_deck(params: {
    name: string
    front_language: string
    back_language: string
    user_id: string
  }): Promise<DeckEntity>

  update_deck(params: {
    id: string
    name?: string
    description: string
    visibility: "public" | "private" | "unlisted"
    front_language?: string
    back_language?: string
  }): Promise<DeckEntity>

  delete_deck(params: { id: string }): Promise<void>

  fetch_cards(params: { deck_id: string }): Promise<CardEntity[]>

  get_cards_by_deck_id(params: { deck_id: string }): Promise<CardEntity[]>

  upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): Promise<void>
}
