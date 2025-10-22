import * as dialog_actions from "@/modules/dialog/redux/dialog_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  is_open: state.dialog.crash.is_open,
  message: state.dialog.crash.message,
  stack: state.dialog.crash.stack,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(dialog_actions.close_crash())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
