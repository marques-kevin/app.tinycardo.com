import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_update_add_cards_to_lesson_modal"

const meta: Meta<typeof Wrapper> = {
  title: "deck_update_add_cards_to_lesson_modal",
  component: Wrapper,
  parameters: {
    layout: "",
  },
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    is_open: true,
    number_of_selected_cards: 10,
    lessons: [
      {
        cards: [],
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
        id: "1",
        name: "Verbes",
        position: 1,
      },
      {
        cards: [],
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
        id: "2",
        name: "Adjectifs",
        position: 2,
      },
      {
        cards: [],
        created_at: new Date(),
        updated_at: new Date(),
        deck_id: "1",
        id: "3",
        name: "Nombres",
        position: 3,
      },
    ],
  },
}
