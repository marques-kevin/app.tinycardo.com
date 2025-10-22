import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { CardsRepository } from "@/modules/cards/repositories/cards_repository"

export class CardsRepositoryLocalStorage implements CardsRepository {
  private readonly cards_key = "cards"

  private get_item<T>(key: string): T | null {
    const item = localStorage.getItem(key)

    if (!item) return null

    try {
      return JSON.parse(item) as T
    } catch {
      return null
    }
  }

  private set_item<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // noop: storage might be unavailable
    }
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<CardsRepository["upsert_cards"]> {
    const all_cards =
      this.get_item<Record<string, CardEntity[]>>(this.cards_key) || {}
    const deck_cards = all_cards[params.deck_id] || []

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

    all_cards[params.deck_id] = updated_deck_cards
    this.set_item(this.cards_key, all_cards)

    return upserted_cards
  }

  async create_card(params: {
    deck_id: string
    front: string
    back: string
  }): ReturnType<CardsRepository["create_card"]> {
    const all_cards =
      this.get_item<Record<string, CardEntity[]>>(this.cards_key) || {}
    const deck_cards = all_cards[params.deck_id] || []

    const new_card: CardEntity = {
      id: crypto.randomUUID(),
      deck_id: params.deck_id,
      front: params.front,
      back: params.back,
    }

    all_cards[params.deck_id] = [...deck_cards, new_card]
    this.set_item(this.cards_key, all_cards)

    return new_card
  }

  async update_card(params: {
    card_id: string
    front?: string
    back?: string
  }): ReturnType<CardsRepository["update_card"]> {
    const all_cards =
      this.get_item<Record<string, CardEntity[]>>(this.cards_key) || {}

    // Find the deck that contains this card
    let found_card: CardEntity | null = null
    let deck_id: string | null = null

    for (const [did, cards] of Object.entries(all_cards)) {
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

    const deck_cards = all_cards[deck_id]
    const card_index = deck_cards.findIndex((c) => c.id === params.card_id)
    deck_cards[card_index] = updated_card

    this.set_item(this.cards_key, all_cards)

    return updated_card
  }

  async delete_card(params: {
    card_id: string
  }): ReturnType<CardsRepository["delete_card"]> {
    const all_cards =
      this.get_item<Record<string, CardEntity[]>>(this.cards_key) || {}

    // Find the deck that contains this card
    let found_card: CardEntity | null = null
    let deck_id: string | null = null

    for (const [did, cards] of Object.entries(all_cards)) {
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

    all_cards[deck_id] = all_cards[deck_id].filter(
      (c) => c.id !== params.card_id,
    )
    this.set_item(this.cards_key, all_cards)

    return found_card
  }
}
