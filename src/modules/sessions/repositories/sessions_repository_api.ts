import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"
import type { SessionsRepository } from "@/modules/sessions/repositories/sessions_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

export class SessionsRepositoryApi implements SessionsRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async fetch_history(params: {
    deck_id: string
  }): ReturnType<SessionsRepository["fetch_history"]> {
    const data = await this.api_service.post<
      paths["/history/get_deck_history"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/history/get_deck_history", {
      deck_id: params.deck_id,
    })

    return data.map((history) => ({
      deck_id: history.deck_id,
      card_id: history.card_id,
      repetition_count: history.repetition_count,
      ease_factor: history.ease_factor,
      next_due_at: new Date(history.next_due_at),
      last_reviewed_at: new Date(history.last_reviewed_at),
    }))
  }

  async save_history(params: {
    deck_id: string
    history: SessionHistoryEntity[]
  }): ReturnType<SessionsRepository["save_history"]> {
    // The API handles history updates through the review endpoint
    // This method batches updates for each history entry
    // Note: This assumes all history entries represent "known" status
    // For proper implementation, we need status information for each entry

    const updated_history: SessionHistoryEntity[] = []

    for (const history_item of params.history) {
      // Determine status based on repetition_count
      // This is a heuristic: if repetition_count > 0, assume "known"
      const status = history_item.repetition_count > 0 ? "known" : "unknown"

      const response = await this.api_service.post<
        paths["/history/review"]["post"]["responses"]["200"]["content"]["application/json"]
      >("/history/review", {
        card_id: history_item.card_id,
        status,
      })

      updated_history.push({
        deck_id: response.card_id,
        card_id: response.card_id,
        repetition_count: response.repetition_count,
        ease_factor: response.ease_factor,
        next_due_at: new Date(response.next_due_at),
        last_reviewed_at: new Date(response.last_reviewed_at),
      })
    }

    return updated_history
  }

  async update_card_status(
    params: SessionHistoryEntity,
  ): ReturnType<SessionsRepository["update_card_status"]> {
    // TODO: This method needs refactoring to accept status ("known" | "unknown")
    // For now, we determine status based on whether this is a new review or update
    // This is a heuristic and may not be accurate in all cases

    const status = params.repetition_count > 0 ? "known" : "unknown"

    const response = await this.api_service.post<
      paths["/history/review"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/history/review", {
      card_id: params.card_id,
      status,
    })

    return {
      deck_id: response.deck_id,
      card_id: response.card_id,
      repetition_count: response.repetition_count,
      ease_factor: response.ease_factor,
      next_due_at: new Date(response.next_due_at),
      last_reviewed_at: new Date(response.last_reviewed_at),
    }
  }

  async clear_history(): Promise<void> {
    // Note: There is no API endpoint to clear history
    // This would need to be implemented on the backend
    // For now, this is a no-op
    console.info("clear_history is not implemented in the API")
  }
}
