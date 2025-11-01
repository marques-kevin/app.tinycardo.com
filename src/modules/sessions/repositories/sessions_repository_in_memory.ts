import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"
import type { SessionsRepository } from "@/modules/sessions/repositories/sessions_repository"

export class SessionsRepositoryInMemory implements SessionsRepository {
  history: Map<string, SessionHistoryEntity> = new Map()

  async fetch_history(params: {
    deck_id: string
    user_id: string
  }): ReturnType<SessionsRepository["fetch_history"]> {
    return Array.from(this.history.values()).filter(
      (entry) => entry.deck_id === params.deck_id,
    )
  }

  async update_card_status(
    params: SessionHistoryEntity,
  ): ReturnType<SessionsRepository["update_card_status"]> {
    this.history.set(params.card_id, params)
    return params
  }

  async save_history(params: {
    deck_id: string
    history: SessionHistoryEntity[]
  }): ReturnType<SessionsRepository["save_history"]> {
    // Remove existing entries for this deck
    for (const [cardId, entry] of this.history.entries()) {
      if (entry.deck_id === params.deck_id) {
        this.history.delete(cardId)
      }
    }

    // Add new entries
    for (const entry of params.history) {
      this.history.set(entry.card_id, entry)
    }

    return params.history
  }

  async clear_history(): Promise<void> {
    this.history.clear()
  }
}
