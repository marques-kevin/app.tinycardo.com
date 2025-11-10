import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => {
  const lessons = state.decks_details.lessons
  const should_show_lessons_tab =
    lessons.length > 0 &&
    !(lessons.length === 1 && lessons[0]?.id === "__other__")

  return {
    lessons,
    should_show_lessons_tab,
  }
}

const map_dispatch = () => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
