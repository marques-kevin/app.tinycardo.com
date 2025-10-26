import { getCalendar } from "@/lib/date"
import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import { createReducer } from "@reduxjs/toolkit"
import {
  open_streak_modal,
  close_streak_modal,
  fetch_streaks,
  next_month,
  previous_month,
} from "./streak_actions"
import { calculate_streak } from "@/modules/streak/utils/streak_calculate"

interface StreakState {
  is_open: boolean
  fetching: boolean
  selected: Date
  month: number
  year: number
  currentMonth: Date
  calendar: Array<{ date: Date; isCurrentMonth?: boolean }>
  streaks: StreakEntity[]
  current_streak: number
}

const initialState: StreakState = {
  is_open: false,
  fetching: false,
  selected: new Date(),
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  currentMonth: new Date(),
  calendar: getCalendar({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }),
  streaks: [],
  current_streak: 0,
}

export const streak_reducers = createReducer(initialState, (builder) => {
  builder.addCase(open_streak_modal, (state) => {
    state.is_open = true
  })
  builder.addCase(close_streak_modal, (state) => {
    state.is_open = false
  })

  builder.addCase(fetch_streaks.pending, (state) => {
    state.fetching = true
  })
  builder.addCase(fetch_streaks.fulfilled, (state, action) => {
    state.fetching = false
    state.streaks = action.payload

    state.current_streak = calculate_streak(action.payload)
  })
  builder.addCase(fetch_streaks.rejected, (state) => {
    state.fetching = false
  })

  builder.addCase(previous_month, (state) => {
    const month = state.month === 0 ? 11 : state.month - 1
    const year = month === 11 ? state.year - 1 : state.year

    return {
      ...state,
      month,
      year,
      currentMonth: new Date(year, month, 1),
      calendar: getCalendar({ year, month }),
    }
  })
  builder.addCase(next_month, (state) => {
    const month = state.month === 11 ? 0 : state.month + 1
    const year = month === 0 ? state.year + 1 : state.year

    return {
      ...state,
      month,
      year,
      currentMonth: new Date(year, month, 1),
      calendar: getCalendar({ year, month }),
    }
  })
})
