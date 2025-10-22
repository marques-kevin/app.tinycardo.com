import { MyDecks } from "@/modules/decks/components/my_decks/my_decks"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof MyDecks> = {
  title: "decks/my decks",
  component: MyDecks,
}

export default meta
type Story = StoryObj<typeof MyDecks>

export const Default: Story = {
  args: {},
}
