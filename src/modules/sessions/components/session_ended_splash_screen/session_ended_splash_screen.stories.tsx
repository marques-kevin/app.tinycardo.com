import { Wrapper } from "./session_ended_splash_screen"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "Sessions/session_ended_splash_screen",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Review: Story = {
  args: {
    mode: "review",
    deck_id: "1",
    known_words: [],
    unknown_words: [],
  },
}

export const LearnNewWords: Story = {
  args: {
    mode: "learn_new_words",
    deck_id: "1",
    known_words: [],
    unknown_words: [],
  },
}

export const Randomized: Story = {
  args: {
    mode: "randomized",
    deck_id: "1",
    known_words: [],
    unknown_words: [],
  },
}

export const Auto: Story = {
  args: {
    mode: "auto",
    deck_id: "1",
    known_words: [],
    unknown_words: [],
  },
}
