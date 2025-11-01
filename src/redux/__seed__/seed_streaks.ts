import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import { seed_authenticated_user } from "./seed_users"
import dayjs from "dayjs"

export const seed_streaks: StreakEntity[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: `${i + 1}`,
    user_id: seed_authenticated_user.id,
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
  }),
).concat(
  Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 13}`,
    user_id: seed_authenticated_user.id,
    date: dayjs()
      .subtract(i + 15, "day")
      .format("YYYY-MM-DD"),
  })),
)
