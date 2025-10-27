import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export interface DiscoverDecksRepository {
  fetch_discover_decks(): Promise<DiscoverDeckEntity[]>
  start_using_deck(params: { deck_id: string }): Promise<DeckEntity>
}
