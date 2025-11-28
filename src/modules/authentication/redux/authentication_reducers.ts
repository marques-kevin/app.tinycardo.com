import * as actions from "@/modules/authentication/redux/authentication_actions"
import { createReducer } from "@reduxjs/toolkit"
import type { UserEntity } from "@/modules/authentication/entities/user_entity"

export interface AuthenticationState {
  user: UserEntity | null
  is_user_premium: boolean
  already_tried_to_authenticate: boolean
}

export const initial_state: AuthenticationState = {
  user: null,
  is_user_premium: false,
  already_tried_to_authenticate: false,
}

export const authentication_reducers = createReducer(
  initial_state,
  (builder) => {
    builder.addCase(actions._store_user, (state, action) => {
      state.user = action.payload.user
      state.already_tried_to_authenticate = true
    })

    builder.addCase(actions._store_is_user_premium, (state, action) => {
      state.is_user_premium = action.payload.is_user_premium
    })

    builder.addCase(actions.logout.fulfilled, () => {
      return { ...initial_state }
    })
  },
)
