import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"

export interface SessionsRepository {
  fetch_history(params: {
    deck_id: string
    user_id: string
  }): Promise<SessionHistoryEntity[]>
  save_history(params: {
    deck_id: string
    user_id: string
    history: SessionHistoryEntity[]
  }): Promise<SessionHistoryEntity[]>
  update_card_status(
    params: SessionHistoryEntity,
  ): Promise<SessionHistoryEntity>
  clear_history(): Promise<void>
}
