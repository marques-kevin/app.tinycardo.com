import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "@/modules/decks/redux/decks_actions"

const mapState = (state: RootState) => ({
  cards: state.decks.create_deck.cards,
  front_language: state.decks.create_deck.front_language,
  back_language: state.decks.create_deck.back_language,
})

const mapDispatch = (dispatch: Dispatch) => ({
  on_add: () => dispatch(actions.create_deck_add_new_card()),
  on_import_csv: (content: string) =>
    dispatch(actions.import_cards_from_csv({ content })),
  on_update_front_language: (language: string) =>
    dispatch(actions.create_deck_update_front_language({ language })),
  on_update_back_language: (language: string) =>
    dispatch(actions.create_deck_update_back_language({ language })),
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
