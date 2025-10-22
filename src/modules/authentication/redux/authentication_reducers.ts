import * as actions from "@/modules/authentication/redux/authentication_actions"
import { createReducer } from "@reduxjs/toolkit"
import type { UserEntity } from "@/modules/authentication/entities/user_entity"

export interface AuthenticationState {
  user: UserEntity | null
  already_tried_to_authenticate: boolean
}

export const initial_state: AuthenticationState = {
  user: null,
  already_tried_to_authenticate: false,
}

export const authentication_reducers = createReducer(
  initial_state,
  (builder) => {
    builder.addCase(actions._store_user, (state, action) => {
      state.user = action.payload.user
      state.already_tried_to_authenticate = true
    })
  },
)
