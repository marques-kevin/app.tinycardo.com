import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const mapState = (state: RootState) => ({
  title: state.decks.create_deck.title,
})

const mapDispatch = (dispatch: Dispatch) => ({
  on_change: (v: string) => {
    dispatch(decks_actions._draft_set_title({ title: v }))
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
