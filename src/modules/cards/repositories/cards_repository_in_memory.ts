import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { CardsRepository } from "@/modules/cards/repositories/cards_repository"

export class CardsRepositoryInMemory implements CardsRepository {
  private cards: Record<string, CardEntity[]> = {}

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<CardsRepository["upsert_cards"]> {
    const deck_cards = this.cards[params.deck_id] || []

    const upserted_cards: CardEntity[] = params.cards.map((card) => {
      if (card.id) {
        // Update existing card
        const existing_card_index = deck_cards.findIndex(
          (c) => c.id === card.id,
        )
        if (existing_card_index !== -1) {
          return {
            ...deck_cards[existing_card_index],
            front: card.front,
            back: card.back,
          }
        }
      }

      // Create new card
      return {
        id: card.id || crypto.randomUUID(),
        deck_id: params.deck_id,
        front: card.front,
        back: card.back,
      }
    })

    // Merge with existing cards
    const updated_deck_cards = [...deck_cards]
    upserted_cards.forEach((card) => {
      const index = updated_deck_cards.findIndex((c) => c.id === card.id)
      if (index !== -1) {
        updated_deck_cards[index] = card
      } else {
        updated_deck_cards.push(card)
      }
    })

    this.cards[params.deck_id] = updated_deck_cards

    return upserted_cards
  }

  async create_card(params: {
    deck_id: string
    front: string
    back: string
  }): ReturnType<CardsRepository["create_card"]> {
    const deck_cards = this.cards[params.deck_id] || []

    const new_card: CardEntity = {
      id: crypto.randomUUID(),
      deck_id: params.deck_id,
      front: params.front,
      back: params.back,
    }

    this.cards[params.deck_id] = [...deck_cards, new_card]

    return new_card
  }

  async update_card(params: {
    card_id: string
    front?: string
    back?: string
  }): ReturnType<CardsRepository["update_card"]> {
    // Find the deck that contains this card
    let found_card: CardEntity | null = null
    let deck_id: string | null = null

    for (const [did, cards] of Object.entries(this.cards)) {
      const card = cards.find((c) => c.id === params.card_id)
      if (card) {
        found_card = card
        deck_id = did
        break
      }
    }

    if (!found_card || !deck_id) {
      throw new Error("Card not found")
    }

    const updated_card: CardEntity = {
      ...found_card,
      front: params.front ?? found_card.front,
      back: params.back ?? found_card.back,
    }

    const deck_cards = this.cards[deck_id]
    const card_index = deck_cards.findIndex((c) => c.id === params.card_id)
    deck_cards[card_index] = updated_card

    return updated_card
  }

  async delete_card(params: {
    card_id: string
  }): ReturnType<CardsRepository["delete_card"]> {
    let found_card: CardEntity | null = null
    let deck_id: string | null = null

    for (const [did, cards] of Object.entries(this.cards)) {
      const card = cards.find((c) => c.id === params.card_id)
      if (card) {
        found_card = card
        deck_id = did
        break
      }
    }

    if (!found_card || !deck_id) {
      throw new Error("Card not found")
    }

    this.cards[deck_id] = this.cards[deck_id].filter(
      (c) => c.id !== params.card_id,
    )
  }
}
