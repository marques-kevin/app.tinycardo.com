import type { StreakRepository } from "./streak_repository"
import type { StreakEntity } from "@/modules/streak/entities/streak_entity"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class StreakRepositoryApi implements StreakRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async fetch(
    _params: Parameters<StreakRepository["fetch"]>[0],
  ): ReturnType<StreakRepository["fetch"]> {
    const data = await this.api_service.post<
      paths["/streaks/get_user_streaks"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/streaks/get_user_streaks", {})

    const streaks: StreakEntity[] = data.map((streak) => ({
      id: streak.id,
      user_id: streak.user_id,
      date: new Date(streak.date),
    }))

    return streaks
  }

  async add_streak(
    params: Parameters<StreakRepository["add_streak"]>[0],
  ): ReturnType<StreakRepository["add_streak"]> {
    const data = await this.api_service.post<
      paths["/streaks/add_streak"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/streaks/add_streak", {
      timezone: params.timezone,
    })

    const streak: StreakEntity = {
      id: data.id,
      user_id: data.user_id,
      date: new Date(data.date),
    }

    return streak
  }
}
