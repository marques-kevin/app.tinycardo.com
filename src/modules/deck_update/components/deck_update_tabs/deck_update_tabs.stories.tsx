import type { Meta, StoryObj } from "@storybook/react"
import { DeckUpdateTabs } from "./deck_update_tabs"

const meta: Meta<typeof DeckUpdateTabs> = {
  title: "deck_update_tabs",
  component: DeckUpdateTabs,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
