import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import { type DecksRepository } from "@/modules/decks/repositories/decks_repository"
import { ApiService } from "@/modules/global/services/api_service/api_service"
import type { paths } from "@/types/api"

type ApiLesson = {
  id: string
  name: string
  deck_id: string
  cards: string[]
  position: number
  created_at: string
  updated_at: string
}

export class DecksRepositoryApi implements DecksRepository {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  private map_lesson(api_lesson: ApiLesson): LessonEntity {
    return {
      id: api_lesson.id,
      name: api_lesson.name,
      deck_id: api_lesson.deck_id,
      cards: [...api_lesson.cards],
      position: api_lesson.position,
      created_at: new Date(api_lesson.created_at),
      updated_at: new Date(api_lesson.updated_at),
    }
  }

  async fetch_decks(): ReturnType<DecksRepository["fetch_decks"]> {
    const data = await this.api_service.post<
      paths["/decks/get_decks"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/get_decks", {})

    return data.map((deck) => ({
      id: deck.id,
      name: deck.name,
      description: "",
      front_language: deck.front_language,
      back_language: deck.back_language,
      user_id: deck.user_id,
      created_at: new Date(deck.created_at),
      updated_at: new Date(deck.updated_at),
      visibility: "public",
      number_of_cards_ready_to_be_reviewed:
        deck.number_of_cards_ready_to_be_reviewed,
      number_of_cards_not_ready_to_be_reviewed:
        deck.number_of_cards_not_ready_to_be_reviewed,
      number_of_cards: deck.number_of_cards,
      number_of_users_using_this_deck: deck.number_of_users_who_use_the_deck,
    }))
  }

  async get_deck_by_id(
    params: Parameters<DecksRepository["get_deck_by_id"]>[0],
  ): ReturnType<DecksRepository["get_deck_by_id"]> {
    const { deck } = await this.api_service.post<
      paths["/decks/get_deck_by_id"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/get_deck_by_id", {
      id: params.deck_id,
    })

    return {
      ...deck,
      number_of_cards: deck.number_of_cards,
      number_of_cards_ready_to_be_reviewed:
        deck.number_of_cards_ready_to_be_reviewed,
      number_of_cards_not_ready_to_be_reviewed:
        deck.number_of_cards_not_ready_to_be_reviewed,
      number_of_users_using_this_deck: deck.number_of_users_who_use_the_deck,
      created_at: new Date(deck.created_at),
      updated_at: new Date(deck.updated_at),
      visibility: deck.visibility as "public" | "private" | "unlisted",
    }
  }

  async fetch_cards(params: {
    deck_id: string
  }): ReturnType<DecksRepository["fetch_cards"]> {
    const data = await this.api_service.post<
      paths["/cards/get_cards"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/cards/get_cards", {
      deck_id: params.deck_id,
    })

