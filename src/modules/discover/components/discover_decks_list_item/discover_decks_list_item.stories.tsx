import { Wrapper } from "./discover_decks_list_item"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "discover/discover_decks_list_item",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    name: "Apprendre les bases du coréen",
    number_of_cards_in_the_deck: 144,
    number_of_users_using_this_deck: 456414,
  },
}
