import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import { DiscoverDecksRepositoryInMemory } from "@/modules/discover/repositories/discover_decks_repository_in_memory"
import { beforeEach, describe, expect, it } from "vitest"

describe("DiscoverDecksRepositoryInMemory", () => {
  let repository: DiscoverDecksRepositoryInMemory

  const baseDeck: DiscoverDeckEntity = {
    id: "deck-1",
    name: "Deck 1",
    number_of_users_using_this_deck: 100,
    number_of_cards_in_the_deck: 50,
    front_language: "en",
    back_language: "es",
    created_at: new Date("2024-01-01T00:00:00.000Z"),
    updated_at: new Date("2024-01-02T00:00:00.000Z"),
  }

  beforeEach(() => {
    repository = new DiscoverDecksRepositoryInMemory()
  })

  describe("fetch_discover_decks", () => {
    it("returns an empty array when no decks are stored", async () => {
      const result = await repository.fetch_discover_decks({
        spoken_language: "en",
        learning_language: "es",
      })

      expect(result).toEqual([])
    })

    it("returns decks that match the requested languages", async () => {
      const matchingDeck: DiscoverDeckEntity = {
        ...baseDeck,
        id: "deck-2",
        name: "Deck 2",
      }

      const nonMatchingDecks: DiscoverDeckEntity[] = [
        {
          ...baseDeck,
          id: "deck-3",
          name: "Deck 3",
          back_language: "fr",
        },
        {
          ...baseDeck,
          id: "deck-4",
          name: "Deck 4",
          front_language: "pt",
        },
      ]

      await repository._store_discover_decks([
        ...nonMatchingDecks,
        matchingDeck,
      ])

      const result = await repository.fetch_discover_decks({
        spoken_language: "en",
        learning_language: "es",
      })

      expect(result).toEqual([matchingDeck])
    })

    it("returns an empty array when no decks match the requested languages", async () => {
      const decks: DiscoverDeckEntity[] = [
        {
          ...baseDeck,
          id: "deck-5",
          front_language: "en",
          back_language: "fr",
        },
        {
          ...baseDeck,
          id: "deck-6",
          front_language: "pt",
          back_language: "en",
        },
      ]

      await repository._store_discover_decks(decks)

      const result = await repository.fetch_discover_decks({
        spoken_language: "en",
        learning_language: "es",
      })

      expect(result).toEqual([])
    })

    it("filters decks by title when provided", async () => {
      const matchingDeck: DiscoverDeckEntity = {
        ...baseDeck,
        name: "Spanish Basics",
      }

      const nonMatchingDeck: DiscoverDeckEntity = {
        ...baseDeck,
        id: "deck-7",
        name: "Advanced French",
      }

      await repository._store_discover_decks([matchingDeck, nonMatchingDeck])

      const result = await repository.fetch_discover_decks({
        spoken_language: "en",
        learning_language: "es",
        title: "spanish",
      })

      expect(result).toEqual([matchingDeck])
    })

    it("returns empty array when title filter does not match any deck", async () => {
      const decks: DiscoverDeckEntity[] = [
        {
          ...baseDeck,
          name: "Beginner Portuguese",
        },
      ]

      await repository._store_discover_decks(decks)

      const result = await repository.fetch_discover_decks({
        spoken_language: "en",
        learning_language: "es",
        title: "Advanced Spanish",
      })

      expect(result).toEqual([])
    })
  })
})
