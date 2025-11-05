import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  lessons: state.deck_update.lessons,
  active_lesson_id: state.deck_update.active_lesson_id,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_create_lesson: () => {
    dispatch(deck_update_actions.create_lesson())
  },
  on_open_rename_modal: (lesson_id: string) => {
    dispatch(deck_update_actions.open_rename_lesson_modal({ lesson_id }))
  },
  on_delete_lesson: (lesson_id: string) => {
    dispatch(deck_update_actions.delete_lesson({ lesson_id }))
  },
  on_set_active_lesson: (lesson_id: string | null) => {
    dispatch(deck_update_actions.set_active_lesson({ lesson_id }))
  },
  on_open_reorder_modal: () => {
    dispatch(deck_update_actions.open_reorder_lessons_modal())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
