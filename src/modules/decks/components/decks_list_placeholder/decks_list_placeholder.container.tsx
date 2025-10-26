import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch } from "@/redux/store"
import { create_deck } from "@/modules/decks/redux/decks_actions"

function map_state(): Record<string, unknown> {
  return {}
}

function map_dispatch(dispatch: Dispatch) {
  return {
    on_create_new_deck() {
      dispatch(create_deck())
    },
  }
}

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
