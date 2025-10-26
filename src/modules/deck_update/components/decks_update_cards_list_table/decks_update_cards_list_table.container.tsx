import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  cards: state.deck_update.cards,
  front_language: state.deck_update.front_language,
  back_language: state.deck_update.back_language,
  is_selected: state.deck_update.selected_cards.length > 0,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_toggle_select_all_cards() {
    dispatch(deck_update_actions.update_deck_toggle_select_all_cards())
  },
  on_import_csv(content: string) {
    dispatch(deck_update_actions.import_cards_from_csv({ content }))
  },
  on_update_front_language(language: string) {
    dispatch(
      deck_update_actions.create_deck_update_front_language({ language }),
    )
  },
  on_update_back_language(language: string) {
    dispatch(deck_update_actions.create_deck_update_back_language({ language }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
