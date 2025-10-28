import { connect, type ConnectedProps } from "react-redux"
import type { ReactNode } from "react"
import type { RootState } from "@/redux/store"

function map_state(state: RootState, props: { children?: ReactNode }) {
  return {
    is_fetching: state.decks.fetching.fetching_decks,
    children: props.children,
  }
}

export const connector = connect(map_state)
export type ContainerProps = ConnectedProps<typeof connector>
