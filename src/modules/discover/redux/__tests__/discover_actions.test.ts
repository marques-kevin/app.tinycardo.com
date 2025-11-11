import { describe, it, expect } from "vitest"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import * as actions from "@/modules/discover/redux/discover_actions"
import type { DiscoverDecksRepositoryInMemory } from "@/modules/discover/repositories/discover_decks_repository_in_memory"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import * as language_actions from "@/modules/language/redux/language_actions"

describe("discover actions", () => {
  const decks: DiscoverDeckEntity[] = [
    {
      id: "1",
      name: "Deck 1",
      number_of_users_using_this_deck: 10,
      number_of_cards_in_the_deck: 5,
      front_language: "en",
      back_language: "fr",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  it("should fetch discover decks and update state", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks(decks)

    await store.dispatch(
      actions.change_language_filter({
        spoken_language: "en",
        learning_language: "fr",
      }),
    )

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

  it("should navigate to deck details when on_view_deck is called", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const deckId = "test-deck-id"

    await store.dispatch(actions.on_view_deck({ deck_id: deckId }))

    expect(dependencies.location_service.get_current_url()).toEqual(
      `https://local.dev/decks/${deckId}/`,
    )
  })

  it("should set the learning language to en when the current language is fr", async () => {
    const { store } = await create_store_for_tests()

    store.dispatch(language_actions.store({ lang: "fr" }))

    await store.dispatch(actions.sync_filters_with_current_language())

    expect(store.getState().discover.filters.learning_language).toEqual("en")
    expect(store.getState().discover.filters.spoken_language).toEqual("fr")
  })

  it("should store the title query filter and fetch decks", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const discover_decks_repository =
      dependencies.discover_decks_repository as DiscoverDecksRepositoryInMemory

    await discover_decks_repository._store_discover_decks([
      {
        ...decks[0],
        name: "My Spanish Deck",
      },
      {
        ...decks[0],
        id: "2",
        name: "Advanced French Deck",
        back_language: "en",
      },
    ])

    await store.dispatch(
      actions.change_title_query_filter({ title_query: "Spanish" }),
    )

    expect(store.getState().discover.filters.title_query).toEqual("Spanish")
    expect(store.getState().discover.decks).toEqual([
      expect.objectContaining({ name: "My Spanish Deck" }),
    ])
  })
})
