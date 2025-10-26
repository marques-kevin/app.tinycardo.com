import type { Dispatch, RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { start_session } from "@/modules/sessions/redux/sessions_actions"
import type { SessionsState } from "@/modules/sessions/redux/sessions_reducers"

const map_state = (state: RootState) => {
  return {
    state: "reviewed_and_learned_all_cards" as
      | "reviewed_and_learned_all_cards"
      | "learned_all_cards"
      | "reviewed_all_cards",
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  start_session: (params: { mode: SessionsState["mode"] }) => {
    dispatch(start_session({ mode: params.mode }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
