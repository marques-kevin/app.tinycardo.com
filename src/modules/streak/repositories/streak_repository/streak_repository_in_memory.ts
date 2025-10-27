import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import type { StreakRepository } from "./streak_repository"
import { v4 } from "uuid"

export class StreakRepositoryInMemory implements StreakRepository {
  private streaks: StreakEntity[] = []

  constructor(params: Partial<{ streaks?: StreakEntity[] }> = {}) {
    this.streaks = params.streaks ?? []
  }

  async fetch(
    params: Parameters<StreakRepository["fetch"]>[0],
  ): ReturnType<StreakRepository["fetch"]> {
    return this.streaks.filter((streak) => streak.user_id === params.user_id)
  }

  async add_streak(
    params: Parameters<StreakRepository["add_streak"]>[0],
  ): ReturnType<StreakRepository["add_streak"]> {
    const streak: StreakEntity = {
      id: v4(),
      user_id: params.user_id,
      date: new Date(),
    }

    this.streaks.push(streak)

    return streak
  }
}
