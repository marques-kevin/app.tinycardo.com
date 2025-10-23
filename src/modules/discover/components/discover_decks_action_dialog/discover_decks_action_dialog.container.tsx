import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import type { DiscoverDeckEntity } from "../../entities/discover_deck_entity"

type OwnProps = DiscoverDeckEntity & {
  is_open: boolean
  on_close: () => void
  on_show_deck: () => void
  on_start_using_deck: () => void
}

const map_state = (state: RootState, props: OwnProps) => ({
  ...props,
})

const map_dispatch = (dispatch: Dispatch) => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
