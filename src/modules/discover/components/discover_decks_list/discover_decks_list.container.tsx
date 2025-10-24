import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "../../redux/discover_actions"

const map_state = (state: RootState) => ({
  decks: state.discover.decks,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_view_deck: (deck_id: string) => {
    dispatch(actions.on_view_deck({ deck_id }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
