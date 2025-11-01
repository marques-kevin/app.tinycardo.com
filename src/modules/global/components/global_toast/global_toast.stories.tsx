import type { Meta, StoryObj } from "@storybook/react"
import { GlobalToast } from "./global_toast"

const meta = {
  title: "global_toast",
  component: GlobalToast,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GlobalToast>

export default meta
type Story = StoryObj<typeof GlobalToast>

export const Default: Story = {
  args: {
    title: "deck_update_actions/toast/deck_updated",
    description: "deck_update_actions/toast/deck_updated/description",
  },
}

export const Success: Story = {
  args: {
    title: "deck_update_actions/toast/deck_updated",
    description: "deck_update_actions/toast/deck_updated/description",
    type: "success",
  },
}

export const Error: Story = {
  args: {
    title: "deck_update_actions/toast/deck_updated",
    description: "deck_update_actions/toast/deck_updated/description",
    type: "error",
  },
}

export const Warning: Story = {
  args: {
    title: "deck_update_actions/toast/deck_updated",
    description: "deck_update_actions/toast/deck_updated/description",
    type: "warning",
  },
}

export const Info: Story = {
  args: {
    title: "deck_update_actions/toast/deck_updated",
    description: "deck_update_actions/toast/deck_updated/description",
    type: "info",
  },
}
