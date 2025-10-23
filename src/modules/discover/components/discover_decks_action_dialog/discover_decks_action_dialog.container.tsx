import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "../../redux/discover_actions"

const map_state = (state: RootState) => ({
  is_open: state.discover.actions.is_open,
  name: state.discover.actions.deck!.name,
  deck_id: state.discover.actions.deck!.id,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(actions.close_action_dialog())
  },
  on_show_deck: (deck_id: string) => {
    dispatch(actions.on_view_deck({ deck_id }))
  },
  on_start_using_deck: (deck_id: string) => {
    dispatch(actions.on_use_deck({ deck_id }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
