import {
  create_store_for_tests,
  prepare_tests_for_update_deck,
} from "@/tests/create_store_for_tests"
import { describe, expect, it } from "vitest"
import * as ai_assistant_actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import { last } from "lodash"

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

  it(`a user should be able to send a message to the ai assistant`, async () => {
    const { store } = await create_store_for_tests()

    expect(store.getState().ai_assistant.messages).toEqual([])

    await store.dispatch(
      ai_assistant_actions.send_message({
        content: "Hello",
      }),
    )

    expect(store.getState().ai_assistant.messages[0]).toMatchObject({
      id: expect.any(String),
      role: "user",
      content: "Hello",
      timestamp: expect.any(Date),
      actions: expect.any(Array),
    })
  })

  it(`When user sends a message, the ai assistant should reply with a message`, async () => {
    const { store } = await create_store_for_tests()

    expect(store.getState().ai_assistant.messages).toEqual([])

    await store.dispatch(
      ai_assistant_actions.send_message({
        content: "Hello",
      }),
    )

    expect(store.getState().ai_assistant.messages).toMatchObject([
      {
        id: expect.any(String),
        role: "user",
        content: "Hello",
        timestamp: expect.any(Date),
        actions: expect.any(Array),
      },
      {
        id: expect.any(String),
        role: "assistant",
        content: expect.any(String),
        timestamp: expect.any(Date),
        actions: expect.any(Array),
      },
    ])
  })

  it(`If the assistant returns an action 'create_cards', the cards should added to the deck`, async () => {
    const { store } = await prepare_tests_for_update_deck()

    await store.dispatch(
      ai_assistant_actions.send_message({
        content: "create_cards",
      }),
    )

    const last_card_id = last(store.getState().deck_update.cards)!
    const last_card = store.getState().deck_update.cards_map[last_card_id]!

    expect(last_card.front).toEqual("created by ai assistant")
    expect(last_card.back).toEqual("created by ai assistant")
  })

  it(`If the assistant returns an action 'update_cards', the cards should be updated`, async () => {
    const { store } = await prepare_tests_for_update_deck()

    await store.dispatch(
      ai_assistant_actions.send_message({
        content: "update_cards",
      }),
    )

    const updated_cards = store
      .getState()
      .deck_update.cards.map((card_id) => {
        return store.getState().deck_update.cards_map[card_id]!
      })
      .filter(
        (card) =>
          card.front === "updated by ai assistant" &&
          card.back === "updated by ai assistant",
      )

    expect(updated_cards.length).toBeGreaterThan(1)
  })
})
