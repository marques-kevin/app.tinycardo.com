import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import {
  update_deck,
  exit_update_deck_page,
  import_cards_from_csv,
  update_deck_delete_selected_cards,
} from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => ({
  selected_cards_length: state.decks.update.selected_cards.length,
  is_updating: state.decks.update.is_updating,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_save: () => {
    dispatch(update_deck())
  },
  on_back: () => {
    dispatch(exit_update_deck_page())
  },
  on_import_csv: ({ content }: { content: string }) => {
    dispatch(import_cards_from_csv({ content }))
  },
  on_delete_selected_cards() {
    dispatch(update_deck_delete_selected_cards())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
