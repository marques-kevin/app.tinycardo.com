type ActionBaseType = {
  type: "create_cards" | "update_cards"
  description: string
  payload: unknown
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

export type AiAssistantMessageEntity = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  actions: Array<ActionCreateCards | ActionUpdateCards>
}
