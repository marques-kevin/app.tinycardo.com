import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import type { StreakRepository } from "./streak_repository"

export class StreakRepositoryInMemory implements StreakRepository {
  private streaks: StreakEntity[] = []

  constructor(params: Partial<{ streaks?: StreakEntity[] }> = {}) {
    this.streaks = params.streaks ?? []
  }

  async fetch(params: { user_id: string }): Promise<StreakEntity[]> {
    return this.streaks.filter((streak) => streak.user_id === params.user_id)
  }
}
