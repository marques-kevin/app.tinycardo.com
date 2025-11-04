import { deck_update_filter_cards_by_lesson } from "../deck_update_filter_cards_by_lesson"
import { expect, it, describe } from "vitest"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"

describe("deck_update_filter_cards_by_lesson", () => {
  const cards: CardEntity["id"][] = ["c1", "c2", "c3", "card_without_lesson"]
  const lessons: LessonEntity[] = [
    {
      id: "l1",
      name: "Lesson 1",
      cards: ["c2", "c3"],
      deck_id: "d1",
      position: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "l2",
      name: "Lesson 2",
      cards: ["c1"],
      deck_id: "d1",
      position: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  it("should return all cards when lesson_id is null and lessons is empty", () => {
    const result = deck_update_filter_cards_by_lesson({
      cards,
      lessons: [],
      lesson_id: null,
    })
    expect(result).toEqual(cards)
  })

  it("should filter cards by lesson", () => {
    const result = deck_update_filter_cards_by_lesson({
      cards,
      lessons,
      lesson_id: "l1",
    })
    expect(result).toEqual(["c2", "c3"])
  })

  it("should when lessons is not empty and lesson_id is null, return only cards that are not in any lesson", () => {
    const result = deck_update_filter_cards_by_lesson({
      cards,
      lessons,
      lesson_id: null,
    })
    expect(result).toEqual(["card_without_lesson"])
  })
})
