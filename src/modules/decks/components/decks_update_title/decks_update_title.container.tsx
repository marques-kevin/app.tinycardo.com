import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => ({
  title: state.decks.create_deck.title,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (v: string) => {
    dispatch(decks_actions.update_deck_set_title({ title: v }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
