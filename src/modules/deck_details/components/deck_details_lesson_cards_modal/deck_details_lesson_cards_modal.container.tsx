import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_details_actions from "@/modules/deck_details/redux/deck_details_actions"

const map_state = (state: RootState) => {
  const modal = state.decks_details.lesson_cards_modal
  const front_language = state.decks_details.deck?.front_language || "en"
  const back_language = state.decks_details.deck?.back_language || "es"

  return {
    is_open: modal.is_open,
    lesson_name: modal.lesson_name,
    cards: modal.cards,
    front_language,
    back_language,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(deck_details_actions.close_lesson_cards_modal())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
