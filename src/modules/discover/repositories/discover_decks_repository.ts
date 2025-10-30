import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export interface DiscoverDecksRepository {
  fetch_discover_decks(): Promise<DiscoverDeckEntity[]>
}
