import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const mapState = (state: RootState) => ({
  description: state.deck_update.description,
})

const mapDispatch = (dispatch: Dispatch) => ({
  on_change: (v: string) => {
    dispatch(
      deck_update_actions.update_deck_set_description({ description: v }),
    )
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
