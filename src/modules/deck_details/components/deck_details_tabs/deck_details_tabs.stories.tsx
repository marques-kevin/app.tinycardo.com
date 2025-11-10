import type { Meta, StoryObj } from "@storybook/react"
import { DeckDetailsTabs } from "./deck_details_tabs"

const meta: Meta<typeof DeckDetailsTabs> = {
  title: "deck_details_tabs",
  component: DeckDetailsTabs,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (tab) => <div>{tab}</div>,
  },
}
