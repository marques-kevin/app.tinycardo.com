import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/drawer/redux/drawer_actions"
import { DRAWER_KEYS } from "./drawer_types"

export type DrawerState = {
  [DRAWER_KEYS.deck_details_drawer]: string | null
  [DRAWER_KEYS.deck_update_drawer]: string | null
}

const initial_state: DrawerState = {
  [DRAWER_KEYS.deck_details_drawer]: null,
  [DRAWER_KEYS.deck_update_drawer]: null,
}

export const drawer_reducers = createReducer(initial_state, (builder) => {
  builder.addCase(actions._set_drawer, (state, action) => {
    state[action.payload.key as keyof DrawerState] = action.payload.value
  })
})
