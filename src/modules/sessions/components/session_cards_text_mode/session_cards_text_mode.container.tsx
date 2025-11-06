import {
  flip_card,
  help_open,
  set_review_word,
  tts,
} from "@/modules/sessions/redux/sessions_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (state: RootState) => {
  return {
    back: state.sessions.current_word?.back || "",
    front: state.sessions.current_word?.front || "",
    is_flipped: state.sessions.is_card_flipped,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  set_review_word: (status: "known" | "unknown") => {
    dispatch(set_review_word({ status }))
  },
  on_tts() {
    dispatch(tts({}))
  },
  on_flip: () => {
    dispatch(flip_card())
  },
  on_help() {
    dispatch(help_open())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