    return data.cards.map((card) => ({
      id: card.id,
      deck_id: card.deck_id,
      front: card.front,
      back: card.back,
      front_audio_url: card.front_audio_url,
      back_audio_url: card.back_audio_url,
    }))
  }

  async get_cards_by_deck_id(params: {
    deck_id: string
  }): ReturnType<DecksRepository["get_cards_by_deck_id"]> {
    return this.fetch_cards(params)
  }

  async create_deck(
    params: Parameters<DecksRepository["create_deck"]>[0],
  ): ReturnType<DecksRepository["create_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/create_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/create_deck", params)

    return {
      ...deck_response,
      number_of_cards: 0,
      number_of_cards_ready_to_be_reviewed: 0,
      number_of_cards_not_ready_to_be_reviewed: 0,
      number_of_users_using_this_deck: 0,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
    }
  }

  async update_deck(
    params: Parameters<DecksRepository["update_deck"]>[0],
  ): ReturnType<DecksRepository["update_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/update_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/update_deck", params)

    return {
      id: deck_response.id,
      name: deck_response.name,
      description: deck_response.description,
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
      number_of_cards_ready_to_be_reviewed: 0,
      number_of_cards_not_ready_to_be_reviewed: 0,
      number_of_users_using_this_deck: 0,
    }
  }

  async delete_deck(
    params: Parameters<DecksRepository["delete_deck"]>[0],
  ): ReturnType<DecksRepository["delete_deck"]> {
    await this.api_service.post<
      paths["/decks/delete_deck"]["post"]["responses"]["200"]
    >("/decks/delete_deck", params)
  }

  async upsert_cards(params: {
    deck_id: string
    cards: Array<{
      id?: string
      front: string
      back: string
    }>
  }): ReturnType<DecksRepository["upsert_cards"]> {
    await this.api_service.post<
      paths["/decks/upsert_cards"]["post"]["responses"]["201"]
    >("/decks/upsert_cards", {
      deck_id: params.deck_id,
      cards: params.cards,
    })
  }

  async duplicate_deck(
    params: Parameters<DecksRepository["duplicate_deck"]>[0],
  ): ReturnType<DecksRepository["duplicate_deck"]> {
    const deck_response = await this.api_service.post<
      paths["/decks/duplicate_deck"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/duplicate_deck", {
      deck_id: params.deck_id,
      user_id: params.user_id,
    })

    return {
      id: deck_response.id,
      name: deck_response.name,
      description: "",
      front_language: deck_response.front_language,
      back_language: deck_response.back_language,
      user_id: deck_response.user_id,
      visibility: deck_response.visibility as "public" | "private" | "unlisted",
      created_at: new Date(deck_response.created_at),
      updated_at: new Date(deck_response.updated_at),
      number_of_cards: 0,
      number_of_cards_ready_to_be_reviewed: 0,
      number_of_cards_not_ready_to_be_reviewed: 0,
      number_of_users_using_this_deck: 0,
    }
  }

  /**
   * ===============================
   *
   *
   *
   *
   *
   *
   *
   * Lessons
   *
   *
   *
   *
   *
   *
   *
   * ===============================
   */

  async fetch_lessons(params: {
    deck_id: string
    user_id: string
  }): ReturnType<DecksRepository["fetch_lessons"]> {
    const response = await this.api_service.post<
      paths["/lessons/get_lessons"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/lessons/get_lessons", {
      deck_id: params.deck_id,
    })

    return response.lessons.map((lesson) => this.map_lesson(lesson))
  }

  async upsert_lessons(
    params: Parameters<DecksRepository["upsert_lessons"]>[0],
  ): ReturnType<DecksRepository["upsert_lessons"]> {
    const body: paths["/lessons/upsert_lessons"]["post"]["requestBody"]["content"]["application/json"] =
      {
        deck_id: params.deck_id,
        lessons: params.lessons,
      }

    const response = await this.api_service.post<
      paths["/lessons/upsert_lessons"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/lessons/upsert_lessons", body)

    return response.lessons.map((lesson) => this.map_lesson(lesson))
  }

  /**
   * ===============================
   *
   *
   *
   * AI
   *
   *
   * ===============================
   */

  async send_to_ai(
    params: Parameters<DecksRepository["send_to_ai"]>[0],
  ): ReturnType<DecksRepository["send_to_ai"]> {
    const body: paths["/decks/builder"]["post"]["requestBody"]["content"]["application/json"] =
      {
        deck: {
          name: params.deck.name,
          description: params.deck.description ?? "",
          front_language: params.deck.front_language,
          back_language: params.deck.back_language,
        },
        cards: params.cards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
        })),
        lessons: params.lessons.map((lesson) => ({
          id: lesson.id,
          name: lesson.name,
          position: lesson.position,
          cards: lesson.cards,
        })),
        prompt: params.prompt,
      }

    const response = await this.api_service.post<
      paths["/decks/builder"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/builder", body)

    // Map API response to CardEntity and LessonEntity format
    // Note: The API types show Record<string, never> but the actual response should contain the data
    // We need to cast and map the response accordingly
    const response_data = response as unknown as {
      deck: {
        id: string
        name: string
        description: string
        front_language: string
        back_language: string
      }
      cards: Array<{
        id: string
        deck_id: string
        front: string
        back: string
      }>
      lessons: Array<{
        id: string
        name: string
        cards: string[]
        position: number
      }>
    }

    return {
      deck: {
        id: params.deck.id,
        name: response_data.deck.name,
        description: response_data.deck.description,
        front_language: response_data.deck.front_language,
        back_language: response_data.deck.back_language,
        user_id: params.deck.user_id,
        created_at: params.deck.created_at,
        updated_at: params.deck.updated_at,
        visibility: params.deck.visibility,
        number_of_cards: response_data.cards.length,
        number_of_cards_ready_to_be_reviewed:
          params.deck.number_of_cards_ready_to_be_reviewed,
        number_of_cards_not_ready_to_be_reviewed:
          params.deck.number_of_cards_not_ready_to_be_reviewed,
        number_of_users_using_this_deck:
          params.deck.number_of_users_using_this_deck,
      },
      cards: response_data.cards.map((card) => ({
        id: card.id,
        deck_id: card.deck_id,
        front: card.front,
        back: card.back,
        front_audio_url: "",
        back_audio_url: "",
      })),
      lessons: response_data.lessons.map((lesson) =>
        this.map_lesson({
          id: lesson.id,
          name: lesson.name,
          deck_id: params.deck.id,
          cards: lesson.cards,
          position: lesson.position,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      ),
    }
  }

  async generate_description(
    params: Parameters<DecksRepository["generate_description"]>[0],
  ): ReturnType<DecksRepository["generate_description"]> {
    // Use the builder endpoint with a description-focused prompt
    const body: paths["/decks/builder"]["post"]["requestBody"]["content"]["application/json"] =
      {
        deck: {
          name: params.deck.name,
          description: params.deck.description ?? "",
          front_language: params.deck.front_language,
          back_language: params.deck.back_language,
        },
        cards: params.cards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
        })),
        lessons: params.lessons.map((lesson) => ({
          id: lesson.id,
          name: lesson.name,
          position: lesson.position,
          cards: lesson.cards,
        })),
        prompt: `Generate a better, more engaging description for this deck: "${params.deck.name}". Current description: "${params.deck.description || ""}". The deck has ${params.cards.length} cards organized into ${params.lessons.length} lesson(s). Create a concise, appealing description that summarizes what users will learn.`,
      }

    const response = await this.api_service.post<
      paths["/decks/builder"]["post"]["responses"]["200"]["content"]["application/json"]
    >("/decks/builder", body)

    // Map API response to get the description
    const response_data = response as unknown as {
      deck: {
        id: string
        name: string
        description: string
        front_language: string
        back_language: string
      }
    }

    return response_data.deck.description || ""
  }
}
