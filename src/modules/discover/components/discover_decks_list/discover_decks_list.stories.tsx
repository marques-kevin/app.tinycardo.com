import { Wrapper } from "./discover_decks_list"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "discover_decks_list",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    decks: Array.from({ length: 10 }).map((_, index) => ({
      id: index.toString(),
      back_language: "en",
      front_language: "fr",
      created_at: new Date(),
      updated_at: new Date(),
      name: "Apprendre le coréen",
      number_of_cards_in_the_deck: 342,
      number_of_users_using_this_deck: 456983,
    })),
  },
}
