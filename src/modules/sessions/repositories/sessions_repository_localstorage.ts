import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"
import type { SessionsRepository } from "@/modules/sessions/repositories/sessions_repository"
import { uniqBy } from "ramda"

export class SessionsRepositoryLocalStorage implements SessionsRepository {
  private readonly localStorageKey = "history"

  private getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  async fetch_history(params: {
    deck_id: string
  }): ReturnType<SessionsRepository["fetch_history"]> {
    const history_item = this.getItem(this.localStorageKey)

    if (!history_item) return []

    const history = JSON.parse(history_item) as SessionHistoryEntity[]

    return history
      .filter((h: SessionHistoryEntity) => h.deck_id === params.deck_id)
      .map((h: SessionHistoryEntity) => ({
        ...h,
        last_reviewed_at: new Date(h.last_reviewed_at),
        next_due_at: new Date(h.next_due_at),
      }))
  }

  async update_card_status(
    params: SessionHistoryEntity,
  ): ReturnType<SessionsRepository["update_card_status"]> {
    const history = await this.fetch_history({
      deck_id: params.deck_id,
    })

    const map = new Map(
      history.map((h: SessionHistoryEntity) => [h.card_id, h]),
    )

    map.set(params.card_id, params)

    const updated_history = Array.from(map.values())

    localStorage.setItem(this.localStorageKey, JSON.stringify(updated_history))

    return params
  }

  async save_history(params: {
    deck_id: string
    history: SessionHistoryEntity[]
  }): ReturnType<SessionsRepository["save_history"]> {
    const history_saved_response = await this.fetch_history({
      deck_id: params.deck_id,
    })

    const history = uniqBy((h: SessionHistoryEntity) => h.card_id)([
      ...params.history,
      ...history_saved_response,
    ])

    localStorage.setItem(this.localStorageKey, JSON.stringify(history))

    return history
  }

  async clear_history(): Promise<void> {
    localStorage.removeItem(this.localStorageKey)
  }
}
