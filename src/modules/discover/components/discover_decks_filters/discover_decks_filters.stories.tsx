import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./discover_decks_filters"

const meta: Meta<typeof Wrapper> = {
  title: "discover_decks_filters",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    spoken_language: "en",
    learning_language: "fr",
    on_change_filters: () => {},
  },
}


