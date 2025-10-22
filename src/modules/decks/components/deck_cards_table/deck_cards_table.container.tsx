import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (state: RootState) => {
  return {
    cards: state.decks.cards,
    is_fetching: state.decks.fetching.fetching_cards,
  }
}

const mapDispatch = () => ({})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
