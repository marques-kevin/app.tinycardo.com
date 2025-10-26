import type { StreakEntity } from "@/modules/streak/entities/streak_entity"

export interface StreakRepository {
  fetch(params: { user_id: string }): Promise<StreakEntity[]>
}
