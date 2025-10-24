import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"

function mapState(state: RootState) {
  return {
    cards: state.decks_details.cards,
    front_language: state.decks_details.deck?.front_language || "en",
    back_language: state.decks_details.deck?.back_language || "es",
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {}
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
