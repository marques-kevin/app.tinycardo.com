import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"

const map_state = (state: RootState) => ({
  decks: state.discover.decks,
})

const map_dispatch = (dispatch: Dispatch) => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
