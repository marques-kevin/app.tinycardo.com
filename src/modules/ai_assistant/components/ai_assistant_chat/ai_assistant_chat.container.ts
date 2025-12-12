import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import {
  send_message,
  close,
} from "@/modules/ai_assistant/redux/ai_assistant_actions"

const map_state = (state: RootState) => ({
  messages: state.ai_assistant.messages,
  is_open: state.ai_assistant.is_open,
  is_loading: state.ai_assistant.is_fetching,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_send_message: (content: string) => {
    dispatch(send_message({ content }))
  },
  on_close: () => {
    dispatch(close())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
