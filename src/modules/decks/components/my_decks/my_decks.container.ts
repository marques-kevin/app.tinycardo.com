import { type RootState, type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => {
  return {
    decks: state.decks.decks,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_click(deck_id: string) {
    dispatch(
      decks_actions.go_on_deck_details_page({
        deck_id,
      }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
