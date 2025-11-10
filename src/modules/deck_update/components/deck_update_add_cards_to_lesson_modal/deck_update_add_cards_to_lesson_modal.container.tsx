import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => {
  const is_open = state.deck_update.add_cards_to_lesson_modal
  const lessons = state.deck_update.lessons
  const number_of_selected_cards = state.deck_update.selected_cards.length

  return {
    is_open,
    lessons,
    number_of_selected_cards,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_close_modal: () => {
    dispatch(deck_update_actions.close_add_cards_to_lesson_modal())
  },
  on_add_to_lesson: (lesson_id: string) => {
    dispatch(deck_update_actions.add_selected_cards_to_lesson({ lesson_id }))
  },
  on_create_lesson: () => {
    dispatch(deck_update_actions.create_lesson())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
