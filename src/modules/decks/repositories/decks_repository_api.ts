import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class DecksRepositoryApi implements DecksRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async sync_deck(params: {
    deck: DeckEntity
    cards: CardEntity[]
  }): ReturnType<DecksRepository["sync_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/update_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/update_deck", {
      id: params.deck.id,
      name: params.deck.name,
      front_language: params.deck.front_language,
      back_language: params.deck.back_language,
    })

    // Then, upsert the cards
    await this.api_service.post("/decks/upsert_cards", {
      deck_id: params.deck.id,
      cards: params.cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
      })),
    })

    return {
      id: deck_response.id,
      name: deck_response.name,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: "public",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    const data = await this.api_service.post<
      paths["/decks/get_decks"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/get_decks", {})

    return data.map((deck) => ({
      id: deck.id,
      name: deck.name,
      front_language: deck.front_language,
      back_language: deck.back_language,
      user_id: deck.user_id,
      created_at: new Date(deck.created_at),
      updated_at: new Date(deck.updated_at),
      number_of_cards: 0,
      visibility: "public",
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
    const data = await this.api_service.post<
      paths["/cards/get_cards"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/cards/get_cards", {
      deck_id: params.deck_id,
    })

    return data.map((card) => ({
      id: card.id,
      deck_id: card.deck_id,
      front: card.front,
      back: card.back,
    }))
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
    const deck_response = await this.api_service.post<
      paths["/decks/create_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/create_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: "public",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }

  async update_deck(params: {
    id: string
    name?: string
    description?: string
    front_language?: string
    back_language?: string
  }): ReturnType<DecksRepository["update_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/update_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/update_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: "public",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }

  async delete_deck(params: {
    id: string
  }): ReturnType<DecksRepository["delete_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/delete_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/delete_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: "public",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<DecksRepository["upsert_cards"]> {
    await this.api_service.post<
      paths["/decks/upsert_cards"]["post"]["responses"]["201"]
    >("/decks/upsert_cards", {
      deck_id: params.deck_id,
      cards: params.cards,
    })

    // The upsert_cards endpoint doesn't return the cards, so we need to fetch them
    const cards = await this.api_service.post<
      paths["/cards/get_cards"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/cards/get_cards", {
      deck_id: params.deck_id,
    })

    return cards.map((card) => ({
      id: card.id,
      deck_id: card.deck_id,
      front: card.front,
      back: card.back,
    }))
  }

  async create_card(params: {
    deck_id: string
    front: string
    back: string
  }): ReturnType<DecksRepository["create_card"]> {
    const card = await this.api_service.post<
      paths["/cards/create_card"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/cards/create_card", params)

    return {
      id: card.id,
      deck_id: card.deck_id,
      front: card.front,
      back: card.back,
    }
  }

  async update_card(params: {
    card_id: string
    front?: string
    back?: string
  }): ReturnType<DecksRepository["update_card"]> {
    const card = await this.api_service.post<
      paths["/cards/update_card"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/cards/update_card", params)

    return {
      id: card.id,
      deck_id: card.deck_id,
      front: card.front,
      back: card.back,
    }
  }

  async delete_card(params: {
    card_id: string
  }): ReturnType<DecksRepository["delete_card"]> {
    await this.api_service.post<{ id: string }>("/cards/delete_card", params)
  }
}
