import { create_store_for_tests } from "@/tests/create_store_for_tests"
import type { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import * as sessions_actions from "@/modules/sessions/redux/sessions_actions"
import * as decks_actions from "@/modules/decks/redux/decks_actions"
import type { SessionsRepositoryInMemory } from "@/modules/sessions/repositories/sessions_repository_in_memory"
import { describe, expect, it, beforeEach } from "vitest"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { delay } from "@/modules/global/utils/delay"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

describe("sessions actions", () => {
  let session_repository: SessionsRepositoryInMemory
  let decks_repository: DecksRepositoryInMemory
  let redux: Awaited<ReturnType<typeof create_store_for_tests>>
  let deck: DeckEntity
  let cards: CardEntity[]

  beforeEach(async () => {
    redux = await create_store_for_tests()
    session_repository = redux.dependencies
      .sessions_repository as SessionsRepositoryInMemory
    decks_repository = redux.dependencies
      .decks_repository as DecksRepositoryInMemory

    deck = {
      id: "1",
      name: "test",
      front_language: "en",
      back_language: "es",
      user_id: "1",
      updated_at: new Date(),
      created_at: new Date(),
      visibility: "private",
      number_of_cards: 2,
    }

    cards = Array.from({ length: 2 }, (_, i) => ({
      id: `card-${i}`,
      deck_id: deck.id,
      front: `front-${i}`,
      back: `back-${i}`,
    }))

    await decks_repository.sync_deck({
      deck,
      cards,
    })

    await redux.store.dispatch(decks_actions.fetch_decks())
  })

  it(`should be able to start a session and review words in review mode`, async () => {
    await redux.store.dispatch(
      sessions_actions.start_session({
        deck_id: deck.id,
        mode: "learn_new_words",
      }),
    )

    let state = redux.store.getState().sessions

    expect(state.words_to_review.length).toEqual(2)
    expect(state.known_words.length).toEqual(0)
    expect(state.unknown_words.length).toEqual(0)
    expect(state.current_word).toEqual(state.words_to_review[0])

    await redux.store.dispatch(sessions_actions.flip_card())

    state = redux.store.getState().sessions

    expect(state.is_card_flipped).toEqual(true)

    await redux.store.dispatch(
      sessions_actions.set_review_word({ status: "known" }),
    )

    state = redux.store.getState().sessions

    expect(state.is_card_flipped).toEqual(false)
    expect(state.known_words.length).toEqual(1)
    expect(state.unknown_words.length).toEqual(0)
    expect(state.current_index).toEqual(1)
    expect(state.current_word).toEqual(state.words_to_review[1])
    expect(state.is_ended).toEqual(false)

    await delay()

    expect(
      await session_repository.fetch_history({ deck_id: "1" }),
    ).toHaveLength(1)

    await redux.store.dispatch(
      sessions_actions.set_review_word({ status: "unknown" }),
    )

    state = redux.store.getState().sessions

    expect(state.is_card_flipped).toEqual(false)
    expect(state.known_words.length).toEqual(1)
    expect(state.unknown_words.length).toEqual(1)
    expect(state.current_index).toEqual(2)
    expect(state.current_word).toEqual(null)
    expect(state.is_ended).toEqual(true)

    expect(session_repository.history.size).toEqual(2)
    expect(session_repository.history.get("card-0")).toBeDefined()
    expect(session_repository.history.get("card-1")).toBeDefined()
  })

  it(`in randomized mode, should not update history`, async () => {
    await session_repository.save_history({
      deck_id: deck.id,
      history: cards.map((card) => ({
        card_id: card.id,
        deck_id: card.deck_id,
        ease_factor: 5,
        last_reviewed_at: new Date(),
        next_due_at: new Date("2999-01-01"),
        repetition_count: 0,
      })),
    })

    await redux.store.dispatch(
      sessions_actions.start_session({ deck_id: deck.id, mode: "randomized" }),
    )

    await redux.store.dispatch(
      sessions_actions.set_review_word({ status: "known" }),
    )

    const history = await session_repository.fetch_history({ deck_id: deck.id })

    expect(history.every(({ ease_factor }) => ease_factor === 5)).toEqual(true)
  })

  it(`
     when user clicks on the help button,
     should open the help session modal, 
     should fetch from the api,
     should show the results,
     and when the user wants to close the modal,
     should modal be closed
     and if user try to help the same card
     should not make a request again
    `, async () => {
    await redux.store.dispatch(
      sessions_actions.start_session({
        deck_id: deck.id,
        mode: "learn_new_words",
      }),
    )

    let state = redux.store.getState().sessions

    expect(state.help.is_open).toEqual(false)

    await redux.store.dispatch(sessions_actions.help_open())

    state = redux.store.getState().sessions

    expect(state.help.is_open).toEqual(true)
    expect(state.help.content).toBeTruthy()
    expect(state.help.is_loading).toEqual(false)

    const history_id = `front-${state.current_word!.card_id}`
    const response_from_api = state.help.history[history_id]

    expect(response_from_api).toBeDefined()

    await redux.store.dispatch(sessions_actions.help_close())

    state = redux.store.getState().sessions

    expect(state.help.is_open).toEqual(false)

    await redux.store.dispatch(sessions_actions.help_open())

    state = redux.store.getState().sessions

    expect(state.help.is_open).toEqual(true)
    expect(state.help.history[history_id]).toEqual(response_from_api)
  })

  it(`
    should throw an error if the mode is undefined or not valid
  `, async () => {
    await redux.store.dispatch(
      sessions_actions.start_session({
        deck_id: deck.id,
        // @ts-expect-error for tests
        mode: "nope",
      }),
    )

    await delay()

    const state = redux.store.getState()

    expect(state.dialog.crash.is_open).toEqual(true)
  })

  it(`
    should reset the state if an error happens when start session,
    and should redirect user to home page
  `, async () => {
    const initial_state = { ...redux.store.getState().sessions }

    await redux.store.dispatch(
      sessions_actions.start_session({
        deck_id: deck.id,
        mode: "learn_new_words",
      }),
    )

    let state = redux.store.getState().sessions

    expect(state.words_to_review.length).toEqual(2)
    expect(state.known_words.length).toEqual(0)
    expect(state.unknown_words.length).toEqual(0)
    expect(state.current_word).toEqual(state.words_to_review[0])

    await redux.store.dispatch(sessions_actions.flip_card())

    state = redux.store.getState().sessions

    expect(state.is_card_flipped).toEqual(true)

    await redux.store.dispatch(
      sessions_actions.set_review_word({ status: "known" }),
    )
    await redux.store.dispatch(
      // @ts-expect-error for test
      sessions_actions.start_session({ mode: "not_exists" }),
    )

    await delay()

    state = redux.store.getState().sessions

    const dialog_state = redux.store.getState().dialog

    expect(state).toEqual(initial_state)
    expect(dialog_state.crash.is_open).toEqual(true)
  })
})
