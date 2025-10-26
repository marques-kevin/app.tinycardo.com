import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  visibility: state.deck_update.visibility,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (visibility: "public" | "private" | "unlisted") => {
    dispatch(deck_update_actions.update_deck_set_visibility({ visibility }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
