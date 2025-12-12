import {
  create_store_for_tests,
  prepare_tests_for_update_deck,
} from "@/tests/create_store_for_tests"
import { describe, expect, it } from "vitest"
import * as ai_assistant_actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import { first, last } from "lodash"

describe("ai_assistant reducers", () => {
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

  it(`If the assistant returns an action 'update_cards', the cards should updated`, async () => {
    const { store } = await prepare_tests_for_update_deck()
    const last_card_id = last(store.getState().deck_update.cards)!

    let callback_response: unknown

    await store.dispatch(
      ai_assistant_actions.dispatch_tool({
        tool_name: "update_cards",
        values_returned_by_ai: {
          cards: [
            {
              id: last_card_id,
              front: "updated by ai assistant",
              back: "updated by ai assistant",
            },
          ],
        },
        callback: (data) => {
          callback_response = data
        },
      }),
    )

    const last_card = store.getState().deck_update.cards_map[last_card_id]!

    expect(last_card.front).toEqual("updated by ai assistant")
    expect(last_card.back).toEqual("updated by ai assistant")
    expect(callback_response).toMatchObject({
      type: "text",
      value: "Cards updated",
    })
  })

  it(`If the assistant returns an action 'create_lessons', the lessons should created`, async () => {
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

  it(`If the assistant returns an action 'update_lessons', the lessons should updated`, async () => {
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

    const last_lesson_id = last(store.getState().deck_update.lessons)!

    await store.dispatch(
      ai_assistant_actions.dispatch_tool({
        tool_name: "update_lessons",
        values_returned_by_ai: {
          lessons: [
            {
              id: last_lesson_id.id,
              name: "updated by ai assistant",
            },
          ],
        },
        callback: () => {},
      }),
    )

    expect(store.getState().deck_update.lessons[0].name).toEqual(
      "updated by ai assistant",
    )
  })

  it(`If the assistant returns an action 'delete_lessons', the lessons should deleted`, async () => {
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

    const last_lesson_id = last(store.getState().deck_update.lessons)!

    await store.dispatch(
      ai_assistant_actions.dispatch_tool({
        tool_name: "delete_lessons",
        values_returned_by_ai: {
          lesson_ids: [last_lesson_id.id],
        },
        callback: () => {},
      }),
    )

    expect(store.getState().deck_update.lessons).toHaveLength(0)
  })

  it(`If the assistant returns an action 'delete_cards', the cards should deleted`, async () => {
    const { store } = await prepare_tests_for_update_deck()
    const last_card_id = last(store.getState().deck_update.cards)!

    let callback_response: unknown

    await store.dispatch(
      ai_assistant_actions.dispatch_tool({
        tool_name: "delete_cards",
        values_returned_by_ai: {
          card_ids: [last_card_id],
        },
        callback: (data) => {
          callback_response = data
        },
      }),
    )

    expect(store.getState().deck_update.cards).not.toContain(last_card_id)
    expect(store.getState().deck_update.cards_map[last_card_id]).toBeUndefined()
  })
})
