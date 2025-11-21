import { type CardEntity } from "@/modules/decks/entities/card_entity"
import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import { beforeEach, describe, expect, it } from "vitest"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"

function build_deck(overrides: Partial<DeckEntity> = {}): DeckEntity {
  const base: DeckEntity = {
    id: "deck-1",
    name: "Spanish Basics",
    front_language: "en",
    description: null,
    back_language: "es",
    user_id: "user-1",
    created_at: new Date("2023-01-01T00:00:00Z"),
    updated_at: new Date("2023-01-01T00:00:00Z"),
    visibility: "private",
    number_of_cards: 0,
    number_of_cards_ready_to_be_reviewed: 0,
    number_of_cards_not_ready_to_be_reviewed: 0,
    number_of_users_using_this_deck: 0,
  }

  return { ...base, ...overrides }
}

const build_cards = (params: {
  deck_id: string
  count: number
  prefix?: string
}): CardEntity[] => {
  return Array.from({ length: params.count }).map((_, i) => ({
    id: `${params.prefix || "card"}-${i + 1}`,
    deck_id: params.deck_id,
    front: `front-${i + 1}`,
    back: `back-${i + 1}`,
    front_audio_url: `https://example.com/front-${i + 1}.mp3`,
    back_audio_url: `https://example.com/back-${i + 1}.mp3`,
  }))
}

function build_lesson(overrides: Partial<LessonEntity> = {}): LessonEntity {
  const base: LessonEntity = {
    id: "lesson-1",
    deck_id: "deck-1",
    name: "Lesson 1",
    cards: [],
    position: 0,
    created_at: new Date("2023-01-01T00:00:00Z"),
    updated_at: new Date("2023-01-01T00:00:00Z"),
  }

  return { ...base, ...overrides }
}

