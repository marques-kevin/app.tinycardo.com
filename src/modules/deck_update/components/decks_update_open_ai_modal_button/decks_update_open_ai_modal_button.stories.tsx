import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./decks_update_open_ai_modal_button"

const meta: Meta<typeof Wrapper> = {
  title: "decks_update_open_ai_modal_button",
  component: Wrapper,
  parameters: {
    layout: "",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

