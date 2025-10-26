import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import type { DiscoverDecksRepository } from "@/modules/discover/repositories/discover_decks_repository"

export class DiscoverDecksRepositoryApi implements DiscoverDecksRepository {
  async fetch_discover_decks(): Promise<DiscoverDeckEntity[]> {
    return []
  }

  async start_using_deck(params: { deck_id: string }): Promise<DeckEntity> {
    throw new Error("Method not implemented.")
  }
}
