import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch } from "@/redux/store"
import {
  create_deck_submit,
  exit_update_deck_page,
} from "@/modules/decks/redux/decks_actions"

const map_state = () => ({})

const map_dispatch = (dispatch: Dispatch) => ({
  on_save: () => {
    dispatch(create_deck_submit())
  },
  on_back: () => {
    dispatch(exit_update_deck_page())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
