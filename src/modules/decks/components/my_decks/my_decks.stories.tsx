import { Wrapper } from "@/modules/decks/components/my_decks/my_decks"
import type { Meta, StoryObj } from "@storybook/react"
import { seed_decks } from "@/redux/__seed__/seed_decks"

const meta: Meta<typeof Wrapper> = {
  title: "decks/my decks",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    decks: seed_decks,
    stats: seed_decks.reduce(
      (acc, deck) => {
        acc[deck.id] = {
          deck_id: deck.id,
          number_of_cards: deck.number_of_cards,
          number_of_cards_ready_to_be_reviewed: Math.floor(Math.random() * 100),
          number_of_cards_not_ready_to_be_reviewed: Math.floor(
            Math.random() * 100,
          ),
        }
        return acc
      },
      {} as Record<
        string,
        {
          deck_id: string
          number_of_cards: number
          number_of_cards_ready_to_be_reviewed: number
          number_of_cards_not_ready_to_be_reviewed: number
        }
      >,
    ),
  },
}
