import type { Meta, StoryObj } from "@storybook/react"
import { Conversations } from "./ai_assistant_chat"
import { v4 } from "uuid"

const meta: Meta<typeof Conversations> = {
  title: "ai_assistant_chat",
  component: Conversations,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof Conversations>

export const Empty: Story = {
  args: {
    messages: [],
    is_loading: false,
  },
}

export const WithConversation: Story = {
  args: {
    messages: [
      {
        id: v4(),
        role: "user",
        content: [
          {
            id: v4(),
            type: "text",
            text: "Comment je peux améliorer mon deck ?",
          },
        ],
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content: [
          {
            id: v4(),
            type: "text",
            text: `Vous pouvez utiliser l'**assistant IA** et lui dire quoi faire :
            - Il peut **créer des leçons**
            - **Ajouter des cartes**
            - Corriger les **fautes d'orthographes**`,
          },
        ],
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "user",
        content: [
          { id: v4(), type: "text", text: "Créer une leçon sur l'automobile" },
        ],
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content: [
          {
            id: v4(),
            type: "tool",
            tool_name: "request_lessons_context",
            tool_fetching: false,
            text: "",
          },
          {
            id: v4(),
            type: "tool",
            tool_name: "create_lessons",
            tool_fetching: false,
            text: "",
          },
          {
            id: v4(),
            type: "text",
            text: `Je viens de créer la leçon "Automobile", je vais maintenant ajouter des cartes à cette leçon.`,
          },
          {
            id: v4(),
            type: "tool",
            tool_name: "request_cards_context",
            tool_fetching: true,
            text: "",
          },
        ],
        timestamp: new Date(),
      },
    ],
    is_loading: false,
  },
}
