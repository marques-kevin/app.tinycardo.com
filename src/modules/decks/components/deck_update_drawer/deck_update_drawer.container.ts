import { type RootState, type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as drawer_actions from "@/modules/drawer/redux/drawer_actions"

const map_state = (state: RootState) => {
  return {
    is_open: Boolean(state.drawer.deck_update_drawer),
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(drawer_actions.close_drawer({ key: "deck_update_drawer" }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
