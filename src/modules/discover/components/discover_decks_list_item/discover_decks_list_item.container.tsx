import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import type { DiscoverDeckEntity } from "../../entities/discover_deck_entity"
import * as actions from "../../redux/discover_actions"

const map_state = (state: RootState, props: DiscoverDeckEntity) => ({
  ...props,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_click: (deck_id: string) => {
    dispatch(actions.open_action_dialog({ deck_id }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
