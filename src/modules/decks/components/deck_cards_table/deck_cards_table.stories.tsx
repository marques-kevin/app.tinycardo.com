import type { Meta, StoryObj } from "@storybook/react"

import { Wrapper as DeckCardsTable } from "@/modules/decks/components/deck_cards_table/deck_cards_table"

const meta: Meta<typeof DeckCardsTable> = {
  title: "Decks/DeckCardsTable",
  component: DeckCardsTable,
}

export default meta
type Story = StoryObj<typeof DeckCardsTable>

export const Default: Story = {
  args: {
    cards: [
      { id: "1", front: "안녕하세요", back: "Hello", deck_id: "local" },
      { id: "2", front: "감사합니다", back: "Thank you", deck_id: "local" },
      { id: "3", front: "사랑", back: "Love", deck_id: "local" },
    ],
    is_fetching: false,
  },
}

export const Loading: Story = {
  args: {
    cards: [],
    is_fetching: true,
  },
}

export const Empty: Story = {
  args: {
    cards: [],
    is_fetching: false,
  },
}
