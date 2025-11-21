import { flip_card, tts } from "@/modules/sessions/redux/sessions_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (state: RootState) => {
  return {
    back: state.sessions.current_word?.back || "",
    front: state.sessions.current_word?.front || "",
    back_language: state.sessions.back_language,
    is_flipped: state.sessions.is_card_flipped,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  on_tts() {
    dispatch(
      tts({
        side: "back",
      }),
    )
  },
  on_flip() {
    dispatch(flip_card())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
