import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./ai_assistant_chat"
import { v4 } from "uuid"

const meta: Meta<typeof Wrapper> = {
  title: "ai_assistant_chat",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof Wrapper>

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
        content: "Comment je peux améliorer mon deck ?",
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content: `Vous pouvez utiliser l'**assistant IA** et lui dire quoi faire :

- Il peut **créer des leçons**
- **Ajouter des cartes**
- Corriger les **fautes d'orthographes**

Voici un exemple de conversation :

- **User** : Comment je peux améliorer mon deck ?
- **Assistant** : Vous pouvez utiliser l'**assistant IA** et lui dire quoi faire :
  - Il peut **créer des leçons**
  - **Ajouter des cartes**
  - Corriger les **fautes d'orthographes**
`,
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "user",
        content: "Peux-tu ajouter 5 cartes sur les animaux ?",
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content:
          "Bien sûr ! J'ai créé 5 nouvelles cartes sur les animaux pour vous.",
        timestamp: new Date(),
        actions: [
          {
            type: "add_cards",
            payload: {
              cards: [
                { front: "chien", back: "dog" },
                { front: "chat", back: "cat" },
                { front: "oiseau", back: "bird" },
                { front: "poisson", back: "fish" },
                { front: "lapin", back: "rabbit" },
              ],
            },
            description: "Ajouter 5 cartes sur les animaux",
          },
        ],
      },
      {
        id: v4(),
        role: "user",
        content: "Peux-tu corriger les fautes d'orthographe dans mes cartes ?",
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content:
          "J'ai trouvé et corrigé 3 fautes d'orthographe dans vos cartes.",
        timestamp: new Date(),
        actions: [
          {
            type: "update_card",
            payload: {
              card_id: "card-123",
              field: "front",
              value: "Bonjour",
            },
            description: "J'ai corrigé l'orthographe de 3 cartes.",
          },
        ],
      },
      {
        id: v4(),
        role: "user",
        content:
          "Crée une leçon 'Vocabulaire de base' avec les 10 premières cartes",
        timestamp: new Date(),
      },
      {
        id: v4(),
        role: "assistant",
        content:
          "J'ai créé la leçon 'Vocabulaire de base' et y ai ajouté les 10 premières cartes.",
        timestamp: new Date(),
        actions: [
          {
            type: "create_lesson",
            payload: {
              name: "Vocabulaire de base",
            },
            description: "J'ai créé la leçon 'Vocabulaire de base'.",
          },
          {
            type: "add_cards_to_lesson",
            payload: {
              lesson_id: "lesson-new-id",
              card_ids: [
                "card-1",
                "card-2",
                "card-3",
                "card-4",
                "card-5",
                "card-6",
                "card-7",
                "card-8",
                "card-9",
                "card-10",
              ],
            },
            description: "Ajouter les 10 premières cartes à la leçon",
          },
        ],
      },
    ],
    is_loading: false,
  },
}

export const Loading: Story = {
  args: {
    messages: [
      {
        id: v4(),
        role: "user",
        content: "Peux-tu générer une description pour mon deck ?",
        timestamp: new Date(),
      },
    ],
    is_loading: true,
  },
}
