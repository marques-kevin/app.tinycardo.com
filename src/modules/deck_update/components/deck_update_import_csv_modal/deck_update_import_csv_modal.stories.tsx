import type { Meta, StoryObj } from "@storybook/react"

import { Wrapper } from "./deck_update_import_csv_modal"

const meta: Meta<typeof Wrapper> = {
  title: "deck_update_import_csv_modal",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Open: Story = {
  args: {
    headers: ["french", "korean", "actions"],
    is_open: true,
    rows: [],
    selected_back: 0,
    selected_front: 1,
  },
}

export const Close: Story = {
  args: {
    headers: ["french", "korean", "actions"],
    is_open: false,
    rows: [],
    selected_back: 0,
    selected_front: 1,
  },
}
