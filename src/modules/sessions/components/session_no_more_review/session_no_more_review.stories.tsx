import { Wrapper } from "./session_no_more_review"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "Sessions/session_no_more_review",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const ReviewedAndLearnAllCards: Story = {
  args: {
    state: "reviewed_and_learned_all_cards",
  },
}

export const LearnAllCards: Story = {
  args: {
    state: "learned_all_cards",
  },
}

export const ReviewedAllCards: Story = {
  args: {
    state: "reviewed_all_cards",
  },
}
