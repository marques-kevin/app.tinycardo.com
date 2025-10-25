import { Wrapper } from "./decks_update_title"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "decks/update/decks_update_title",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    title: "Topik 1 (1000 words)",
  },
}

export const TooLong: Story = {
  args: {
    title:
      "A very big title that is too long to be displayed, that should not be accepted",
  },
}
