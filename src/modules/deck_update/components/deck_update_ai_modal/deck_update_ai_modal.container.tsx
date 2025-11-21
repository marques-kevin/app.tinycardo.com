import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => {
  const is_open = state.deck_update.ai_modal
  const is_sending = state.deck_update.ai_modal_is_sending

  return {
    is_open,
    is_sending,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(deck_update_actions.close_ai_modal())
  },
  on_send: (prompt: string) => {
    dispatch(deck_update_actions.send_ai_prompt({ prompt }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
