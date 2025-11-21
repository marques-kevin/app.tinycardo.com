import { session_builder_algorithm } from "@/modules/sessions/utils/session_builder_algorithm"
import { describe, expect, it } from "vitest"

describe("session_builder_algorithm", () => {
  it("should return 0 words if there are no words", () => {
    const words = session_builder_algorithm({
      cards: [],
      history: [],
    })

    expect(words.length).toEqual(0)
  })

  it("should return 0 words if there are no due date", () => {
    const words = session_builder_algorithm({
      cards: [
        {
          id: "1",
          deck_id: "1",
          front: "front",
          back: "back",
          front_audio_url: "https://example.com/front.mp3",
          back_audio_url: "https://example.com/back.mp3",
        },
      ],
      mode: "review",
      history: [
        {
          deck_id: "1",
          card_id: "1",
          repetition_count: 0,
          ease_factor: 2.5,
          next_due_at: new Date("2999-01-01"),
          last_reviewed_at: new Date(),
        },
      ],
    })

    expect(words.length).toEqual(0)
  })

  it("should return 1 word if there are due date", () => {
    const words = session_builder_algorithm({
      cards: [
        {
          id: "1",
          deck_id: "1",
          front: "front",
          back: "back",
          front_audio_url: "https://example.com/front.mp3",
          back_audio_url: "https://example.com/back.mp3",
        },
      ],
      mode: "review",
      history: [
        {
          deck_id: "1",
          card_id: "1",
          repetition_count: 0,
          ease_factor: 2.5,
          next_due_at: new Date("1999-01-01"),
          last_reviewed_at: new Date(),
        },
      ],
    })

    expect(words.length).toEqual(1)
  })

  it("should return only new words in 'learn_new_words' mode", () => {
    const words = session_builder_algorithm({
      cards: [
        {
          id: "1",
          deck_id: "1",
          front: "front",
          back: "back",
          front_audio_url: "https://example.com/front.mp3",
          back_audio_url: "https://example.com/back.mp3",
        },
        {
          id: "new_word",
          deck_id: "1",
          front: "front",
          back: "back",
          front_audio_url: "https://example.com/front.mp3",
          back_audio_url: "https://example.com/back.mp3",
        },
      ],
      mode: "learn_new_words",
      history: [
        {
          deck_id: "1",
          card_id: "1",
          repetition_count: 0,
          ease_factor: 2.5,
          next_due_at: new Date("1999-01-01"),
          last_reviewed_at: new Date(),
        },
      ],
    })

    expect(words.length).toEqual(1)
    expect(words[0].card_id).toEqual("new_word")
  })

  it("should return only limited count of words in review mode", () => {
    const cards = Array.from({ length: 10 }).map((_, i) => ({
      id: `card-${i + 1}`,
      deck_id: "1",
      front: `front-${i + 1}`,
      back: `back-${i + 1}`,
      front_audio_url: "https://example.com/front.mp3",
      back_audio_url: "https://example.com/back.mp3",
    }))
    const words = session_builder_algorithm({
      cards,
      mode: "review",
      count: {
        review: 5,
        learn_new_words: 10,
        randomized: 10,
      },
      history: cards.map((card) => ({
        card_id: card.id,
        deck_id: card.deck_id,
        repetition_count: 0,
        ease_factor: 2.5,
        next_due_at: new Date("1999-01-01"),
        last_reviewed_at: new Date(),
      })),
    })

    expect(words.length).toEqual(5)
  })

  it("should return only limited count of words in learn_new_words mode", () => {
    const cards = Array.from({ length: 10 }).map((_, i) => ({
      id: `card-${i + 1}`,
      deck_id: "1",
      front: `front-${i + 1}`,
      back: `back-${i + 1}`,
      front_audio_url: "https://example.com/front.mp3",
      back_audio_url: "https://example.com/back.mp3",
    }))

    const words = session_builder_algorithm({
      cards,
      mode: "learn_new_words",
      count: {
        review: 10,
        learn_new_words: 5,
        randomized: 10,
      },
      history: [],
    })

    expect(words.length).toEqual(5)
  })

  it("in randomized mode, should return reviewed cards in random order", () => {
    const cards = Array.from({ length: 10 }).map((_, i) => ({
      id: `card-${i + 1}`,
      deck_id: "1",
      front: `front-${i + 1}`,
      back: `back-${i + 1}`,
      front_audio_url: "https://example.com/front.mp3",
      back_audio_url: "https://example.com/back.mp3",
    }))

    const words = session_builder_algorithm({
      cards,
      mode: "randomized",
      count: {
        review: 10,
        learn_new_words: 10,
        randomized: 5,
      },
      history: [],
    })

    expect(words.length).toEqual(0)

    const random_words = session_builder_algorithm({
      cards,
      mode: "randomized",
      count: {
        review: 10,
        learn_new_words: 10,
        randomized: 5,
      },
      history: cards.map((card) => ({
        card_id: card.id,
        deck_id: card.deck_id,
        repetition_count: 0,
        ease_factor: 2.5,
        next_due_at: new Date("1999-01-01"),
        last_reviewed_at: new Date(),
      })),
    })

    expect(random_words.length).toEqual(5)
  })
})
