import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./discover_decks_action_dialog"

const meta: Meta<typeof Wrapper> = {
  title: "discover_decks_action_dialog",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    is_open: true,
    name: "Apprendre les bases du coréen",
    on_close: () => {},
    on_show_deck: () => {},
    on_start_using_deck: () => {},
  },
}
