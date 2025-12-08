import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

export type ChatParams = {
  message: string
  conversation_history?: AiAssistantMessageEntity[]
  cards: CardEntity[]
  lessons: LessonEntity[]
  deck: DeckEntity
}

export interface AiAssistantService {
  chat(params: ChatParams): Promise<AiAssistantMessageEntity>
}
