import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import type { DiscoverDeckEntity } from "../../entities/discover_deck_entity"

const map_state = (state: RootState, props: DiscoverDeckEntity) => ({
  ...props,
})

const map_dispatch = (dispatch: Dispatch) => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
