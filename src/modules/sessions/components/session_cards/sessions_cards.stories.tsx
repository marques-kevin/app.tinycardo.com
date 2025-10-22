import { Wrapper as SessionsCards } from "@/modules/sessions/components/session_cards/sessions_cards"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof SessionsCards> = {
  title: "Sessions/SessionsCards",
  component: SessionsCards,
}

export default meta
type Story = StoryObj<typeof SessionsCards>

export const Default: Story = {
  args: {
    back: "Travail",
    front: "일",
    is_flipped: false,
    set_review_word: () => {},
    on_flip: () => alert("on_flip"),
  },
}

export const Flipped: Story = {
  args: {
    back: "Travail",
    front: "일",
    is_flipped: true,
    set_review_word: () => {},
    on_flip: () => alert("on_flip"),
  },
}
