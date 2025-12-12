type ActionBaseType = {
  type:
    | "create_cards"
    | "update_cards"
    | "delete_cards"
    | "create_lessons"
    | "update_lessons"
    | "delete_lessons"
    | "add_cards_to_lessons"
  description: string
  payload: unknown
  is_fetching?: boolean
}

type ActionCreateCards = ActionBaseType & {
  type: "create_cards"
  payload: {
    cards: Array<{
      front: string
      back: string
    }>
  }
}

type ActionUpdateCards = ActionBaseType & {
  type: "update_cards"
  payload: {
    cards: Array<{
      id: string
      front: string
      back: string
    }>
  }
}

type ActionDeleteCards = ActionBaseType & {
  type: "delete_cards"
  payload: {
    card_ids: string[]
  }
}

type ActionCreateLessons = ActionBaseType & {
  type: "create_lessons"
  payload: {
    lessons: Array<{
      name: string
    }>
  }
}

type ActionUpdateLessons = ActionBaseType & {
  type: "update_lessons"
  payload: {
    lessons: Array<{
      id: string
      name: string
    }>
  }
}

type ActionDeleteLessons = ActionBaseType & {
  type: "delete_lessons"
  payload: {
    lesson_ids: string[]
  }
}

type ActionAddCardsToLessons = ActionBaseType & {
  type: "add_cards_to_lessons"
  payload: {
    lesson_id: string
    card_ids: string[]
  }
}

export type AiAssistantMessageTools =
  | "create_cards"
  | "update_cards"
  | "delete_cards"
  | "create_lessons"
  | "update_lessons"
  | "delete_lessons"
  | "add_cards_to_lessons"
  | "request_lessons_context"
  | "request_cards_context"

export type AiAssistantMessageTool =
  | {
      tool_name: "request_cards_context"
      values_returned_by_ai: {}
      values_to_send_to_ai: {
        cards: Array<{
          id: string
          front: string
          back: string
          lesson_id?: string | null
        }>
      }
    }
  | {
      tool_name: "request_lessons_context"
      values_returned_by_ai: {}
      values_to_send_to_ai: {
        lessons: Array<{
          id: string
          name: string
        }>
      }
    }
  | {
      tool_name: "create_cards"
      values_returned_by_ai: {
        cards: Array<{
          front: string
          back: string
        }>
      }
      values_to_send_to_ai: {
        cards: Array<{
          id: string
          front: string
          back: string
          lesson_id?: string | null
        }>
      }
    }

export type AiAssistantMessageContent =
  | {
      id: string
      type: "text"
      text: string
    }
  | {
      id: string
      type: "tool"
      tool_name: AiAssistantMessageTools
      tool_fetching: boolean
      text: string
    }

export type AiAssistantMessageEntity = {
  id: string
  role: "user" | "assistant"
  content: Array<AiAssistantMessageContent>
  timestamp: Date
  is_fetching?: boolean
}
