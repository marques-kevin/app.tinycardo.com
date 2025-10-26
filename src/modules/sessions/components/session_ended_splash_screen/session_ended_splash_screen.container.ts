import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import type { SessionsState } from "../../redux/sessions_reducers"
import { start_session } from "../../redux/sessions_actions"

function mapState(state: RootState) {
  return {
    known_words: state.sessions.known_words,
    unknown_words: state.sessions.unknown_words,
    mode: state.sessions.mode,
    deck_id: state.sessions.deck_id,
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    start_session(params: { mode: SessionsState["mode"] }) {
      dispatch(start_session({ mode: params.mode }))
    },
  }
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
