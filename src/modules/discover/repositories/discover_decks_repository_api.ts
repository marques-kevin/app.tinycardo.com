import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import type { DiscoverDecksRepository } from "@/modules/discover/repositories/discover_decks_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class DiscoverDecksRepositoryApi implements DiscoverDecksRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async fetch_discover_decks(params: {
    spoken_language: string
    learning_language: string
    title?: string
  }): Promise<DiscoverDeckEntity[]> {
    const body: paths["/decks/search_decks"]["post"]["requestBody"]["content"]["application/json"] =
      {
        front_language: params.spoken_language,
        back_language: params.learning_language,
        title: params.title,
      }
    const { decks } = await this.api_service.post<
      paths["/decks/search_decks"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/search_decks", {
      body,
    })

    return decks.map((deck) => ({
      ...deck,
      number_of_users_using_this_deck: deck.number_of_users_who_use_the_deck,
      number_of_cards_in_the_deck: deck.number_of_cards,
      created_at: new Date(deck.created_at),
      updated_at: new Date(deck.updated_at),
    }))
  }
}
