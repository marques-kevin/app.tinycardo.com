import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./discover_decks_action_dialog"

const meta: Meta<typeof Wrapper> = {
  title: "discover/discover_decks_action_dialog",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    is_open: true,
    id: "deck_1",
    name: "Apprendre les bases du coréen",
    number_of_cards_in_the_deck: 144,
    number_of_users_using_this_deck: 456414,
    front_language: "fr",
    back_language: "ko",
    on_close: () => {},
    on_show_deck: () => {},
    on_start_using_deck: () => {},
    created_at: new Date(),
    updated_at: new Date(),
  },
}
