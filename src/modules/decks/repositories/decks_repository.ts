import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export interface DecksRepository {
  sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): Promise<DeckEntity>
  fetch_cards(params: { deck_id: string }): Promise<CardEntity[]>
  fetch_decks(): Promise<DeckEntity[]>
  create_deck(params: {
    name: string
    description: string
    front_language: string
    back_language: string
  }): Promise<DeckEntity>
  update_deck(params: {
    id: string
    name?: string
    description?: string
    front_language?: string
    back_language?: string
  }): Promise<DeckEntity>
  delete_deck(params: { id: string }): Promise<DeckEntity>
}
