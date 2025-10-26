import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import { create_deck } from "@/modules/decks/redux/decks_actions"

function mapState(state: RootState) {
  return {}
}

function mapDispatch(dispatch: Dispatch) {
  return {
    on_create_new_deck() {
      dispatch(create_deck())
    },
  }
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
