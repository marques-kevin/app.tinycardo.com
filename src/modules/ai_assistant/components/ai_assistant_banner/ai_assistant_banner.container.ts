import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { open } from "@/modules/ai_assistant/redux/ai_assistant_actions"

const map_state = (state: RootState) => ({})

const map_dispatch = (dispatch: Dispatch) => ({
  on_open: () => {
    dispatch(open())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
