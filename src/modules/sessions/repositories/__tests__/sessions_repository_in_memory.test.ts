import { type SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"
import { SessionsRepositoryInMemory } from "@/modules/sessions/repositories/sessions_repository_in_memory"
import { beforeEach, describe, expect, it } from "vitest"

describe("SessionsRepositoryInMemory", () => {
  let repository: SessionsRepositoryInMemory
  const now = new Date()

  const mock_history: SessionHistoryEntity = {
    card_id: "card-1",
    deck_id: "deck-1",
    ease_factor: 2.5,
    repetition_count: 0,
    last_reviewed_at: now,
    next_due_at: now,
  }

  beforeEach(() => {
    repository = new SessionsRepositoryInMemory()
  })

  describe("fetch_history", () => {
    it("should return empty array when no history exists", async () => {
      const result = await repository.fetch_history({ deck_id: "deck-1" })

      expect(result).toEqual([])
    })

    it("should return history for specific deck", async () => {
      await repository.update_card_status(mock_history)
      const result = await repository.fetch_history({ deck_id: "deck-1" })

      expect(result).toEqual([mock_history])
    })
  })

  describe("update_card_status", () => {
    it("should update history for a card", async () => {
      const result = await repository.update_card_status(mock_history)

      expect(result).toEqual(mock_history)

      expect(
        await repository.fetch_history({ deck_id: mock_history.deck_id }),
      ).toMatchObject([mock_history])
    })
  })

  describe("save_history", () => {
    it("should save multiple history entries", async () => {
      const mock_history_2: SessionHistoryEntity = {
        ...mock_history,
        card_id: "card-2",
      }

      const result = await repository.save_history({
        deck_id: "deck-1",
        history: [mock_history, mock_history_2],
      })

      expect(result).toHaveLength(2)
      expect(repository.history.size).toBe(2)
      expect(repository.history.get(mock_history.card_id)).toEqual(mock_history)
      expect(repository.history.get(mock_history_2.card_id)).toEqual(
        mock_history_2,
      )
    })

    it("should overwrite existing history", async () => {
      await repository.update_card_status(mock_history)

      const updated_history: SessionHistoryEntity = {
        ...mock_history,
        repetition_count: 1,
      }

      const result = await repository.save_history({
        deck_id: "deck-1",
        history: [updated_history],
      })

      expect(result).toHaveLength(1)
      expect(repository.history.get(mock_history.card_id)).toEqual(
        updated_history,
      )
    })
  })
})
