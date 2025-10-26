import { type RootState, type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const map_state = (state: RootState) => {
  return {
    ...state.deck_update.csv_import_dialog,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_update_front_column(selected_front: number) {
    dispatch(deck_update_actions._update_csv_import_dialog({ selected_front }))
  },
  on_update_back_column(selected_back: number) {
    dispatch(deck_update_actions._update_csv_import_dialog({ selected_back }))
  },
  on_close() {
    dispatch(deck_update_actions._close_csv_import_dialog())
  },
  on_apply() {
    dispatch(deck_update_actions.apply_csv_import_mapping())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
