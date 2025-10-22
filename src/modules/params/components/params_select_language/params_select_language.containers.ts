import * as actions from "@/modules/language/redux/language_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  value: state.language.lang,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (lang: string) => {
    dispatch(actions.store({ lang }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
