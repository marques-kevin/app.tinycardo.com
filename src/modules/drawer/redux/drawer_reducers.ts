import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/drawer/redux/drawer_actions"

interface DrawerState {
  deck_details_drawer: string | null
}

const initial_state: DrawerState = {
  deck_details_drawer: null,
}

export const drawer_reducers = createReducer(initial_state, (builder) => {
  builder.addCase(actions._set_deck_details_drawer, (state, action) => {
    state.deck_details_drawer = action.payload.value
  })
})
