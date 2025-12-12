import type {
  AiAssistantService,
  ChatParams,
} from "@/modules/ai_assistant/services/ai_assistant_service/ai_assistant_service"
import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import { v4 } from "uuid"

export class AiAssistantServiceInMemory implements AiAssistantService {
  private create_response(params: ChatParams): AiAssistantMessageEntity {
    const { message } = params

    if (message.includes("create_cards")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will create some cards for you",
        timestamp: new Date(),
        actions: [
          {
            type: "create_cards",
            description: "I will create some cards for you",
            payload: {
              cards: [
                {
                  front: "created by ai assistant",
                  back: "created by ai assistant",
                },
              ],
            },
          },
        ],
      }
    }

    if (message.includes("update_cards")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will update some cards for you",
        timestamp: new Date(),
        actions: [
          {
            type: "update_cards",
            description: "I will update some cards for you",
            payload: {
              cards: params.cards.map((card) => ({
                id: card.id,
                front: "updated by ai assistant",
                back: "updated by ai assistant",
              })),
            },
          },
        ],
      }
    }

    if (message.includes("delete_cards")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will delete some cards for you",
        timestamp: new Date(),
        actions: [
          {
            type: "delete_cards",
            description: "I will delete some cards for you",
            payload: {
              card_ids: params.cards.map((card) => card.id),
            },
          },
        ],
      }
    }

    if (message.includes("create_lessons")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will create some lessons for you",
        timestamp: new Date(),
        actions: [
          {
            type: "create_lessons",
            description: "I will create some lessons for you",
            payload: {
              lessons: [
                {
                  name: "Created by AI assistant",
                },
              ],
            },
          },
        ],
      }
    }

    if (message.includes("update_lessons")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will update some lessons for you",
        timestamp: new Date(),
        actions: [
          {
            type: "update_lessons",
            description: "I will update some lessons for you",
            payload: {
              lessons: params.lessons.map((lesson) => ({
                id: lesson.id,
                name: "Updated by AI assistant",
              })),
            },
          },
        ],
      }
    }

    if (message.includes("delete_lessons")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will delete some lessons for you",
        timestamp: new Date(),
        actions: [
          {
            type: "delete_lessons",
            description: "I will delete some lessons for you",
            payload: {
              lesson_ids: params.lessons.map((lesson) => lesson.id),
            },
          },
        ],
      }
    }

    if (message.includes("add_cards_to_lessons")) {
      return {
        id: v4(),
        role: "assistant",
        content: "I will add cards to a lesson for you",
        timestamp: new Date(),
        actions: [
          {
            type: "add_cards_to_lessons",
            description: "I will add cards to a lesson for you",
            payload: {
              lesson_id: params.lessons[0]?.id ?? "",
              card_ids: params.cards.slice(0, 2).map((card) => card.id),
            },
          },
        ],
      }
    }

    return {
      id: v4(),
      role: "assistant",
      content: message,
      timestamp: new Date(),
      actions: [],
    }
  }

  async chat(params: ChatParams): Promise<AiAssistantMessageEntity> {
    return this.create_response(params)
  }
}
