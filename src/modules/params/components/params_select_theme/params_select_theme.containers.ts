import { THEMES } from "@/modules/params/constants/themes"
import { store_theme } from "@/modules/params/redux/params_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  themes: THEMES,
  value: state.params.theme,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (theme: string) => {
    dispatch(store_theme({ theme }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
