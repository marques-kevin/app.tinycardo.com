import {
  create_store_for_tests,
  prepare_tests_for_update_deck,
} from "@/tests/create_store_for_tests"
import { describe, expect, it } from "vitest"
import * as ai_assistant_actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import { last } from "lodash"

describe("ai_assistant reducers", () => {
  describe("assistant modal state management", () => {
    it(`should have is_open set to false initially`, async () => {
      const { store } = await create_store_for_tests()

      expect(store.getState().ai_assistant.is_open).toBe(false)
    })

    it(`should set is_open to true when open action is dispatched`, async () => {
      const { store } = await create_store_for_tests()

      expect(store.getState().ai_assistant.is_open).toBe(false)

      store.dispatch(ai_assistant_actions.open())

      expect(store.getState().ai_assistant.is_open).toBe(true)

      store.dispatch(ai_assistant_actions.close())

      expect(store.getState().ai_assistant.is_open).toBe(false)
    })
  })

  describe("assistant tool CARDS management", () => {
    it(`If the assistant returns an action 'create_cards', the cards should added to the deck`, async () => {
      const { store } = await prepare_tests_for_update_deck()
      let callback_response: unknown

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_cards",
          values_returned_by_ai: {
            cards: [
              {
                front: "created by ai assistant",
                back: "created by ai assistant",
              },
            ],
          },
          callback: (data) => {
            callback_response = data
          },
        }),
      )

      const last_card_id = last(store.getState().deck_update.cards)!
      const last_card = store.getState().deck_update.cards_map[last_card_id]!

      expect(last_card.front).toEqual("created by ai assistant")
      expect(last_card.back).toEqual("created by ai assistant")
      expect(callback_response).toMatchObject({
        type: "text",
        value: "Cards created",
      })
    })

    it(`If the assistant returns an action 'delete_cards', the cards should deleted`, async () => {
      const { store } = await prepare_tests_for_update_deck()

      let card_sent_to_ai: {
        id: string
      }

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "request_cards_and_lessons_context",
          values_returned_by_ai: {},
          callback: (data) => {
            card_sent_to_ai = data.cards[0]
          },
        }),
      )

      let callback_response: unknown

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "delete_cards",
          values_returned_by_ai: {
            card_ids: [card_sent_to_ai!.id],
          },
          callback: (data) => {
            callback_response = data
          },
        }),
      )

      const view = store.getState().ai_assistant.view
      const real_card_id = view.cards[card_sent_to_ai!.id]!.id

      expect(store.getState().deck_update.cards).not.toContain(real_card_id)
    })

    it(`
      When the assistant returns an action 'update_cards'
        Then the cards should be updated
      `, async () => {
      const { store } = await prepare_tests_for_update_deck()

      const last_card_id = last(store.getState().deck_update.cards)!

      let cards_sent_to_ai: {
        id: string
        front: string
        back: string
        lesson_id?: string | null
      }[]

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "request_cards_and_lessons_context",
          values_returned_by_ai: {},
          callback: (data) => {
            cards_sent_to_ai = data.cards
          },
        }),
      )

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "update_cards",
          values_returned_by_ai: {
            cards: cards_sent_to_ai!.map((c) => ({
              id: c.id,
              front: "updated by ai assistant",
              back: "updated by ai assistant",
            })),
          },
          callback: () => {},
        }),
      )

      const last_card = store.getState().deck_update.cards_map[last_card_id]!

      expect(last_card.front).toEqual("updated by ai assistant")
      expect(last_card.back).toEqual("updated by ai assistant")
    })
  })

  describe("assistant tool LESSONS management", () => {
    it(`
      When the assistant returns an action 'create_lessons'
        Then the lessons should be created
    `, async () => {
      const { store } = await prepare_tests_for_update_deck()
      let callback_response: unknown

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_lessons",
          values_returned_by_ai: {
            lessons: [
              {
                name: "created by ai assistant",
              },
            ],
          },
          callback: (data) => {
            callback_response = data
          },
        }),
      )

      expect(callback_response).toMatchObject({
        type: "text",
        value: "Lessons created",
      })

      expect(store.getState().deck_update.lessons).toHaveLength(1)
      expect(store.getState().deck_update.lessons[0].name).toEqual(
        "created by ai assistant",
      )
    })

    it(`
    When the assistant returns an action 'update_lessons'
      Then the lessons should be updated
  `, async () => {
      const { store } = await prepare_tests_for_update_deck()

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_lessons",
          values_returned_by_ai: {
            lessons: [
              {
                name: "created by ai assistant",
              },
            ],
          },
          callback: () => {},
        }),
      )

      expect(store.getState().deck_update.lessons).toHaveLength(1)

      let lessons_sent_to_ai: {
        id: string
        name: string
      }[]

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "request_cards_and_lessons_context",
          values_returned_by_ai: {},
          callback: (data) => {
            lessons_sent_to_ai = data.lessons
          },
        }),
      )

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "update_lessons",
          values_returned_by_ai: {
            lessons: lessons_sent_to_ai!.map((lesson) => ({
              id: lesson.id,
              name: "updated by ai assistant",
            })),
          },
          callback: () => {},
        }),
      )

      expect(store.getState().deck_update.lessons[0].name).toEqual(
        "updated by ai assistant",
      )
    })

    it(`
    When the assistant returns an action 'delete_lessons'
      Then the lessons should be deleted
  `, async () => {
      const { store } = await prepare_tests_for_update_deck()

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_lessons",
          values_returned_by_ai: {
            lessons: [
              {
                name: "created by ai assistant",
              },
            ],
          },
          callback: () => {},
        }),
      )

      expect(store.getState().deck_update.lessons).toHaveLength(1)

      let lessons_sent_to_ai: {
        id: string
      }[]

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "request_cards_and_lessons_context",
          values_returned_by_ai: {},
          callback: (data) => {
            lessons_sent_to_ai = data.lessons
          },
        }),
      )

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "delete_lessons",
          values_returned_by_ai: {
            lesson_ids: lessons_sent_to_ai!.map((lesson) => lesson.id),
          },
          callback: () => {},
        }),
      )

      expect(store.getState().deck_update.lessons).toHaveLength(0)
    })
  })

  describe("assistant tool MOVE_CARDS_TO_A_LESSON management", () => {
    it(`
    When the assistant returns an action 'move_cards_to_a_lesson'
      Then the specified cards should be moved to the lesson
  `, async () => {
      const { store } = await prepare_tests_for_update_deck()

      // Create a lesson
      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_lessons",
          values_returned_by_ai: {
            lessons: [
              {
                name: "created_by_ai_assistant",
              },
            ],
          },
          callback: () => {},
        }),
      )

      // Create two cards
      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "create_cards",
          values_returned_by_ai: {
            cards: [
              {
                front: "created_by_ai_assistant",
                back: "created_by_ai_assistant",
              },
            ],
          },
          callback: () => {},
        }),
      )

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "request_cards_and_lessons_context",
          values_returned_by_ai: {},
          callback: (data) => {},
        }),
      )

      expect(store.getState().deck_update.lessons[0].cards).toEqual([])

      await store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: "move_cards_to_a_lesson",
          values_returned_by_ai: {
            card_ids: ["0"],
            lesson_id: "0",
          },
          callback: () => {},
        }),
      )

      expect(store.getState().deck_update.lessons[0].cards).toEqual(["card-0"])
    })
  })
})
