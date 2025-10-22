import { type Dispatch } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as actions from "@/modules/params/redux/params_actions"

const map_state = () => ({})

const map_dispatch = (dispatch: Dispatch) => ({
  on_delete_all_data: () => {
    dispatch(actions.delete_all_data())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
