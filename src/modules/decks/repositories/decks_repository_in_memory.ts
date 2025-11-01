import { type DeckEntity } from "@/modules/decks/entities/deck_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { v4 } from "uuid"
import type { LessonEntity } from "../entities/lesson_entity"

export class DecksRepositoryInMemory implements DecksRepository {
  private decks: DeckEntity[] = []
  private cards: Record<string, CardEntity[]> = {}
  public lessons: LessonEntity[] = []

  constructor(
    params: Partial<{
      decks?: DeckEntity[]
      cards?: CardEntity[]
      lessons?: LessonEntity[]
    }> = {},
  ) {
    this.decks = params.decks ?? []
    this.store_cards(params.cards ?? [])
    this.lessons = params.lessons ?? []
  }

  private store_cards(cards: CardEntity[]): void {
    this.cards = cards.reduce(
      (acc, card) => {
        acc[card.deck_id] = [...(acc[card.deck_id] || []), card]
        return acc
      },
      {} as Record<string, CardEntity[]>,
    )
  }

  async sync_deck(params: { deck: DeckEntity; cards: CardEntity[] }) {
    this.decks = [...this.decks, params.deck]
    this.store_cards(params.cards)

    return params.deck
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    return this.decks.map((deck) => ({
      ...deck,
      number_of_cards: this.cards[deck.id]?.length ?? 0,
    }))
  }

  async get_deck_by_id(
    params: Parameters<DecksRepository["get_deck_by_id"]>[0],
  ): ReturnType<DecksRepository["get_deck_by_id"]> {
    const decks = await this.fetch_decks()

    const deck = decks.find((d) => d.id === params.deck_id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    return deck
  }

  async fetch_cards(params: {
    deck_id: string
  }): ReturnType<DecksRepository["fetch_cards"]> {
    return this.cards[params.deck_id] || []
  }

  async get_cards_by_deck_id(params: {
    deck_id: string
  }): ReturnType<DecksRepository["get_cards_by_deck_id"]> {
    return this.fetch_cards(params)
  }

  async create_deck(params: {
    name: string
    user_id: string
    description: string
    front_language: string
    back_language: string
  }): ReturnType<DecksRepository["create_deck"]> {
    const deck: DeckEntity = {
      id: `${Date.now().toString()}-${Math.random()}`,
      name: params.name,
      description: params.description,
      front_language: params.front_language,
      back_language: params.back_language,
      user_id: params.user_id,
      visibility: "private",
      created_at: new Date(),
      updated_at: new Date(),
      number_of_cards: 0,
      number_of_cards_ready_to_be_reviewed: 0,
      number_of_cards_not_ready_to_be_reviewed: 0,
      number_of_users_using_this_deck: 0,
    }

    this.decks = [...this.decks, deck]

    return deck
  }

  async update_deck(params: {
    id: string
    name?: string
    description?: string
    front_language?: string
    back_language?: string
  }): ReturnType<DecksRepository["update_deck"]> {
    const deck = this.decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    const updated_deck: DeckEntity = {
      ...deck,
      name: params.name ?? deck.name,
      front_language: params.front_language ?? deck.front_language,
      back_language: params.back_language ?? deck.back_language,
      updated_at: new Date(),
    }

    this.decks = this.decks.map((d) => (d.id === params.id ? updated_deck : d))

    return updated_deck
  }

  async delete_deck(params: {
    id: string
  }): ReturnType<DecksRepository["delete_deck"]> {
    const deck = this.decks.find((d) => d.id === params.id)

    if (!deck) {
      throw new Error("Deck not found")
    }

    this.decks = this.decks.filter((d) => d.id !== params.id)
    delete this.cards[params.id]
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<DecksRepository["upsert_cards"]> {
    this.cards[params.deck_id] = params.cards.map((card) => ({
      id: card.id || v4(),
      deck_id: params.deck_id,
      front: card.front,
      back: card.back,
    }))
  }

  async duplicate_deck(
    params: Parameters<DecksRepository["duplicate_deck"]>[0],
  ): ReturnType<DecksRepository["duplicate_deck"]> {
    const deck = await this.get_deck_by_id({
      deck_id: params.deck_id,
      user_id: params.user_id,
    })
    const cards = await this.fetch_cards({ deck_id: deck.id })

    const new_deck = await this.create_deck({
      name: `${deck.name} (Copy)`,
      description: deck.description ?? "",
      front_language: deck.front_language,
      back_language: deck.back_language,
      user_id: params.user_id,
    })

    await this.upsert_cards({
      deck_id: new_deck.id,
      cards: cards.map((card) => ({
        ...card,
        id: v4(),
        deck_id: new_deck.id,
      })),
    })

    return new_deck
  }

  async fetch_lessons(params: {
    deck_id: string
    user_id: string
  }): ReturnType<DecksRepository["fetch_lessons"]> {
    return this.lessons.filter((lesson) => lesson.deck_id === params.deck_id)
  }

  async create_lesson(
    params: Parameters<DecksRepository["create_lesson"]>[0],
  ): ReturnType<DecksRepository["create_lesson"]> {
    const existing_lessons = this.lessons.filter(
      (lesson) => lesson.deck_id === params.deck_id,
    )
    const max_position =
      existing_lessons.reduce(
        (max, lesson) => Math.max(max, lesson.position),
        -1,
      ) + 1

    const lesson: LessonEntity = {
      id: v4(),
      deck_id: params.deck_id,
      name: params.name,
      cards: [],
      position: max_position,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.lessons = [...this.lessons, lesson]
    return lesson
  }

  async rename_lesson(
    params: Parameters<DecksRepository["rename_lesson"]>[0],
  ): ReturnType<DecksRepository["rename_lesson"]> {
    const lesson = this.lessons.find((l) => l.id === params.lesson_id)

    if (!lesson) {
      throw new Error("Lesson not found")
    }

    const updated_lesson: LessonEntity = {
      ...lesson,
      name: params.name,
      updated_at: new Date(),
    }

    this.lessons = this.lessons.map((l) =>
      l.id === params.lesson_id ? updated_lesson : l,
    )

    return updated_lesson
  }

  async delete_lesson(
    params: Parameters<DecksRepository["delete_lesson"]>[0],
  ): ReturnType<DecksRepository["delete_lesson"]> {
    const lesson = this.lessons.find((l) => l.id === params.lesson_id)

    if (!lesson) {
      throw new Error("Lesson not found")
    }

    this.lessons = this.lessons.filter((l) => l.id !== params.lesson_id)
  }

  async update_lesson_cards_list(
    params: Parameters<DecksRepository["update_lesson_cards_list"]>[0],
  ): ReturnType<DecksRepository["update_lesson_cards_list"]> {
    const lesson = this.lessons.find((l) => l.id === params.lesson_id)

    if (!lesson) {
      throw new Error("Lesson not found")
    }

    this.lessons = this.lessons.map((l) =>
      l.id === params.lesson_id ? { ...l, cards: params.card_ids } : l,
    )

    return lesson
  }
}
