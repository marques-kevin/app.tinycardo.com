import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  title: state.deck_update.title,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (v: string) => {
    dispatch(deck_update_actions.update_deck_set_title({ title: v }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
