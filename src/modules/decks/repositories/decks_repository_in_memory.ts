import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export class DecksRepositoryInMemory implements DecksRepository {
  private decks: DeckEntity[] = []
  private cards: Record<string, CardEntity[]> = {}

  async sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): ReturnType<DecksRepository["sync_deck"]> {
    this.decks = [...this.decks, params.deck]
    this.cards[params.deck.id] = params.cards

    return params.deck
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    return this.decks
  }

  async fetch_cards(params: {
    deck_id: string
  }): ReturnType<DecksRepository["fetch_cards"]> {
    return this.cards[params.deck_id]
  }

  async create_deck(params: {
    name: string
    description: string
    front_language: string
    back_language: string
  }): ReturnType<DecksRepository["create_deck"]> {
    const deck: DeckEntity = {
      id: `${Date.now().toString()}/${Math.random()}`,
      name: params.name,
      front_language: params.front_language,
      back_language: params.back_language,
      user_id: "test",
      visibility: "private",
      created_at: new Date(),
      updated_at: new Date(),
      number_of_cards: 0,
    }

    this.decks = [...this.decks, deck]

    return deck
  }

  async update_deck(params: {
    id: string
    name?: string
    description?: string
    front_language?: string
    back_language?: string
  }): ReturnType<DecksRepository["update_deck"]> {
    const deck_index = this.decks.findIndex((d) => d.id === params.id)

    if (deck_index === -1) {
      throw new Error("Deck not found")
    }

    const updated_deck: DeckEntity = {
      ...this.decks[deck_index],
      name: params.name ?? this.decks[deck_index].name,
      front_language:
        params.front_language ?? this.decks[deck_index].front_language,
      back_language:
        params.back_language ?? this.decks[deck_index].back_language,
      updated_at: new Date(),
    }

    this.decks[deck_index] = updated_deck
    return updated_deck
  }

  async delete_deck(params: {
    id: string
  }): ReturnType<DecksRepository["delete_deck"]> {
    const deck = this.decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    this.decks = this.decks.filter((d) => d.id !== params.id)
    delete this.cards[params.id]

    return deck
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<DecksRepository["upsert_cards"]> {
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
  }): ReturnType<DecksRepository["create_card"]> {
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
  }): ReturnType<DecksRepository["update_card"]> {
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
  }): ReturnType<DecksRepository["delete_card"]> {
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
