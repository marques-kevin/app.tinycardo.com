export type AiAssistantToolDispatch =
  | {
      tool_name: "create_cards"
      values_returned_by_ai: {
        cards: Array<{
          front: string
          back: string
        }>
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "create_lessons"
      values_returned_by_ai: {
        lessons: Array<{
          name: string
        }>
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "update_lessons"
      values_returned_by_ai: {
        lessons: Array<{
          id: string
          name: string
        }>
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "delete_lessons"
      values_returned_by_ai: {
        lesson_ids: string[]
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "request_cards_and_lessons_context"
      values_returned_by_ai: {}
      callback: (data: {
        cards: Array<{
          id: string
          front: string
          back: string
          lesson_id?: string | null
        }>
        lessons: Array<{
          id: string
          name: string
        }>
      }) => void
    }
  | {
      tool_name: "move_cards_to_a_lesson"
      values_returned_by_ai: {
        card_ids: string[]
        lesson_id: string
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "update_cards"
      values_returned_by_ai: {
        cards: Array<{
          id: string
          front: string
          back: string
        }>
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "delete_cards"
      values_returned_by_ai: {
        card_ids: string[]
      }
      callback: (data: { type: "text"; value: string }) => void
    }
  | {
      tool_name: "unknown"
      values_returned_by_ai: unknown
      callback: (data: { type: "text"; value: string }) => void
    }

export type AiAssistantMessageToolName = AiAssistantToolDispatch["tool_name"]

export type AiAssistantMessageContent =
  | {
      id: string
      type: "text"
      text: string
    }
  | {
      id: string
      type: "tool"
      tool_name: AiAssistantMessageToolName
      tool_fetching: boolean
      text: string
    }

export type AiAssistantMessageEntity = {
  id: string
  role: "user" | "assistant" | "system"
  content: Array<AiAssistantMessageContent>
  timestamp: Date
  is_fetching?: boolean
}
