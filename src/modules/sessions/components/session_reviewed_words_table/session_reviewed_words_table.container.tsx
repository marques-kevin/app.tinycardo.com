import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

function mapState(state: RootState) {
  return {
    known_words: state.sessions.known_words,
    unknown_words: state.sessions.unknown_words,
  }
}

function mapDispatch() {
  return {}
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
