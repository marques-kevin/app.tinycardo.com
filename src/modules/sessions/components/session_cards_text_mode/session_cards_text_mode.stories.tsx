import { Wrapper } from "./session_cards_text_mode"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "session_cards_text_mode",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

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
