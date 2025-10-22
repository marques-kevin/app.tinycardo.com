import { type CardEntity } from "@/modules/decks/entities/card_entity"
import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import { beforeEach, describe, expect, it } from "vitest"

function buildDeck(overrides: Partial<DeckEntity> = {}): DeckEntity {
  const base: DeckEntity = {
    id: "deck-1",
    name: "Spanish Basics",
    front_language: "en",
    back_language: "es",
    user_id: "user-1",
    created_at: new Date("2023-01-01T00:00:00Z"),
    updated_at: new Date("2023-01-01T00:00:00Z"),
    visibility: "private",
    number_of_cards: 0,
  }
  return { ...base, ...overrides }
}

function buildCards(
  deckId: string,
  count: number,
  prefix = "card",
): CardEntity[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i + 1}`,
    deck_id: deckId,
    front: `front-${i + 1}`,
    back: `back-${i + 1}`,
  }))
}

describe("DecksRepositoryInMemory", () => {
  let repo: DecksRepositoryInMemory

  beforeEach(() => {
    repo = new DecksRepositoryInMemory()
  })

  it("sync_deck stores deck and cards, and returns the deck", async () => {
    const deck = buildDeck()
    const cards = buildCards(deck.id, 3)

    const saved = await repo.sync_deck({ deck, cards })
    expect(saved.id).toBe(deck.id)
    expect(saved.name).toBe(deck.name)

    const decks = await repo.fetch_decks()
    expect(decks).toHaveLength(1)
    expect(decks[0].id).toBe(deck.id)

    const storedCards = await repo.fetch_cards({ deck_id: deck.id })
    expect(storedCards).toHaveLength(3)
    expect(storedCards[0].deck_id).toBe(deck.id)
  })

  it("handles multiple decks independently", async () => {
    const deckA = buildDeck({ id: "deck-A", name: "Deck A" })
    const deckB = buildDeck({ id: "deck-B", name: "Deck B" })

    await repo.sync_deck({ deck: deckA, cards: buildCards(deckA.id, 2, "a") })
    await repo.sync_deck({ deck: deckB, cards: buildCards(deckB.id, 4, "b") })

    const decks = await repo.fetch_decks()
    expect(decks.map((d) => d.id).sort()).toEqual(["deck-A", "deck-B"])

    const cardsA = await repo.fetch_cards({ deck_id: "deck-A" })
    const cardsB = await repo.fetch_cards({ deck_id: "deck-B" })
    expect(cardsA).toHaveLength(2)
    expect(cardsB).toHaveLength(4)
    expect(cardsA.every((c) => c.deck_id === "deck-A")).toBe(true)
    expect(cardsB.every((c) => c.deck_id === "deck-B")).toBe(true)
  })
})
