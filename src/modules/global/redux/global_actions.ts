import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import * as decks_actions from "@/modules/decks/redux/decks_actions"
import * as deck_details_actions from "@/modules/deck_details/redux/deck_details_actions"
import * as sessions_actions from "@/modules/sessions/redux/sessions_actions"
import * as params_actions from "@/modules/params/redux/params_actions"
import * as dialog_actions from "@/modules/dialog/redux/dialog_actions"
import * as authentication_actions from "@/modules/authentication/redux/authentication_actions"
import * as discover_actions from "@/modules/discover/redux/discover_actions"
import * as drawer_actions from "@/modules/drawer/redux/drawer_actions"

export const global_app_initialized = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("global/global_app_initialized", async (_, { dispatch }) => {
  dispatch(authentication_actions.global_app_initialized())
})

export const global_app_user_authenticated = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("global/global_app_user_authenticated", async (_, { dispatch }) => {
  dispatch(decks_actions.global_app_initialized())
  dispatch(params_actions.global_app_initialized())
})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("global/route_changed", async (_, { dispatch }) => {
  dispatch(sessions_actions.global_route_changed())
  dispatch(decks_actions.global_route_changed())
  dispatch(deck_details_actions.global_route_changed())
  dispatch(discover_actions.global_route_changed())
  dispatch(drawer_actions.global_route_changed())
})

export const session_ended = createAsyncThunk<void, void, AsyncThunkConfig>(
  "global/session_ended",
  async (_, { dispatch }) => {
    dispatch(decks_actions.fetch_decks())
  },
)

export const catch_error = createAsyncThunk<
  void,
  {
    message: string
    stack: string
  },
  AsyncThunkConfig
>("global/catch_error", async (_, { dispatch }) => {
  dispatch(
    dialog_actions.open_crash({
      message: _.message,
      stack: _.stack,
    }),
  )
})
