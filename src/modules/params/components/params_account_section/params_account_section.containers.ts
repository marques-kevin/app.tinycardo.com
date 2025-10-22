import { type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import { logout } from "@/modules/authentication/redux/authentication_actions"

const map_state = () => ({})

const map_dispatch = (dispatch: Dispatch) => ({
  on_logout: () => {
    dispatch(logout())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