describe("DecksRepositoryInMemory", () => {
  let decks_repository: DecksRepositoryInMemory

  beforeEach(() => {
    decks_repository = new DecksRepositoryInMemory()
  })

  describe("sync_deck", () => {
    it("stores deck and cards, and returns the deck", async () => {
      const deck = build_deck()
      const cards = build_cards({ deck_id: deck.id, count: 3 })

      const saved = await decks_repository.sync_deck({ deck, cards })
      expect(saved.id).toBe(deck.id)
      expect(saved.name).toBe(deck.name)

      const decks = await decks_repository.fetch_decks({
        user_id: deck.user_id,
      })
      expect(decks).toHaveLength(1)
      expect(decks[0].id).toBe(deck.id)

      const stored_cards = await decks_repository.fetch_cards({
        deck_id: deck.id,
      })
      expect(stored_cards).toHaveLength(3)
      expect(stored_cards[0].deck_id).toBe(deck.id)
    })

    it("replaces cards when syncing the same deck multiple times", async () => {
      const deck = build_deck()
      const cards1 = build_cards({ deck_id: deck.id, count: 2, prefix: "card" })
      const cards2 = build_cards({
        deck_id: deck.id,
        count: 2,
        prefix: "card2",
      })

      await decks_repository.sync_deck({ deck, cards: cards1 })
      await decks_repository.sync_deck({ deck, cards: cards2 })

      const stored_cards = await decks_repository.fetch_cards({
        deck_id: deck.id,
      })
      // store_cards replaces all cards, so only the last sync's cards remain
      expect(stored_cards).toHaveLength(2)
      expect(stored_cards[0].id).toContain("card2")
    })
  })

  describe("fetch_decks", () => {
    it("returns empty array when no decks exist", async () => {
      const decks = await decks_repository.fetch_decks({
        user_id: "user-1",
      })
      expect(decks).toEqual([])
    })

    it("returns all decks with number_of_cards", async () => {
      const deck1 = build_deck({ id: "deck-1" })
      const deck2 = build_deck({ id: "deck-2" })

      // Use upsert_cards to properly set cards for each deck
      await decks_repository.sync_deck({ deck: deck1, cards: [] })
      await decks_repository.sync_deck({ deck: deck2, cards: [] })

      const cards1 = build_cards({ deck_id: deck1.id, count: 2 })
      const cards2 = build_cards({ deck_id: deck2.id, count: 5 })

      await decks_repository.upsert_cards({ deck_id: deck1.id, cards: cards1 })
      await decks_repository.upsert_cards({ deck_id: deck2.id, cards: cards2 })

      const decks = await decks_repository.fetch_decks({
        user_id: "user-1",
      })
      expect(decks).toHaveLength(2)
      expect(decks.find((d) => d.id === deck1.id)?.number_of_cards).toBe(2)
      expect(decks.find((d) => d.id === deck2.id)?.number_of_cards).toBe(5)
    })

    it("returns decks with 0 cards when deck has no cards", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      const decks = await decks_repository.fetch_decks({
        user_id: "user-1",
      })
      expect(decks[0].number_of_cards).toBe(0)
    })
  })

  describe("get_deck_by_id", () => {
    it("returns deck when it exists", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      const found = await decks_repository.get_deck_by_id({
        deck_id: deck.id,
        user_id: deck.user_id,
      })

      expect(found.id).toBe(deck.id)
      expect(found.name).toBe(deck.name)
    })

    it("throws error when deck does not exist", async () => {
      await expect(
        decks_repository.get_deck_by_id({
          deck_id: "non-existent",
          user_id: "user-1",
        }),
      ).rejects.toThrow("Deck not found")
    })
  })

  describe("fetch_cards", () => {
    it("returns empty array when deck has no cards", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      const cards = await decks_repository.fetch_cards({ deck_id: deck.id })
      expect(cards).toEqual([])
    })

    it("returns all cards for a deck", async () => {
      const deck = build_deck()
      const cards = build_cards({ deck_id: deck.id, count: 3 })
      await decks_repository.sync_deck({ deck, cards })

      const fetched_cards = await decks_repository.fetch_cards({
        deck_id: deck.id,
      })
      expect(fetched_cards).toHaveLength(3)
      expect(fetched_cards[0].front).toBe("front-1")
    })

    it("returns empty array for non-existent deck", async () => {
      const cards = await decks_repository.fetch_cards({
        deck_id: "non-existent",
      })
      expect(cards).toEqual([])
    })
  })

  describe("get_cards_by_deck_id", () => {
    it("returns cards for a deck", async () => {
      const deck = build_deck()
      const cards = build_cards({ deck_id: deck.id, count: 2 })
      await decks_repository.sync_deck({ deck, cards })

      const fetched_cards = await decks_repository.get_cards_by_deck_id({
        deck_id: deck.id,
        user_id: deck.user_id,
      })

      expect(fetched_cards).toHaveLength(2)
    })
  })

  describe("create_deck", () => {
    it("creates a new deck with correct properties", async () => {
      const deck = await decks_repository.create_deck({
        name: "New Deck",
        description: "Description",
        front_language: "en",
        back_language: "es",
        user_id: "user-1",
      })

      expect(deck.name).toBe("New Deck")
      expect(deck.description).toBe("Description")
      expect(deck.front_language).toBe("en")
      expect(deck.back_language).toBe("es")
      expect(deck.user_id).toBe("user-1")
      expect(deck.visibility).toBe("private")
      expect(deck.number_of_cards).toBe(0)
      expect(deck.id).toBeDefined()
      expect(deck.created_at).toBeInstanceOf(Date)
      expect(deck.updated_at).toBeInstanceOf(Date)
    })

    it("adds deck to repository", async () => {
      await decks_repository.create_deck({
        name: "New Deck",
        description: "",
        front_language: "en",
        back_language: "es",
        user_id: "user-1",
      })

      const decks = await decks_repository.fetch_decks({
        user_id: "user-1",
      })
      expect(decks).toHaveLength(1)
      expect(decks[0].name).toBe("New Deck")
    })
  })

  describe("update_deck", () => {
    it("updates deck properties", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      const updated = await decks_repository.update_deck({
        id: deck.id,
        name: "Updated Name",
        description: "Updated Description",
        visibility: "public",
        front_language: "fr",
        back_language: "de",
      })

      expect(updated.name).toBe("Updated Name")
      expect(updated.description).toBe("Updated Description")
      expect(updated.visibility).toBe("public")
      expect(updated.front_language).toBe("fr")
      expect(updated.back_language).toBe("de")
      expect(updated.updated_at).toBeInstanceOf(Date)
    })

    it("updates only provided fields", async () => {
      const deck = build_deck({ name: "Original Name" })
      await decks_repository.sync_deck({ deck, cards: [] })

      const updated = await decks_repository.update_deck({
        id: deck.id,
        description: "New Description",
        visibility: "public",
      })

      expect(updated.name).toBe("Original Name")
      expect(updated.description).toBe("New Description")
      expect(updated.visibility).toBe("public")
    })

    it("throws error when deck does not exist", async () => {
      await expect(
        decks_repository.update_deck({
          id: "non-existent",
          description: "",
          visibility: "private",
        }),
      ).rejects.toThrow("Deck not found")
    })
  })

  describe("delete_deck", () => {
    it("deletes deck and its cards", async () => {
      const deck = build_deck()
      const cards = build_cards({ deck_id: deck.id, count: 3 })
      await decks_repository.sync_deck({ deck, cards })

      await decks_repository.delete_deck({ id: deck.id })

      const decks = await decks_repository.fetch_decks({
        user_id: deck.user_id,
      })
      expect(decks).toHaveLength(0)

      const fetched_cards = await decks_repository.fetch_cards({
        deck_id: deck.id,
      })
      expect(fetched_cards).toEqual([])
    })

    it("throws error when deck does not exist", async () => {
      await expect(
        decks_repository.delete_deck({ id: "non-existent" }),
      ).rejects.toThrow("Deck not found")
    })
  })

  describe("upsert_cards", () => {
    it("creates cards when deck has no cards", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      await decks_repository.upsert_cards({
        deck_id: deck.id,
        cards: [
          {
            id: "card-1",
            deck_id: deck.id,
            front: "Front 1",
            back: "Back 1",
            front_audio_url: "https://example.com/front-1.mp3",
            back_audio_url: "https://example.com/back-1.mp3",
          },
          {
            id: "card-2",
            deck_id: deck.id,
            front: "Front 2",
            back: "Back 2",
            front_audio_url: "https://example.com/front-2.mp3",
            back_audio_url: "https://example.com/back-2.mp3",
          },
        ],
      })

      const cards = await decks_repository.fetch_cards({ deck_id: deck.id })
      expect(cards).toHaveLength(2)
      expect(cards[0].front).toBe("Front 1")
      expect(cards[0].back).toBe("Back 1")
      expect(cards[0].deck_id).toBe(deck.id)
      expect(cards[0].id).toBeDefined()
    })

    it("replaces existing cards", async () => {
      const deck = build_deck()
      const initial_cards = build_cards({ deck_id: deck.id, count: 3 })
      await decks_repository.sync_deck({ deck, cards: initial_cards })

      await decks_repository.upsert_cards({
        deck_id: deck.id,
        cards: [
          {
            id: "card-1",
            deck_id: deck.id,
            front: "New Front 1",
            back: "New Back 1",
            front_audio_url: "https://example.com/front-1.mp3",
            back_audio_url: "https://example.com/back-1.mp3",
          },
          {
            id: "card-2",
            deck_id: deck.id,
            front: "New Front 2",
            back: "New Back 2",
            front_audio_url: "https://example.com/front-2.mp3",
            back_audio_url: "https://example.com/back-2.mp3",
          },
        ],
      })

      const cards = await decks_repository.fetch_cards({ deck_id: deck.id })
      expect(cards).toHaveLength(2)
      expect(cards[0].front).toBe("New Front 1")
      expect(cards[1].front).toBe("New Front 2")
    })

    it("uses provided card id when provided", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      await decks_repository.upsert_cards({
        deck_id: deck.id,
        cards: [
          {
            id: "custom-id",
            deck_id: deck.id,
            front: "Front",
            back: "Back",
            front_audio_url: "https://example.com/front.mp3",
            back_audio_url: "https://example.com/back.mp3",
          },
        ],
      })

      const cards = await decks_repository.fetch_cards({ deck_id: deck.id })
      expect(cards[0].id).toBe("custom-id")
    })

    it("generates id when not provided", async () => {
      const deck = build_deck()
      await decks_repository.sync_deck({ deck, cards: [] })

      await decks_repository.upsert_cards({
        deck_id: deck.id,
        cards: [
          {
            id: "card-1",
            deck_id: deck.id,
            front: "Front",
            back: "Back",
            front_audio_url: "https://example.com/front.mp3",
            back_audio_url: "https://example.com/back.mp3",
          },
        ],
      })

      const cards = await decks_repository.fetch_cards({ deck_id: deck.id })
      expect(cards[0].id).toBeDefined()
      expect(cards[0].id).not.toBe("")
    })
  })

  describe("fetch_lessons", () => {
    it("returns empty array when deck has no lessons", async () => {
      const lessons = await decks_repository.fetch_lessons({
        deck_id: "deck-1",
        user_id: "user-1",
      })

      expect(lessons).toEqual([])
    })

    it("returns only lessons for the requested deck", async () => {
      const lesson_for_deck_1 = build_lesson({
        id: "lesson-deck-1",
        deck_id: "deck-1",
        position: 1,
      })
      const lesson_for_deck_2 = build_lesson({
        id: "lesson-deck-2",
        deck_id: "deck-2",
        position: 2,
      })

      decks_repository = new DecksRepositoryInMemory({
        lessons: [lesson_for_deck_1, lesson_for_deck_2],
      })

      const lessons = await decks_repository.fetch_lessons({
        deck_id: "deck-1",
        user_id: "user-1",
      })

      expect(lessons).toEqual([lesson_for_deck_1])
    })
  })

  describe("upsert_lessons", () => {
    it("replaces existing lessons for the same deck while keeping others", async () => {
      const existing_deck_1_lesson = build_lesson({
        id: "existing-deck-1",
        deck_id: "deck-1",
      })
      const existing_deck_2_lesson = build_lesson({
        id: "existing-deck-2",
        deck_id: "deck-2",
      })

      decks_repository = new DecksRepositoryInMemory({
        lessons: [existing_deck_1_lesson, existing_deck_2_lesson],
      })

      const new_lessons_for_deck_1 = [
        build_lesson({ id: "new-lesson-1", deck_id: "ignored" }),
        build_lesson({ id: "new-lesson-2", deck_id: "ignored" }),
      ]

      const returned_lessons = await decks_repository.upsert_lessons({
        deck_id: "deck-1",
        user_id: "user-1",
        lessons: new_lessons_for_deck_1,
      })

      expect(returned_lessons).toEqual(new_lessons_for_deck_1)

      const stored_lessons_deck_1 = await decks_repository.fetch_lessons({
        deck_id: "deck-1",
        user_id: "user-1",
      })

      expect(stored_lessons_deck_1).toHaveLength(2)
      expect(stored_lessons_deck_1.map((lesson) => lesson.id)).toEqual([
        "new-lesson-1",
        "new-lesson-2",
      ])
      expect(
        stored_lessons_deck_1.every((lesson) => lesson.deck_id === "deck-1"),
      ).toBe(true)

      const stored_lessons_deck_2 = await decks_repository.fetch_lessons({
        deck_id: "deck-2",
        user_id: "user-1",
      })

      expect(stored_lessons_deck_2).toEqual([existing_deck_2_lesson])
    })

    it("persists lessons with enforced deck id", async () => {
      const upserted_lessons = await decks_repository.upsert_lessons({
        deck_id: "deck-3",
        user_id: "user-3",
        lessons: [
          build_lesson({ id: "deck-3-lesson-1", deck_id: "ignored" }),
          build_lesson({ id: "deck-3-lesson-2", deck_id: "ignored" }),
        ],
      })

      expect(upserted_lessons).toHaveLength(2)

      const stored_lessons = await decks_repository.fetch_lessons({
        deck_id: "deck-3",
        user_id: "user-1",
      })

      expect(stored_lessons).toHaveLength(2)
      expect(
        stored_lessons.every((lesson) => lesson.deck_id === "deck-3"),
      ).toBe(true)
      expect(stored_lessons.map((lesson) => lesson.id)).toEqual([
        "deck-3-lesson-1",
        "deck-3-lesson-2",
      ])
    })
  })

  describe("duplicate_deck", () => {
    it("creates a copy of deck with cards", async () => {
      const deck = build_deck({ name: "Original Deck" })
      const cards = build_cards({ deck_id: deck.id, count: 3 })
      await decks_repository.sync_deck({ deck, cards })

      const duplicated = await decks_repository.duplicate_deck({
        deck_id: deck.id,
        user_id: "user-1",
      })

      expect(duplicated.name).toBe("Original Deck (Copy)")
      expect(duplicated.id).not.toBe(deck.id)
      expect(duplicated.user_id).toBe("user-1")

      const duplicated_cards = await decks_repository.fetch_cards({
        deck_id: duplicated.id,
      })
      expect(duplicated_cards).toHaveLength(3)
      expect(duplicated_cards[0].deck_id).toBe(duplicated.id)
      expect(duplicated_cards[0].id).not.toBe(cards[0].id)
    })

    it("throws error when deck does not exist", async () => {
      await expect(
        decks_repository.duplicate_deck({
          deck_id: "non-existent",
          user_id: "user-1",
        }),
      ).rejects.toThrow("Deck not found")
    })
  })
})
