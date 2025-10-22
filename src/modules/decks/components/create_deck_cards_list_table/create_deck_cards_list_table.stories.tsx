import { Wrapper as CreateDeckCardsListTable } from "@/modules/decks/components/create_deck_cards_list_table/create_deck_cards_list_table"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof CreateDeckCardsListTable> = {
  title: "decks/create deck/cards list table",
  component: CreateDeckCardsListTable,
}

export default meta
type Story = StoryObj<typeof CreateDeckCardsListTable>

export const Default: Story = {
  args: {
    cards: [
      { id: "1", front: "안녕하세요", back: "Hello", deck_id: "local" },
      { id: "2", front: "감사합니다", back: "Thank you", deck_id: "local" },
      { id: "3", front: "사랑", back: "Love", deck_id: "local" },
      { id: "4", front: "좋아", back: "Like", deck_id: "local" },
      {
        id: "6",
        front: "조심히 가세요",
        back: "Please take care on your way home",
        deck_id: "local",
      },
      {
        id: "7",
        front: "행복한 하루 보내세요",
        back: "Have a happy and wonderful day",
        deck_id: "local",
      },
      {
        id: "9",
        front: "친구랑 영화 보러 갈래?",
        back: "Would you like to go watch a movie with friends?",
        deck_id: "local",
      },
      {
        id: "10",
        front: "한국 음식을 정말 좋아해요",
        back: "I really love Korean food",
        deck_id: "local",
      },
    ],
  },
}
