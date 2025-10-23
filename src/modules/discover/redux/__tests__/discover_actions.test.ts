import { describe, it, expect } from "vitest"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import * as actions from "@/modules/discover/redux/discover_actions"
import type { DiscoverDecksRepositoryInMemory } from "@/modules/discover/repositories/discover_decks_repository_in_memory"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import { delay } from "@/modules/global/utils/delay"

describe("discover actions", () => {
  const decks: DiscoverDeckEntity[] = [
    {
      id: "1",
      name: "Deck 1",
      number_of_users_using_this_deck: 10,
      number_of_cards_in_the_deck: 5,
      front_language: "en",
      back_language: "es",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  it("should fetch discover decks and update state", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks(decks)

    await store.dispatch(actions.fetch_discover_decks())

    expect(store.getState().discover.decks).toEqual(decks)
    expect(store.getState().discover.is_loading).toBe(false)
  })

  it("should fetch on global_route_changed when on /discover", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    discover_decks_repository._store_discover_decks(decks)

    dependencies.location_service.navigate("/discover")

    await store.dispatch(actions.global_route_changed())

    expect(store.getState().discover.decks).toEqual(decks)
  })

  it("should open action dialog with the correct deck", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks(decks)

    await store.dispatch(actions.fetch_discover_decks())
    await store.dispatch(actions.open_action_dialog({ deck_id: "1" }))

    const state = store.getState().discover

    expect(state.actions.is_open).toBe(true)
    expect(state.actions.deck).toEqual(decks[0])
  })

  it("should throw error when trying to open action dialog for a non-existent deck", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks(decks)
    await store.dispatch(actions.fetch_discover_decks())

    await store.dispatch(actions.open_action_dialog({ deck_id: "999" }))

    await delay()

    const state = store.getState().dialog

    expect(state.crash.is_open).toEqual(true)
    expect(state.crash.message).toEqual("Deck not found")
  })

  it("should navigate to deck details when on_view_deck is called", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const deckId = "test-deck-id"

    await store.dispatch(actions.on_view_deck({ deck_id: deckId }))

    // Verify that the navigation occurred by checking the current URL
    expect(dependencies.location_service.get_current_url()).toBe(
      `https://local.dev/decks/${deckId}/details`,
    )
  })

  it("should start using a deck and navigate to learn new words session", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks(decks)

    const deck_id = decks[0].id

    await store.dispatch(actions.on_use_deck({ deck_id }))

    expect(dependencies.location_service.get_current_url()).toEqual(
      `https://local.dev/sessions/${deck_id}/learn_new_words`,
    )
  })

  it("should throw error when trying to use a non-existent deck", async () => {
    const { store } = await create_store_for_tests()

    await store.dispatch(actions.on_use_deck({ deck_id: "non-existent-deck" }))

    await delay()

    const state = store.getState().dialog

    expect(state.crash.is_open).toEqual(true)
    expect(state.crash.message).toEqual("Deck not found")
  })
})
