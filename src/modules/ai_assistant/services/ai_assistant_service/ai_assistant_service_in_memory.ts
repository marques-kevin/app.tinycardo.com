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
