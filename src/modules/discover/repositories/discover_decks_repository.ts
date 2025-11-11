import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export interface DiscoverDecksRepository {
  fetch_discover_decks(params: {
    spoken_language: string
    learning_language: string
    title?: string
  }): Promise<DiscoverDeckEntity[]>
}
