import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class DecksRepositoryApi implements DecksRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    const data = await this.api_service.post<
      paths["/decks/get_decks"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/get_decks", {})

    return data.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: "",
      front_language: deck.front_language,
      back_language: deck.back_language,
      user_id: deck.user_id,
      created_at: new Date(deck.created_at),
      updated_at: new Date(deck.updated_at),
      number_of_cards: 0,
      visibility: "public",
    }))
  }

  async get_deck_by_id(
    params: Parameters<DecksRepository["get_deck_by_id"]>[0],
  ): ReturnType<DecksRepository["get_deck_by_id"]> {
    const data = await this.api_service.post<
      paths["/decks/get_deck_by_id"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/get_deck_by_id", {
      id: params.deck_id,
    })

    return {
      ...data,
      number_of_cards: 0,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      visibility: data.visibility as "public" | "private" | "unlisted",
    }
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

  async create_deck(
    params: Parameters<DecksRepository["create_deck"]>[0],
  ): ReturnType<DecksRepository["create_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/create_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/create_deck", params)

    return {
      ...deck_response,
      number_of_cards: 0,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
    }
  }

  async update_deck(
    params: Parameters<DecksRepository["update_deck"]>[0],
  ): ReturnType<DecksRepository["update_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/update_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/update_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      description: deck_response.description,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }

  async delete_deck(
    params: Parameters<DecksRepository["delete_deck"]>[0],
  ): ReturnType<DecksRepository["delete_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/delete_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/delete_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      description: "",
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
  }

  async duplicate_deck(
    params: Parameters<DecksRepository["duplicate_deck"]>[0],
  ): ReturnType<DecksRepository["duplicate_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/duplicate_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/duplicate_deck", {
      deck_id: params.deck_id,
      user_id: params.user_id,
    })

    return {
      id: deck_response.id,
      name: deck_response.name,
      description: "",
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
    }
  }
}
