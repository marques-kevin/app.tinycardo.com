import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_details_actions from "@/modules/deck_details/redux/deck_details_actions"

const map_state = (state: RootState) => {
  return {
    lessons: state.decks_details.lessons,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_lesson_click: (lesson_id: string) => {
    dispatch(deck_details_actions.open_lesson_cards_modal({ lesson_id }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
