import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const mapState = (state: RootState) => ({
  description: state.decks.create_deck.description,
})

const mapDispatch = (dispatch: Dispatch) => ({
  on_change: (v: string) => {
    dispatch(decks_actions._draft_set_description({ description: v }))
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
