import * as global_actions from "@/modules/global/redux/global_actions"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import { describe, it, expect } from "vitest"
import { delay } from "@/modules/global/utils/delay"

describe("decks_details_actions", () => {
  const deck: DeckEntity = {
    id: "deck-1",
    name: "Test Deck",
    front_language: "en",
    back_language: "es",
    user_id: "user-1",
    visibility: "private",
    created_at: new Date(),
    updated_at: new Date(),
    number_of_cards: 2,
  }

  const cards: CardEntity[] = [
    {
      id: "card-1",
      deck_id: "deck-1",
      front: "Hello",
      back: "Hola",
    },
    {
      id: "card-2",
      deck_id: "deck-1",
      front: "Goodbye",
      back: "Adiós",
    },
  ]

  it("should fetch deck details successfully", async () => {
    const { store, dependencies } = await create_store_for_tests()

    dependencies.location_service.navigate("/decks/deck-1/")

    const decks_repository =
      dependencies.decks_repository as DecksRepositoryInMemory

    await decks_repository.sync_deck({ deck, cards })

    await store.dispatch(global_actions.global_route_changed())

    await delay()

    const state = store.getState().decks_details

    expect(state.deck).toEqual(deck)
    expect(state.cards).toEqual(cards)
    expect(state.is_fetching).toBe(false)
  })

  it("should not fetch deck details if the route is not /decks/:deck_id", async () => {
    const { store, dependencies } = await create_store_for_tests()

    dependencies.location_service.navigate("/something-else/deck-1/")

    const decks_repository =
      dependencies.decks_repository as DecksRepositoryInMemory

    await decks_repository.sync_deck({ deck, cards })

    await store.dispatch(global_actions.global_route_changed())

    await delay()

    const state = store.getState().decks_details

    expect(state.deck).toEqual(null)
    expect(state.cards).toEqual([])
  })
})
