import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/sessions/redux/sessions_actions"

import type { SessionHistoryWithCardEntity } from "@/modules/sessions/entities/session_history_entity"
import { build_help_history_id } from "../utils/build_help_history_id"

export interface SessionsState {
  deck_id: string
  is_card_flipped: boolean
  is_loading: boolean
  mode: "review" | "learn_new_words" | "randomized"
  current_word: SessionHistoryWithCardEntity | null
  words_to_review: SessionHistoryWithCardEntity[]
  known_words: SessionHistoryWithCardEntity[]
  unknown_words: SessionHistoryWithCardEntity[]
  current_index: number
  is_ended: boolean
  no_cards_to_review: null | SessionsState["mode"]
  help: {
    history: Record<string, string>
    is_open: boolean
    content: string | null
    is_loading: boolean
  }
}

const initial_state: SessionsState = {
  deck_id: "",
  is_loading: false,
  is_card_flipped: false,
  mode: "review",
  current_word: null,
  words_to_review: [],
  known_words: [],
  unknown_words: [],
  current_index: 0,
  no_cards_to_review: null,
  is_ended: false,
  help: {
    history: {},
    is_open: false,
    content: null,
    is_loading: false,
  },
}

export const sessions_reducers = createReducer(initial_state, (builder) => {
  builder
    .addCase(actions._set_is_flipped, (state, action) => {
      state.is_card_flipped =
        action.payload.is_card_flipped ?? !state.is_card_flipped
    })
    .addCase(actions._start_session, (state, action) => {
      return {
        ...state,
        deck_id: action.payload.deck_id,
        words_to_review: action.payload.words_to_review,
        known_words: [],
        unknown_words: [],
        current_word: action.payload.words_to_review[0],
        current_index: 0,
        is_ended: false,
        no_cards_to_review: null,
        mode: action.payload.mode,
        help_cards_explained: {},
      }
    })
    .addCase(actions._update_session, (state, action) => {
      return {
        ...state,
        ...action.payload,
        current_word:
          state.words_to_review[action.payload.current_index] || null,
      }
    })
    .addCase(actions._set_is_loading, (state, action) => {
      state.is_loading = action.payload.is_loading
    })
    .addCase(actions._store_help_content, (state, action) => {
      state.help.history[
        build_help_history_id({
          is_front: !state.is_card_flipped,
          card_id: state.current_word!.card_id,
        })
      ] = action.payload.help_content

      state.help.content = action.payload.help_content
    })
    .addCase(actions._set_help_open, (state, action) => {
      state.help.is_open = action.payload.is_open
    })
    .addCase(actions._set_help_loading, (state, action) => {
      state.help.is_loading = action.payload.is_loading
    })
    .addCase(actions.no_cards_to_review.fulfilled, (state, action) => {
      return {
        ...state,
        no_cards_to_review: action.payload.mode,
      }
    })
    .addCase(actions._reset_session, () => {
      return {
        ...initial_state,
        help: { ...initial_state.help },
      }
    })
})
