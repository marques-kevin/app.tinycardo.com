import { type RootState, type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as decks_actions from "@/modules/decks/redux/decks_actions"

const map_state = (state: RootState) => {
  return {
    ...state.decks.update.csv_import_dialog,
  }
}

const map_dispatch = (dispatch: Dispatch) => ({
  on_update_front_column(selected_front: number) {
    dispatch(decks_actions._update_csv_import_dialog({ selected_front }))
  },
  on_update_back_column(selected_back: number) {
    dispatch(decks_actions._update_csv_import_dialog({ selected_back }))
  },
  on_close() {
    dispatch(decks_actions._close_csv_import_dialog())
  },
  on_apply() {
    dispatch(decks_actions.apply_csv_import_mapping())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
