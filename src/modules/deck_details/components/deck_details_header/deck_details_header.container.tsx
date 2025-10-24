import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"

function mapState(state: RootState) {
  return {
    name: state.decks_details.deck?.name,
    number_of_cards: state.decks_details.deck?.number_of_cards,
    updated_at: state.decks_details.deck?.updated_at,
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {}
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
