import * as actions from "@/modules/discover/redux/discover_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  spoken_language: state.discover.filters.spoken_language,
  learning_language: state.discover.filters.learning_language,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change_filters: (filters: {
    spoken_language: string
    learning_language: string
  }) => {
    dispatch(
      actions.change_language_filter({
        spoken_language: filters.spoken_language,
        learning_language: filters.learning_language,
      }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>


