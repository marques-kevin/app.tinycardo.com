import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { close } from "@/modules/ai_assistant/redux/ai_assistant_actions"

const map_state = (state: RootState, props: { children: React.ReactNode }) => ({
  is_open: state.ai_assistant.is_open,
  children: props.children,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(close())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
