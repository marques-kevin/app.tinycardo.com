import { create_store_for_tests } from "@/tests/create_store_for_tests"
import { describe, expect, it } from "vitest"
import * as actions from "@/modules/decks/redux/decks_actions"
import type { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { SessionsRepositoryInMemory } from "@/modules/sessions/repositories/sessions_repository_in_memory"

describe("decks actions", () => {
  it("should fetch decks and stats", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const decks_repository =
      dependencies.decks_repository as DecksRepositoryInMemory
    const sessions_repository =
      dependencies.sessions_repository as SessionsRepositoryInMemory

    const deck: DeckEntity = {
      id: "1",
      name: "test",
      front_language: "en",
      back_language: "es",
      user_id: "1",
      updated_at: new Date(),
      created_at: new Date(),
      visibility: "private",
      number_of_cards: 0,
    }

    const cards: CardEntity[] = [
      {
        id: "1",
        deck_id: deck.id,
        front: "test",
        back: "test",
      },
      {
        id: "2",
        deck_id: deck.id,
        front: "test",
        back: "test",
      },
    ]

    await sessions_repository.save_history({
      deck_id: deck.id,
      history: [
        {
          card_id: cards[0].id,
          deck_id: deck.id,
          ease_factor: 2.5,
          repetition_count: 0,
          last_reviewed_at: new Date("1990-01-01"),
          next_due_at: new Date("1990-01-01"),
        },
        {
          card_id: cards[1].id,
          deck_id: deck.id,
          ease_factor: 2.5,
          repetition_count: 0,
          last_reviewed_at: new Date("1990-01-01"),
          next_due_at: new Date("2999-01-01"),
        },
      ],
    })

    await decks_repository.sync_deck({
      deck: deck,
      cards: cards,
    })

    await store.dispatch(actions.fetch_decks())

    expect(store.getState().decks.decks).toEqual([deck])
    expect(store.getState().decks.stats).toEqual({
      [deck.id]: {
        deck_id: deck.id,
        number_of_cards: cards.length,
        number_of_cards_ready_to_be_reviewed: 1,
        number_of_cards_not_ready_to_be_reviewed: 1,
      },
    })
  })
})
