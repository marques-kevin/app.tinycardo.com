import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
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

  async start_using_deck(params: { deck_id: string }): Promise<DeckEntity> {
    const deck = this.decks.find((d) => d.id === params.deck_id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    return {
      id: deck.id,
      name: deck.name,
      front_language: deck.front_language,
      back_language: deck.back_language,
      user_id: "1",
      visibility: "private",
      number_of_cards: deck.number_of_cards_in_the_deck,
      created_at: deck.created_at,
      updated_at: deck.updated_at,
    }
  }
}
