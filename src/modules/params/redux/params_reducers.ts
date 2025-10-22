import * as actions from "@/modules/params/redux/params_actions"
import { createReducer } from "@reduxjs/toolkit"

export interface ParamsState {
  theme: string
  how_many_words_to_review: number
  how_many_words_to_learn_new_words: number
  how_many_words_to_randomized: number
}

export const initial_state: ParamsState = {
  theme: "light",
  how_many_words_to_review: 50,
  how_many_words_to_learn_new_words: 10,
  how_many_words_to_randomized: 100,
}

export const params_reducers = createReducer(initial_state, (builder) => {
  builder.addCase(actions._store_theme, (state, action) => {
    state.theme = action.payload.theme
  })

  builder.addCase(actions._store_how_many_words_to_review, (state, action) => {
    state.how_many_words_to_review = action.payload.how_many_words_to_review
  })

  builder.addCase(
    actions._store_how_many_words_to_learn_new_words,
    (state, action) => {
      state.how_many_words_to_learn_new_words =
        action.payload.how_many_words_to_learn_new_words
    },
  )

  builder.addCase(
    actions._store_how_many_words_to_randomized,
    (state, action) => {
      state.how_many_words_to_randomized =
        action.payload.how_many_words_to_randomized
    },
  )
})
