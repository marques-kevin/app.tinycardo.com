import { Wrapper } from "./decks_update_visibility_select"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "decks_update_visibility_select",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    visibility: "public",
  },
}

export const TooLong: Story = {
  args: {
    visibility: "private",
  },
}
