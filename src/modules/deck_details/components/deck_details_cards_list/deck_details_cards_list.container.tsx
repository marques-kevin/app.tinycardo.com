import { connect, type ConnectedProps } from "react-redux"
import type { RootState, Dispatch } from "@/redux/store"
import { tts } from "@/modules/sessions/redux/sessions_actions"

function mapState(state: RootState) {
  return {
    cards: state.decks_details.cards,
    front_language: state.decks_details.deck?.front_language || "en",
    back_language: state.decks_details.deck?.back_language || "es",
  }
}

function map_dispatch(dispatch: Dispatch) {
  return {
    on_tts(params: { value: string; audio_url: string; language: string }) {
      dispatch(
        tts({
          language: params.language,
          value: params.value,
          audio_url: params.audio_url,
        }),
      )
    },
  }
}

export const connector = connect(mapState, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
