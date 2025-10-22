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
      id: crypto.randomUUID(),
      name: params.name,
      front_language: params.front_language,
      back_language: params.back_language,
      user_id: "test",
      visibility: "private",
      created_at: new Date(),
      updated_at: new Date(),
      number_of_cards: 0,
    }

    this.decks.push(deck)
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
}
