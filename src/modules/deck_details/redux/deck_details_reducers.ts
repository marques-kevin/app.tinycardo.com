import { createReducer } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import * as actions from "@/modules/deck_details/redux/deck_details_actions"

export interface DecksDetailsState {
  deck: DeckEntity | null
  cards: CardEntity[]
  is_fetching: boolean
}

const initial_state: DecksDetailsState = {
  deck: null,
  cards: [],
  is_fetching: false,
}

export const decks_details_reducers = createReducer(
  initial_state,
  (builder) => {
    builder.addCase(actions.fetch_deck_details.pending, (state) => {
      state.is_fetching = true
    })

    builder.addCase(actions.fetch_deck_details.fulfilled, (state, action) => {
      state.is_fetching = false
      state.deck = action.payload.deck
      state.cards = action.payload.cards
    })

    builder.addCase(actions.fetch_deck_details.rejected, (state) => {
      state.is_fetching = false
    })
  },
)
