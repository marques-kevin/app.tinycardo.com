import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import { next_month, previous_month } from "../../redux/streak_actions"

const mapState = (state: RootState) => {
  return {
    month: state.streak.month,
    year: state.streak.year,
    currentMonth: state.streak.currentMonth,
    calendar: state.streak.calendar,
    streaks: state.streak.streaks,
  }
}

const mapDispatch = (dispatch: Dispatch) => ({
  on_previous_month: () => {
    dispatch(previous_month())
  },
  on_next_month: () => {
    dispatch(next_month())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
