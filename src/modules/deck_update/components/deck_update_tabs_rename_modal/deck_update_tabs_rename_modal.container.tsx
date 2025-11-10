import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => {
  const lesson_id = state.deck_update.rename_lesson_modal
  const name = state.deck_update.lessons.find((l) => l.id === lesson_id)?.name

  return {
    is_open: lesson_id !== null,
    lesson_id,
    name: name || "Untitled",
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_close_modal: () => {
    dispatch(deck_update_actions.close_rename_lesson_modal())
  },
  on_rename_lesson: (lesson_id: string, name: string) => {
    dispatch(deck_update_actions.rename_lesson({ lesson_id, name }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
