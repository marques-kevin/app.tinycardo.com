import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => {
  return {
    lessons: state.decks_details.lessons,
  }
}

const map_dispatch = () => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
