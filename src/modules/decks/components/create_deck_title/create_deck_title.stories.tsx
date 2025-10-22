import { Wrapper as CreateDeckTitle } from "@/modules/decks/components/create_deck_title/create_deck_title"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CreateDeckTitle> = {
  title: "decks/create deck/title",
  component: CreateDeckTitle,
}

export default meta
type Story = StoryObj<typeof CreateDeckTitle>

export const Default: Story = {
  args: {
    title: "Topik 1 (1000 words)",
  },
}

export const TooLong: Story = {
  args: {
    title:
      "A very big title that is too long to be displayed, that should not be accepted",
  },
}
