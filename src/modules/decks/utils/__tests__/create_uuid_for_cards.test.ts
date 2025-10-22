import { create_uuid_for_cards } from "@/modules/decks/utils/create_uuid_for_cards"
import { describe, expect, it } from "vitest"

describe("create_uuid_for_cards", () => {
  it("should create a uuid for a card", () => {
    const uuid = create_uuid_for_cards({ front: "hello", back: "bonjour" })
    expect(uuid).toEqual("5dd59de8")
  })
})
