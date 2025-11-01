import type { Meta, StoryObj } from "@storybook/react"

import { Wrapper } from "./decks_csv_mapping_dialog"

const meta: Meta<typeof Wrapper> = {
  title: "decks_csv_mapping_dialog",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Open: Story = {
  args: {
    headers: ["french", "korean", "actions"],
    open: true,
    rows: [],
    selected_back: 0,
    selected_front: 1,
  },
}

export const Close: Story = {
  args: {
    headers: ["french", "korean", "actions"],
    open: false,
    rows: [],
    selected_back: 0,
    selected_front: 1,
  },
}
