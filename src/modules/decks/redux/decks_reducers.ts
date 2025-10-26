import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/decks/redux/decks_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export type DecksState = {
  decks: DeckEntity[]
  stats: Record<
    string,
    {
      deck_id: string
      number_of_cards: number
      number_of_cards_ready_to_be_reviewed: number
      number_of_cards_not_ready_to_be_reviewed: number
    }
  >
  cards: Record<string, CardEntity[]>
  fetching: {
    fetching_cards: boolean
  }
}

const initialState: DecksState = {
  decks: [],
  stats: {},
  cards: {},
  fetching: {
    fetching_cards: false,
  },
}

export const decks_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._store_decks, (state, action) => {
    state.decks = action.payload
  })
  builder.addCase(actions._store_decks_stats, (state, action) => {
    state.stats = action.payload
  })

  builder.addCase(actions.fetch_cards.pending, (state) => {
    state.fetching.fetching_cards = true
  })
  builder.addCase(actions.fetch_cards.fulfilled, (state, action) => {
    state.fetching.fetching_cards = false
    const deck_id = action.meta.arg.deck_id
    state.cards[deck_id] = action.payload
  })
  builder.addCase(actions.fetch_cards.rejected, (state) => {
    state.fetching.fetching_cards = false
  })
})
