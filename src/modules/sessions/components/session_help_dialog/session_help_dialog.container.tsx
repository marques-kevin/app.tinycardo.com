import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { help_close } from "@/modules/sessions/redux/sessions_actions"

const mapState = (state: RootState) => {
  return {
    is_open: state.sessions.help.is_open,
    is_loading: state.sessions.help.is_loading,
    content: state.sessions.help.content,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  on_close() {
    return dispatch(help_close())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
