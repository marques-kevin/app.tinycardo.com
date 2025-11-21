import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = () => ({})

const map_dispatch = (dispatch: Dispatch) => ({
  on_open_ai_modal: () => {
    dispatch(deck_update_actions.open_ai_modal())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>

