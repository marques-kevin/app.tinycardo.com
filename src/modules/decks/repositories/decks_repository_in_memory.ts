import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { v4 } from "uuid"

export class DecksRepositoryInMemory implements DecksRepository {
  private decks: DeckEntity[] = []
  private cards: Record<string, CardEntity[]> = {}

  constructor(
    params: Partial<{
      decks?: DeckEntity[]
      cards?: CardEntity[]
    }> = {},
  ) {
    this.decks = params.decks ?? []
    this.store_cards(params.cards ?? [])
  }

  private store_cards(cards: CardEntity[]): void {
    this.cards = cards.reduce(
      (acc, card) => {
        acc[card.deck_id] = [...(acc[card.deck_id] || []), card]
        return acc
      },
      {} as Record<string, CardEntity[]>,
    )
  }

  async sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): ReturnType<DecksRepository["sync_deck"]> {
    this.decks = [...this.decks, params.deck]
    this.store_cards(params.cards)

    return params.deck
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    return this.decks.map((deck) => ({
      ...deck,
      number_of_cards: this.cards[deck.id].length,
    }))
  }

  async get_deck_by_id(params: {
    id: string
  }): ReturnType<DecksRepository["get_deck_by_id"]> {
    const decks = await this.fetch_decks()

    const deck = decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    return deck
  }

  async fetch_cards(params: {
    deck_id: string
  }): ReturnType<DecksRepository["fetch_cards"]> {
    return this.cards[params.deck_id] || []
  }

  async get_cards_by_deck_id(params: {
    deck_id: string
  }): ReturnType<DecksRepository["get_cards_by_deck_id"]> {
    return this.fetch_cards(params)
  }

  async create_deck(params: {
    name: string
    description: string
    front_language: string
    back_language: string
  }): ReturnType<DecksRepository["create_deck"]> {
    const deck: DeckEntity = {
      id: `${Date.now().toString()}-${Math.random()}`,
      name: params.name,
      description: params.description,
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
    const deck = this.decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    const updated_deck: DeckEntity = {
      ...deck,
      name: params.name ?? deck.name,
      front_language: params.front_language ?? deck.front_language,
      back_language: params.back_language ?? deck.back_language,
      updated_at: new Date(),
    }

    this.decks = this.decks.map((d) => (d.id === params.id ? updated_deck : d))

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
    this.cards[params.deck_id] = params.cards.map((card) => ({
      id: card.id || v4(),
      deck_id: params.deck_id,
      front: card.front,
      back: card.back,
    }))

    return this.cards[params.deck_id]
  }

  async duplicate_deck(params: {
    id: string
  }): ReturnType<DecksRepository["duplicate_deck"]> {
    const deck = await this.get_deck_by_id({ id: params.id })

    const new_deck = await this.create_deck({
      name: `${deck.name} (Copy)`,
      description: deck.description ?? "",
      front_language: deck.front_language,
      back_language: deck.back_language,
    })

    this.cards[new_deck.id] = this.cards[deck.id].map((card) => ({
      ...card,
      deck_id: new_deck.id,
    }))

    return new_deck
  }

  async create_card(params: {
    deck_id: string
    front: string
    back: string
  }): ReturnType<DecksRepository["create_card"]> {
    const deck_cards = this.cards[params.deck_id] || []

    const new_card: CardEntity = {
      id: v4(),
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
