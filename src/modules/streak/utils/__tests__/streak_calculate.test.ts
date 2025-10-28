import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import {
  calculate_streak,
  sort_streaks,
} from "@/modules/streak/utils/streak_calculate"
import { describe, expect, it, vi } from "vitest"

describe("calculate streak", () => {
  vi.setSystemTime(new Date("2022-06-05"))

  it("should sort streaks", () => {
    const streaks: StreakEntity[] = [
      {
        id: "2022-06-01",
        user_id: "1",
        date: "2022-06-01",
      },
      {
        id: "2022-06-02",
        user_id: "1",
        date: "2022-06-02",
      },
    ]

    const sorted = sort_streaks(streaks)

    expect(sorted).toEqual([
      {
        id: "2022-06-02",
        user_id: "1",
        date: "2022-06-02",
      },
      {
        id: "2022-06-01",
        user_id: "1",
        date: "2022-06-01",
      },
    ])
  })

  it("should calculate streak", () => {
    const streaks: StreakEntity[] = [
      {
        id: "2022-06-01",
        user_id: "1",
        date: "2022-06-01",
      },
      {
        id: "2022-06-03",
        user_id: "1",
        date: "2022-06-03",
      },
      {
        id: "2022-06-04",
        user_id: "1",
        date: "2022-06-04",
      },
    ]

    const streak = calculate_streak(streaks)

    expect(streak).toEqual(2)
  })

  it("if the date of last streak is today or yesterday, return the good streak", () => {
    vi.setSystemTime(new Date("2022-06-05"))

    const streaks: StreakEntity[] = [
      {
        id: "2022-06-01",
        user_id: "1",
        date: "2022-06-01",
      },
      {
        id: "2022-06-03",
        user_id: "1",
        date: "2022-06-03",
      },
      {
        id: "2022-06-04",
        user_id: "1",
        date: "2022-06-04",
      },
    ]

    const streak = calculate_streak(streaks)

    expect(streak).toEqual(2)
  })

  it("if the date of last streak is more than yesterday, return 0", () => {
    vi.setSystemTime(new Date("2022-06-06"))

    const streaks: StreakEntity[] = [
      {
        id: "2022-06-01",
        user_id: "1",
        date: "2022-06-01",
      },
      {
        id: "2022-06-03",
        user_id: "1",
        date: "2022-06-03",
      },
      {
        id: "2022-06-04",
        user_id: "1",
        date: "2022-06-04",
      },
    ]

    const streak = calculate_streak(streaks)

    expect(streak).toEqual(0)
  })
})
