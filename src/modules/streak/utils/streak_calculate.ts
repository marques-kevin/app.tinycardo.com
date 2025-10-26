import dayjs from "dayjs"
import type { StreakEntity } from "@/modules/streak/entities/streak_entity"

export const sort_streaks = (streaks: StreakEntity[]) => {
  return [...streaks].sort((a, b) => {
    return dayjs(b.date).diff(a.date)
  })
}

export const calculate_streak = (streaks: StreakEntity[]) => {
  if (streaks.length === 0) {
    return 0
  }

  const streaks_sorted = sort_streaks(streaks)

  const last_streak = streaks_sorted[0]

  if (!last_streak) {
    return 0
  }

  const today = dayjs().format("YYYY-MM-DD")
  const last_streak_date = dayjs(last_streak.date).format("YYYY-MM-DD")

  const diff_between_last_streak_and_today = dayjs(today).diff(
    dayjs(last_streak_date),
    "days",
  )

  if (diff_between_last_streak_and_today > 1) {
    return 0
  }

  let current_streak = 0

  for (let index = 0; index < streaks_sorted.length; index++) {
    const streak = streaks_sorted[index]
    const previous_streak = streaks_sorted[index - 1]

    if (!previous_streak) {
      current_streak++
    } else {
      const diff = dayjs(streaks_sorted[index - 1]?.date).diff(
        streak.date,
        "day",
      )

      if (diff === 1) {
        current_streak++
      } else {
        break
      }
    }
  }

  return current_streak
}
