import * as global_actions from "@/modules/global/redux/global_actions"
import { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import { describe, it, expect } from "vitest"
import { delay } from "@/modules/global/utils/delay"
import type { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import type { SessionsRepositoryInMemory } from "@/modules/sessions/repositories/sessions_repository_in_memory"

describe("decks_details_actions", () => {
  const deck: DeckEntity = {
    id: "deck-1",
    name: "Test Deck",
    description: "Test Description",
    front_language: "en",
    back_language: "es",
    user_id: "user-1",
    visibility: "private",
    created_at: new Date(),
    updated_at: new Date(),
    number_of_cards: 2,
    number_of_cards_not_ready_to_be_reviewed: 1,
    number_of_cards_ready_to_be_reviewed: 1,
    number_of_users_using_this_deck: 1,
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

    dependencies.location_service.navigate(`/decks/${deck.id}/`)

    const users_repository =
      dependencies.users_repository as UsersRepositoryInMemory

    await users_repository.set_authenticated_user({
      id: deck.user_id,
      email: "test@test.com",
    })

    const decks_repository =
      dependencies.decks_repository as DecksRepositoryInMemory

    await decks_repository.sync_deck({ deck, cards })

    await store.dispatch(global_actions.global_app_initialized())
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

  it("should fetch lessons successfully and if some cards are not in a lesson, an 'other' lesson should be created with them", async () => {
    const { store, dependencies } = await create_store_for_tests()

    dependencies.location_service.navigate(`/decks/${deck.id}/`)

    const decks_repository =
      dependencies.decks_repository as DecksRepositoryInMemory

    await decks_repository.sync_deck({ deck, cards })
    decks_repository.lessons = [
      {
        id: "lesson-1",
        name: "Lesson 1",
        deck_id: deck.id,
        cards: ["card-1"],
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    const sessions_repository =
      dependencies.sessions_repository as SessionsRepositoryInMemory

    await sessions_repository.update_card_status({
      card_id: "card-1",
      deck_id: deck.id,
      repetition_count: 0,
      ease_factor: 2.5,
      next_due_at: new Date("1990-01-01"),
      last_reviewed_at: new Date(),
    })

    const users_repository =
      dependencies.users_repository as UsersRepositoryInMemory

    await users_repository.set_authenticated_user({
      id: deck.user_id,
      email: "test@test.com",
    })

    await store.dispatch(global_actions.global_app_initialized())
    await store.dispatch(global_actions.global_route_changed())

    await delay()

    const state = store.getState().decks_details
    expect(state.deck).toEqual(deck)

    expect(state.lessons).toMatchObject([
      {
        id: "lesson-1",
        name: "Lesson 1",
        deck_id: deck.id,
        cards: ["card-1"],
        position: 1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        number_of_cards: 1,
        number_of_cards_ready_to_be_reviewed: 1,
        number_of_cards_not_ready_to_be_reviewed: 0,
      },
      {
        id: "other",
        name: "other",
        deck_id: deck.id,
        cards: ["card-2"],
        position: 2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        number_of_cards: 1,
        number_of_cards_ready_to_be_reviewed: 0,
        number_of_cards_not_ready_to_be_reviewed: 0,
      },
    ])
  })
})
