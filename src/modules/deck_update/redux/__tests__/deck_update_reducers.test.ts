import { describe, it, expect } from "vitest"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import * as global_actions from "@/modules/global/redux/global_actions"
import type { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { delay } from "@/modules/global/utils/delay"
import type { UserEntity } from "@/modules/authentication/entities/user_entity"
import type { ToastServiceInMemory } from "@/modules/global/services/toast_service/toast_service_in_memory"
import { last } from "lodash"

const prepare_store_for_tests = async () => {
  const { store, dependencies } = await create_store_for_tests()

  const users_repository =
    dependencies.users_repository as UsersRepositoryInMemory
  const decks_repository =
    dependencies.decks_repository as DecksRepositoryInMemory
  const toast_service = dependencies.toast_service as ToastServiceInMemory

  const user: UserEntity = {
    id: "user-1",
    email: "test@example.com",
  }
  await users_repository.set_authenticated_user(user)

  const deck: DeckEntity = {
    id: "deck-1",
    name: "Test Deck",
    description: "Test Description",
    front_language: "en",
    back_language: "fr",
    user_id: user.id,
    updated_at: new Date(),
    created_at: new Date(),
    visibility: "private",
    number_of_cards: 10,
    number_of_cards_ready_to_be_reviewed: 0,
    number_of_cards_not_ready_to_be_reviewed: 0,
    number_of_users_using_this_deck: 0,
  }

  const cards: CardEntity[] = Array.from(
    { length: deck.number_of_cards },
    (_, index) => ({
      id: `card-${index}`,
      deck_id: deck.id,
      front: `Front ${index}`,
      back: `Back ${index}`,
    }),
  )

  await decks_repository.sync_deck({ deck, cards })
  await dependencies.location_service.navigate(`/decks/${deck.id}/update`)
  await store.dispatch(global_actions.global_app_initialized())
  await store.dispatch(global_actions.global_route_changed())

  await delay()

  return {
    store,
    deck,
    cards,
    user,
    toast_service,
    dependencies,
  }
}

describe("Feature: Deck Update", () => {
  describe("Given an authenticated user", () => {
    it(`
      When the user navigates to the deck update page
      Then the deck should be loaded into the reducer
      `, async () => {
      const { store, deck } = await prepare_store_for_tests()

      const state = store.getState()

      expect(state.deck_update.deck).toEqual(deck)
    })

    it(`
      When the user updates the title, description, visibility, front language, back language
      And he saves the deck
      Then the deck should be updated
      And a notification should be shown
      `, async () => {
      const { store, dependencies, toast_service } =
        await prepare_store_for_tests()

      await store.dispatch(
        deck_update_actions.update_field({
          back_language: "back",
          front_language: "front",
          description: "Updated Description",
          visibility: "unlisted",
          name: "Updated Name",
        }),
      )

      await store.dispatch(deck_update_actions.update_deck())

      const decks = await dependencies.decks_repository.fetch_decks()

      expect(decks).toHaveLength(1)

      expect(decks[0].name).toEqual("Updated Name")
      expect(decks[0].description).toEqual("Updated Description")
      expect(decks[0].visibility).toEqual("unlisted")
      expect(decks[0].front_language).toEqual("front")
      expect(decks[0].back_language).toEqual("back")

      const find_success_toast = toast_service.history.find(
        (toast) =>
          toast.type === "success" &&
          toast.title === "deck_update_actions/toast/deck_updated",
      )

      expect(find_success_toast).toBeDefined()
    })

    it(`
      When the user select cards,
      Then should be able to select and unselect cards
      `, async () => {
      const { store, cards } = await prepare_store_for_tests()

      const card = cards[0]

      store.dispatch(
        deck_update_actions.toggle_select_card({
          card_id: card.id,
        }),
      )

      expect(store.getState().deck_update.selected_cards).toEqual([card.id])

      store.dispatch(
        deck_update_actions.toggle_select_card({
          card_id: card.id,
        }),
      )

      expect(store.getState().deck_update.selected_cards).toEqual([])

      store.dispatch(deck_update_actions.toggle_select_all_cards())

      expect(store.getState().deck_update.selected_cards).toEqual(
        store.getState().deck_update.cards,
      )

      store.dispatch(deck_update_actions.toggle_select_all_cards())

      expect(store.getState().deck_update.selected_cards).toEqual([])

      store.dispatch(
        deck_update_actions.toggle_select_card({
          card_id: card.id,
        }),
      )

      expect(store.getState().deck_update.selected_cards).toEqual([card.id])

      store.dispatch(deck_update_actions.toggle_select_all_cards())

      expect(store.getState().deck_update.selected_cards).toEqual(
        store.getState().deck_update.cards,
      )
    })

    it(`
      When the user select cards,
      Then, click on delete selected cards
      And save the deck
      Then the deck should be updated
      And cards removed
      `, async () => {
      const { store, deck, cards, dependencies, toast_service } =
        await prepare_store_for_tests()

      const card = cards[0]

      store.dispatch(
        deck_update_actions.toggle_select_card({
          card_id: card.id,
        }),
      )

      expect(store.getState().deck_update.selected_cards).toEqual([card.id])

      await store.dispatch(deck_update_actions.delete_selected_cards())

      expect(store.getState().deck_update.selected_cards).toEqual([])
      expect(store.getState().deck_update.cards).not.toContain(card.id)

      await store.dispatch(deck_update_actions.update_deck())

      const decks_in_database =
        await dependencies.decks_repository.fetch_decks()

      expect(decks_in_database).toHaveLength(1)
      expect(decks_in_database[0].number_of_cards).toEqual(
        deck.number_of_cards - 1,
      )

      const find_success_toast = toast_service.history.find(
        (toast) =>
          toast.type === "success" &&
          toast.title === "deck_update_actions/toast/cards_deleted",
      )

      expect(find_success_toast).toBeDefined()
    })

    it(`
      An user should be able to add cards
      `, async () => {
      const { store } = await prepare_store_for_tests()

      const state = store.getState()

      /**
       *
       * There should always be an empty card at the end of the list
       * Because we want the users to be able to add cards easily
       *
       */
      const last_card_id = last(state.deck_update.cards)!
      let last_card = state.deck_update.cards_map[last_card_id]!

      expect(last_card.front).toEqual("")
      expect(last_card.back).toEqual("")

      store.dispatch(
        deck_update_actions._draft_update_card({
          id: last_card_id,
          field: "front",
          value: "Updated Front",
        }),
      )

      store.dispatch(
        deck_update_actions._draft_update_card({
          id: last_card_id,
          field: "back",
          value: "Updated Back",
        }),
      )

      last_card = store.getState().deck_update.cards_map[last_card_id]!

      expect(last_card.front).toEqual("Updated Front")
      expect(last_card.back).toEqual("Updated Back")

      /**
       *
       * Because we updated the last card, a new empty card should be added
       *
       */

      const new_last_card_id = last(store.getState().deck_update.cards)!
      const new_last_card =
        store.getState().deck_update.cards_map[new_last_card_id]!
      expect(new_last_card.front).toEqual("")
      expect(new_last_card.back).toEqual("")
    })

    it(`
      When removing the last card, a new empty card should be added
      `, async () => {
      const { store } = await prepare_store_for_tests()

      const state = store.getState()

      const last_card_id = last(state.deck_update.cards)!
      const last_card = state.deck_update.cards_map[last_card_id]!

      expect(last_card.front).toEqual("")
      expect(last_card.back).toEqual("")

      store.dispatch(
        deck_update_actions.toggle_select_card({ card_id: last_card_id }),
      )

      await store.dispatch(deck_update_actions.delete_selected_cards())

      const new_last_card_id = last(store.getState().deck_update.cards)!
      const new_last_card =
        store.getState().deck_update.cards_map[new_last_card_id]!

      expect(new_last_card_id).not.toBe(last_card_id)
      expect(new_last_card.front).toEqual("")
      expect(new_last_card.back).toEqual("")
    })
  })
})
