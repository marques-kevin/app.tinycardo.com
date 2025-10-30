import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import type { DiscoverDecksRepository } from "@/modules/discover/repositories/discover_decks_repository"

export class DiscoverDecksRepositoryInMemory
  implements DiscoverDecksRepository
{
  private decks: DiscoverDeckEntity[] = []

  constructor(
    params: Partial<{
      decks?: DiscoverDeckEntity[]
    }> = {},
  ) {
    this.decks = params.decks || []
  }

  async _store_discover_decks(decks: DiscoverDeckEntity[]): Promise<void> {
    this.decks = decks
  }

  async fetch_discover_decks(): Promise<DiscoverDeckEntity[]> {
    return this.decks
  }
}
