import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_details_lessons_list"

const meta: Meta<typeof Wrapper> = {
  title: "deck_details_lessons_list",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    lessons: [
      {
        id: "1",
        name: `Verbes`,
        cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        position: 1,
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
      },
      {
        id: "2",
        name: `Adjectifs`,
        cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        position: 2,
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
      },
      {
        id: "3",
        name: `Nombres`,
        cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        position: 3,
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
      },
      {
        id: "3",
        name: `Présentations`,
        cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        position: 4,
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
      },
    ],
  },
}
