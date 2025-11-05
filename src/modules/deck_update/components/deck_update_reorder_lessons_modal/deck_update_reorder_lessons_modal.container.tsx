import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => ({
  is_open: state.deck_update.reorder_lessons_modal,
  lessons: state.deck_update.lessons,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_close_modal: () => {
    dispatch(deck_update_actions.close_reorder_lessons_modal())
  },
  on_reorder_lessons: (reorder_data: Array<{ lesson_id: string; position: number }>) => {
    dispatch(deck_update_actions.reorder_lessons({ reorder_data }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>

