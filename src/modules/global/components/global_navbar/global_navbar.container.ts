import { type Dispatch, type RootState } from "@/redux/store"
import { create_deck } from "@/modules/decks/redux/decks_actions"
import { open_streak_modal } from "@/modules/streak/redux/streak_actions"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => {
  return {
    is_creating_deck: state.deck_update.is_loading,
    current_streak: state.streak.current_streak,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_create_new_deck() {
    dispatch(create_deck())
  },
  on_open_streak_modal() {
    dispatch(open_streak_modal())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
