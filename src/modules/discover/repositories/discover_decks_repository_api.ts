import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import type { DiscoverDecksRepository } from "@/modules/discover/repositories/discover_decks_repository"

export class DiscoverDecksRepositoryApi implements DiscoverDecksRepository {
  async fetch_discover_decks(): Promise<DiscoverDeckEntity[]> {
    // Placeholder: replace with real API call when backend is ready
    return []
  }
}
