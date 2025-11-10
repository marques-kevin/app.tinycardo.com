import { Wrapper } from "./decks_update_description"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "decks_update_description",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    description: "Topik 1 (1000 words)",
  },
}

export const TooLong: Story = {
  args: {
    description:
      "A very big title that is too long to be displayed, that should not be accepted",
  },
}
