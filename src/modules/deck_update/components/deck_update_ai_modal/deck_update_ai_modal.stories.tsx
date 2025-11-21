import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_update_ai_modal"

const meta: Meta<typeof Wrapper> = {
  title: "deck_update_ai_modal",
  component: Wrapper,
  parameters: {
    layout: "",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    is_open: true,
  },
}

export const Sending: Story = {
  args: {
    is_open: true,
    is_sending: true,
  },
}
