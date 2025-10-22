import type { CardsRepository } from "@/modules/cards/repositories/cards_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class CardsRepositoryApi implements CardsRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<CardsRepository["upsert_cards"]> {
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
  }): ReturnType<CardsRepository["create_card"]> {
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
  }): ReturnType<CardsRepository["update_card"]> {
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
  }): ReturnType<CardsRepository["delete_card"]> {
    await this.api_service.post<{ id: string }>("/cards/delete_card", params)
  }
}
