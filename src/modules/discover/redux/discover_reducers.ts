import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/discover/redux/discover_actions"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"

export type DiscoverState = {
  decks: DiscoverDeckEntity[]
  is_loading: boolean
  actions: {
    is_open: boolean
    deck: DiscoverDeckEntity | null
    is_duplicating_deck: boolean
  }
}

const initialState: DiscoverState = {
  decks: [],
  is_loading: false,
  actions: {
    is_open: false,
    deck: null,
    is_duplicating_deck: false,
  },
}

export const discover_reducers = createReducer(initialState, (builder) => {
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

  builder.addCase(actions.open_action_dialog.fulfilled, (state, action) => {
    state.actions.is_open = true
    state.actions.deck = action.payload.deck
  })

  builder.addCase(actions.close_action_dialog.fulfilled, (state) => {
    state.actions.is_open = false
  })

  builder.addCase(actions.on_view_deck.fulfilled, (state) => {
    state.actions.is_open = false
  })

  builder.addCase(actions.on_use_deck.pending, (state) => {
    state.actions.is_open = false
    state.actions.is_duplicating_deck = true
  })

  builder.addCase(actions.on_use_deck.fulfilled, (state) => {
    state.actions.is_open = false
    state.actions.is_duplicating_deck = false
  })

  builder.addCase(actions.on_use_deck.rejected, (state) => {
    state.actions.is_duplicating_deck = false
  })
})
