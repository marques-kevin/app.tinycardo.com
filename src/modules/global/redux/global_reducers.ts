import { createReducer } from "@reduxjs/toolkit"

export interface GlobalState {
  router_history: {
    url: string
  }[]
}

export const initialState: GlobalState = {
  router_history: [],
}

export const global_reducers = createReducer(initialState, () => {})
