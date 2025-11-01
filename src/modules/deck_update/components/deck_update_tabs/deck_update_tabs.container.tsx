import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  lessons: state.deck_update.lessons,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_create_lesson: () => {
    dispatch(deck_update_actions.create_lesson())
  },
  on_open_rename_modal: (lesson_id: string) => {
    dispatch(deck_update_actions.open_rename_lesson_modal({ lesson_id }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
