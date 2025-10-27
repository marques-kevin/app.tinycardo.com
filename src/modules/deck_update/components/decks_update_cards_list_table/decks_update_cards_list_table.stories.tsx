import { Wrapper } from "@/modules/deck_update/components/decks_update_cards_list_table/decks_update_cards_list_table"
import { seed_cards } from "@/redux/__seed__/seed_cards"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "decks/update/decks_update_cards_list_table",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    cards: seed_cards.map((card) => card.id),
    front_language: "en",
    back_language: "ko",
  },
}
