import { describe, it, expect } from "vitest"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import * as global_actions from "@/modules/global/redux/global_actions"
import type { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import { select_filtered_cards } from "@/modules/deck_update/redux/deck_update_reducers"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import { delay } from "@/modules/global/utils/delay"

describe("deck_update reducers", () => {
  describe("select_filtered_cards", () => {
    it("should return all cards when no lesson is active", () => {
      const state = {
        deck_id: null,
        csv_import_dialog: {
          open: false,
          headers: [],
          rows: [],
          selected_front: 0,
          selected_back: 1,
        },
        is_updating: false,
        selected_cards: [],
        cards: ["card-1", "card-2", "card-3"],
        cards_map: {},
        title: "",
        description: "",
        visibility: "public" as const,
        front_language: "en",
        back_language: "fr",
        is_loading: false,
        rename_lesson_modal: null,
        lessons: [],
        active_lesson_id: null,
      }

      const result = select_filtered_cards(state)

      expect(result).toEqual(["card-1", "card-2", "card-3"])
    })

    it("should return only cards from active lesson", () => {
      const lesson: LessonEntity = {
        id: "lesson-1",
        name: "Lesson 1",
        deck_id: "deck-1",
        cards: ["card-1", "card-3"],
        position: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const state = {
        deck_id: null,
        csv_import_dialog: {
          open: false,
          headers: [],
          rows: [],
          selected_front: 0,
          selected_back: 1,
        },
        is_updating: false,
        selected_cards: [],
        cards: ["card-1", "card-2", "card-3", "card-4"],
        cards_map: {},
        title: "",
        description: "",
        visibility: "public" as const,
        front_language: "en",
        back_language: "fr",
        is_loading: false,
        rename_lesson_modal: null,
        lessons: [lesson],
        active_lesson_id: "lesson-1",
      }

      const result = select_filtered_cards(state)

      expect(result).toEqual(["card-1", "card-3"])
    })

    it("should return all cards when active lesson is not found", () => {
      const state = {
        deck_id: null,
        csv_import_dialog: {
          open: false,
          headers: [],
          rows: [],
          selected_front: 0,
          selected_back: 1,
        },
        is_updating: false,
        selected_cards: [],
        cards: ["card-1", "card-2", "card-3"],
        cards_map: {},
        title: "",
        description: "",
        visibility: "public" as const,
        front_language: "en",
        back_language: "fr",
        is_loading: false,
        rename_lesson_modal: null,
        lessons: [],
        active_lesson_id: "non-existent-lesson",
      }

      const result = select_filtered_cards(state)

      expect(result).toEqual(["card-1", "card-2", "card-3"])
    })
  })

  describe("set_active_lesson", () => {
    it("should set active lesson", async () => {
      const { store } = await create_store_for_tests()

      expect(store.getState().deck_update.active_lesson_id).toBe(null)

      await store.dispatch(
        deck_update_actions.set_active_lesson({ lesson_id: "lesson-1" }),
      )

      expect(store.getState().deck_update.active_lesson_id).toBe("lesson-1")
    })

    it("should set active lesson to null", async () => {
      const { store } = await create_store_for_tests()

      await store.dispatch(
        deck_update_actions.set_active_lesson({ lesson_id: "lesson-1" }),
      )
      expect(store.getState().deck_update.active_lesson_id).toBe("lesson-1")

      await store.dispatch(
        deck_update_actions.set_active_lesson({ lesson_id: null }),
      )
      expect(store.getState().deck_update.active_lesson_id).toBe(null)
    })
  })

  describe("create_lesson and delete_lesson", () => {
    it("should create a lesson and add it to state", async () => {
      const { store, dependencies } = await create_store_for_tests()
      const decks_repository = dependencies
        .decks_repository as DecksRepositoryInMemory
      const users_repository = dependencies
        .users_repository as UsersRepositoryInMemory

      // Set up authenticated user
      await users_repository.set_authenticated_user({
        id: "user-1",
        email: "test@example.com",
      })

      // Re-initialize to load the authenticated user
      await store.dispatch(global_actions.global_app_initialized())
      await delay()

      const deck: DeckEntity = {
        id: "deck-1",
        name: "Test Deck",
        front_language: "en",
        back_language: "fr",
        description: null,
        user_id: "user-1",
        updated_at: new Date(),
        created_at: new Date(),
        visibility: "private",
        number_of_cards: 0,
        number_of_cards_ready_to_be_reviewed: 0,
        number_of_cards_not_ready_to_be_reviewed: 0,
        number_of_users_using_this_deck: 0,
      }

      const cards: CardEntity[] = []

      await decks_repository.sync_deck({ deck, cards })
      dependencies.location_service.navigate("/decks/deck-1/update")

      await store.dispatch(deck_update_actions.create_lesson())

      const lessons = store.getState().deck_update.lessons
      expect(lessons).toHaveLength(1)
      expect(lessons[0].name).toBe("Untitled")
      expect(lessons[0].deck_id).toBe("deck-1")
    })

    it("should delete a lesson from state and clear active lesson", async () => {
      const { store, dependencies } = await create_store_for_tests()
      const decks_repository = dependencies
        .decks_repository as DecksRepositoryInMemory
      const users_repository = dependencies
        .users_repository as UsersRepositoryInMemory

      // Set up authenticated user
      await users_repository.set_authenticated_user({
        id: "user-1",
        email: "test@example.com",
      })

      // Re-initialize to load the authenticated user
      await store.dispatch(global_actions.global_app_initialized())
      await delay()

      const deck: DeckEntity = {
        id: "deck-1",
        name: "Test Deck",
        front_language: "en",
        back_language: "fr",
        description: null,
        user_id: "user-1",
        updated_at: new Date(),
        created_at: new Date(),
        visibility: "private",
        number_of_cards: 0,
        number_of_cards_ready_to_be_reviewed: 0,
        number_of_cards_not_ready_to_be_reviewed: 0,
        number_of_users_using_this_deck: 0,
      }

      const cards: CardEntity[] = []

      await decks_repository.sync_deck({ deck, cards })
      dependencies.location_service.navigate("/decks/deck-1/update")

      // Create lesson in repository
      await decks_repository.create_lesson({
        deck_id: "deck-1",
        name: "Test Lesson",
      })

      // Load the deck to get the lesson into state
      await store.dispatch(
        deck_update_actions.load_deck_into_create_form({ deck_id: "deck-1" }),
      )

      const lessons = store.getState().deck_update.lessons
      expect(lessons).toHaveLength(1)

      await store.dispatch(
        deck_update_actions.set_active_lesson({ lesson_id: lessons[0].id }),
      )

      expect(store.getState().deck_update.active_lesson_id).toBe(lessons[0].id)

      // Delete the lesson
      await store.dispatch(
        deck_update_actions.delete_lesson({ lesson_id: lessons[0].id }),
      )

      const updated_lessons = store.getState().deck_update.lessons
      expect(updated_lessons).toHaveLength(0)
      expect(store.getState().deck_update.active_lesson_id).toBe(null)
    })

    it("should not change active_lesson_id when deleting a non-active lesson", async () => {
      const { store, dependencies } = await create_store_for_tests()
      const decks_repository = dependencies
        .decks_repository as DecksRepositoryInMemory
      const users_repository = dependencies
        .users_repository as UsersRepositoryInMemory

      // Set up authenticated user
      await users_repository.set_authenticated_user({
        id: "user-1",
        email: "test@example.com",
      })

      // Re-initialize to load the authenticated user
      await store.dispatch(global_actions.global_app_initialized())
      await delay()

      const deck: DeckEntity = {
        id: "deck-1",
        name: "Test Deck",
        front_language: "en",
        back_language: "fr",
        description: null,
        user_id: "user-1",
        updated_at: new Date(),
        created_at: new Date(),
        visibility: "private",
        number_of_cards: 0,
        number_of_cards_ready_to_be_reviewed: 0,
        number_of_cards_not_ready_to_be_reviewed: 0,
        number_of_users_using_this_deck: 0,
      }

      const cards: CardEntity[] = []

      await decks_repository.sync_deck({ deck, cards })
      dependencies.location_service.navigate("/decks/deck-1/update")

      // Create two lessons in repository
      const lesson1 = await decks_repository.create_lesson({
        deck_id: "deck-1",
        name: "Lesson 1",
      })

      const lesson2 = await decks_repository.create_lesson({
        deck_id: "deck-1",
        name: "Lesson 2",
      })

      // Load the deck to get the lessons into state
      await store.dispatch(
        deck_update_actions.load_deck_into_create_form({ deck_id: "deck-1" }),
      )

      const lessons = store.getState().deck_update.lessons
      expect(lessons).toHaveLength(2)

      // Set lesson1 as active
      await store.dispatch(
        deck_update_actions.set_active_lesson({ lesson_id: lesson1.id }),
      )

      expect(store.getState().deck_update.active_lesson_id).toBe(lesson1.id)

      // Delete lesson2 (not the active lesson)
      await store.dispatch(
        deck_update_actions.delete_lesson({ lesson_id: lesson2.id }),
      )

      const updated_lessons = store.getState().deck_update.lessons
      expect(updated_lessons).toHaveLength(1)
      expect(updated_lessons[0].id).toBe(lesson1.id)
      // active_lesson_id should still be lesson1
      expect(store.getState().deck_update.active_lesson_id).toBe(lesson1.id)
    })
  })
})

