import { type RootState, type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => {
  return {
    decks: state.decks.decks,
    stats: state.decks.stats,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_click(deck_id: string) {
    dispatch(
      decks_actions._open_deck_actions_dialog({
        deck: {
          id: deck_id,
          name: "",
          front_language: "",
          back_language: "",
          number_of_cards: 0,
          number_of_cards_ready_to_be_reviewed: 0,
          number_of_cards_not_ready_to_be_reviewed: 0,
        },
      }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
