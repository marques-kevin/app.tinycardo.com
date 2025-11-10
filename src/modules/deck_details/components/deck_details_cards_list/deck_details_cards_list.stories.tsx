import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_details_cards_list"
import { seed_cards } from "@/redux/__seed__/seed_cards"

const meta: Meta<typeof Wrapper> = {
  title: "deck_details_cards_list",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cards: seed_cards,
    front_language: "fr",
    back_language: "ko",
  },
}
