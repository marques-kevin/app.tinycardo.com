import type {
  AiAssistantService,
  ChatParams,
} from "@/modules/ai_assistant/services/ai_assistant_service/ai_assistant_service"
import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import { ApiService } from "@/modules/global/services/api_service/api_service"

export class AiAssistantServiceApi implements AiAssistantService {
  private readonly api_service: ApiService

  constructor() {
    this.api_service = new ApiService()
  }

  async chat(params: ChatParams): Promise<AiAssistantMessageEntity> {
    const response = await this.api_service.post<AiAssistantMessageEntity>(
      "/ai_assistant/chat",
      params,
    )

    return response
  }
}
