import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { uniqBy } from "ramda"

export class DecksRepositoryLocalStorage implements DecksRepository {
  private readonly decks_key = "decks"
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

  async sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): ReturnType<DecksRepository["sync_deck"]> {
    const decks = await this.fetch_decks()
    const all_cards = this.get_item<Record<string, CardEntity[]>>(`cards`) || {}

    const updated_decks = uniqBy((d: DeckEntity) => d.id)([
      params.deck,
      ...decks,
    ])
    const updated_deck_cards = { ...all_cards, [params.deck.id]: params.cards }

    this.set_item(this.decks_key, updated_decks)
    this.set_item(this.cards_key, updated_deck_cards)

    return params.deck
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    return this.get_item<DeckEntity[]>(this.decks_key) || []
  }

  async fetch_cards(params: {
    deck_id: string
  }): ReturnType<DecksRepository["fetch_cards"]> {
    const deck_cards =
      this.get_item<Record<string, CardEntity[]>>(`cards`) || {}

    return deck_cards[params.deck_id] || []
  }

  async create_deck(params: {
    name: string
    description: string
    front_language: string
    back_language: string
  }): ReturnType<DecksRepository["create_deck"]> {
    const deck: DeckEntity = {
      id: crypto.randomUUID(),
      name: params.name,
      front_language: params.front_language,
      back_language: params.back_language,
      user_id: "local",
      visibility: "private",
      created_at: new Date(),
      updated_at: new Date(),
      number_of_cards: 0,
    }

    const decks = await this.fetch_decks()
    this.set_item(this.decks_key, [...decks, deck])

    return deck
  }

  async update_deck(params: {
    id: string
    name?: string
    description?: string
    front_language?: string
    back_language?: string
  }): ReturnType<DecksRepository["update_deck"]> {
    const decks = await this.fetch_decks()
    const deck_index = decks.findIndex((d) => d.id === params.id)

    if (deck_index === -1) {
      throw new Error("Deck not found")
    }

    const updated_deck: DeckEntity = {
      ...decks[deck_index],
      name: params.name ?? decks[deck_index].name,
      front_language: params.front_language ?? decks[deck_index].front_language,
      back_language: params.back_language ?? decks[deck_index].back_language,
      updated_at: new Date(),
    }

    decks[deck_index] = updated_deck
    this.set_item(this.decks_key, decks)

    return updated_deck
  }

  async delete_deck(params: {
    id: string
  }): ReturnType<DecksRepository["delete_deck"]> {
    const decks = await this.fetch_decks()
    const deck = decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    const filtered_decks = decks.filter((d) => d.id !== params.id)
    this.set_item(this.decks_key, filtered_decks)

    // Also remove cards for this deck
    const all_cards = this.get_item<Record<string, CardEntity[]>>(`cards`) || {}
    delete all_cards[params.id]
    this.set_item(this.cards_key, all_cards)

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
  }): ReturnType<DecksRepository["create_card"]> {
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
  }): ReturnType<DecksRepository["update_card"]> {
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
  }): ReturnType<DecksRepository["delete_card"]> {
    const all_cards =
      this.get_item<Record<string, CardEntity[]>>(this.cards_key) || {}

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
  }
}
