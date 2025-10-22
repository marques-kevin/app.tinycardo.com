import * as actions from "@/modules/language/redux/language_actions"
import { createReducer } from "@reduxjs/toolkit"

interface LangState {
  lang: string
}

const initialState: LangState = {
  lang: "en",
}

export const language_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions._store, (state, action) => {
    state.lang = action.payload.lang
  })
})
