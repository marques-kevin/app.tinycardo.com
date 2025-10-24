import {
  flip_card,
  go_on_session_page,
  help_open,
  set_review_word,
  tts,
} from "@/modules/sessions/redux/sessions_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { _close_deck_actions_dialog } from "../../redux/decks_actions"
import type { SessionsState } from "@/modules/sessions/redux/sessions_reducers"

const mapState = (state: RootState) => {
  return {
    deck: state.decks.deck_actions_dialog.deck,
    is_open: state.decks.deck_actions_dialog.open,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  on_close: () => {
    dispatch(_close_deck_actions_dialog())
  },
  on_start_session: (params: {
    deck_id: string
    mode: SessionsState["mode"]
  }) => {
    dispatch(go_on_session_page(params))
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
