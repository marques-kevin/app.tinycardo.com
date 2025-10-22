import * as dialog_actions from "@/modules/dialog/redux/dialog_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  is_open: state.dialog.is_open,
  type: state.dialog.content.type,
  title: state.dialog.content.title,
  description: state.dialog.content.description,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(dialog_actions.close())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
