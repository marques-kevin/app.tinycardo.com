import { type Dispatch, type RootState } from "@/redux/store"
import { create_deck } from "@/modules/decks/redux/decks_actions"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => {
  return {
    is_creating_deck: state.decks.update.is_loading,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_create_new_deck() {
    dispatch(create_deck())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
