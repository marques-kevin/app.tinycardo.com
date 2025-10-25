import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => ({
  visibility: state.decks.create_deck.visibility,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (visibility: "public" | "private" | "unlisted") => {
    dispatch(decks_actions.update_deck_set_visibility({ visibility }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
