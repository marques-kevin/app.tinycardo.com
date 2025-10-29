import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/decks/redux/decks_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"

export type DecksState = {
  decks: DeckEntity[]
  cards: Record<string, CardEntity[]>
  fetching: {
    fetching_decks: boolean
    fetching_cards: boolean
  }
}

const initialState: DecksState = {
  decks: [],
  cards: {},
  fetching: {
    fetching_decks: false,
    fetching_cards: false,
  },
}

export const decks_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions.fetch_decks.pending, (state) => {
    state.fetching.fetching_decks = true
  })
  builder.addCase(actions.fetch_decks.fulfilled, (state, action) => {
    state.fetching.fetching_decks = false
    state.decks = action.payload
  })
  builder.addCase(actions.fetch_decks.rejected, (state) => {
    state.fetching.fetching_decks = false
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
