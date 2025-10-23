import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/discover/redux/discover_actions"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export type DiscoverState = {
  decks: DiscoverDeckEntity[]
  is_loading: boolean
}

const initialState: DiscoverState = {
  decks: [],
  is_loading: false,
}

export const discover_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._store_discover_decks, (state, action) => {
    state.decks = action.payload
  })

  builder.addCase(actions.fetch_discover_decks.pending, (state) => {
    state.is_loading = true
  })
  builder.addCase(actions.fetch_discover_decks.fulfilled, (state, action) => {
    state.is_loading = false
    state.decks = action.payload
  })
  builder.addCase(actions.fetch_discover_decks.rejected, (state) => {
    state.is_loading = false
  })
})
