import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export interface DecksRepository {
  sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): Promise<DeckEntity>

  fetch_decks(): Promise<DeckEntity[]>

  create_deck(params: {
    name: string
    front_language: string
    back_language: string
  }): Promise<DeckEntity>

  update_deck(params: {
    id: string
    name?: string
    front_language?: string
    back_language?: string
  }): Promise<DeckEntity>

  delete_deck(params: { id: string }): Promise<DeckEntity>

  fetch_cards(params: { deck_id: string }): Promise<CardEntity[]>

  upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): Promise<CardEntity[]>

  create_card(params: {
    deck_id: string
    front: string
    back: string
  }): Promise<CardEntity>

  update_card(params: {
    card_id: string
    front?: string
    back?: string
  }): Promise<CardEntity>

  delete_card(params: { card_id: string }): Promise<void>
}
