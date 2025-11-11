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

  async fetch_discover_decks(params: {
    spoken_language: string
    learning_language: string
    title?: string
  }): Promise<DiscoverDeckEntity[]> {
    const normalized_title = params.title?.toLowerCase().trim()

    return this.decks.filter((deck) => {
      const matches_languages =
        deck.front_language === params.spoken_language &&
        deck.back_language === params.learning_language

      if (!matches_languages) {
        return false
      }

      if (!normalized_title) {
        return true
      }

      return deck.name.toLowerCase().includes(normalized_title)
    })
  }
}
