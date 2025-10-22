import type { CardEntity } from "@/modules/decks/entities/card_entity"

export interface CardsRepository {
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
