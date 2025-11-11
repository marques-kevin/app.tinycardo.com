import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "@/modules/discover/redux/discover_actions"

const map_state = (state: RootState) => ({
  title_query: state.discover.filters.title_query,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_submit: (title_query: string) => {
    dispatch(
      actions.change_title_query_filter({
        title_query,
      }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>


