import { connect, type ConnectedProps } from "react-redux"
import type { RootState } from "@/redux/store"

function map_state(state: RootState) {
  return {
    is_ended: state.sessions.is_ended,
    is_loading: state.sessions.is_loading,
    no_cards_to_review: state.sessions.no_cards_to_review,
  }
}

const map_dispatch = () => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
