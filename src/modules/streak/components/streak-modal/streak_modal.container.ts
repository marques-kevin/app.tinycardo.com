import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import { close_streak_modal } from "@/modules/streak/redux/streak_actions"

const mapState = (state: RootState) => {
  return {
    is_open: state.streak.is_open,
    streaks: state.streak.streaks,
    current_streak: state.streak.current_streak,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  on_close_streak_modal() {
    dispatch(close_streak_modal())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
