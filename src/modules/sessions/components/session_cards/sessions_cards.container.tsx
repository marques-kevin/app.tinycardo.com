import {
  flip_card,
  set_review_word,
  tts,
} from "@/modules/sessions/redux/sessions_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (state: RootState) => {
  return {
    review_mode: state.sessions.review_mode,
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
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
