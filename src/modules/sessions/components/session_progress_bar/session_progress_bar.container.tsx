import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (state: RootState) => {
  return {
    total_words: state.sessions.words_to_review.length,
    current_index: state.sessions.current_index,
    is_ended: state.sessions.is_ended,
  }
}

const mapDispatch = () => ({})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
