import { type CardEntity } from "@/modules/decks/entities/card_entity"
import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import { beforeEach, describe, expect, it } from "vitest"

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
  }

  return { ...base, ...overrides }
}

const build_cards = (params: {
  deck_id: string
  count: number
  prefix?: string
}): CardEntity[] => {
  return Array.from({ length: params.count }).map((_, i) => ({
    id: `${params.prefix}-${i + 1}`,
    deck_id: params.deck_id,
    front: `front-${i + 1}`,
    back: `back-${i + 1}`,
  }))
}
describe("DecksRepositoryInMemory", () => {
  let decks_repository: DecksRepositoryInMemory

  beforeEach(() => {
    decks_repository = new DecksRepositoryInMemory()
  })

  it("sync_deck stores deck and cards, and returns the deck", async () => {
    const deck = build_deck()
    const cards = build_cards({ deck_id: deck.id, count: 3 })

    const saved = await decks_repository.sync_deck({ deck, cards })
    expect(saved.id).toBe(deck.id)
    expect(saved.name).toBe(deck.name)

    const decks = await decks_repository.fetch_decks()
    expect(decks).toHaveLength(1)
    expect(decks[0].id).toBe(deck.id)

    const stored_cards = await decks_repository.fetch_cards({
      deck_id: deck.id,
    })
    expect(stored_cards).toHaveLength(3)
    expect(stored_cards[0].deck_id).toBe(deck.id)
  })
})
