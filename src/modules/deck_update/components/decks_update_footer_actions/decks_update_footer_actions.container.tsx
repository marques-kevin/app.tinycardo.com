import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  selected_cards_length: state.deck_update.selected_cards.length,
  is_updating: state.deck_update.is_updating,
  lessons_length: state.deck_update.lessons.length,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_save: () => {
    dispatch(deck_update_actions.save())
  },
  on_back: () => {
    dispatch(deck_update_actions.exit_update_deck_page())
  },
  on_import_csv: (content: string) => {
    dispatch(deck_update_actions.import_cards_from_csv({ content }))
  },
  on_delete_selected_cards() {
    dispatch(deck_update_actions.delete_selected_cards())
  },
  on_open_add_to_lesson_modal() {
    dispatch(deck_update_actions.open_add_cards_to_lesson_modal())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
