import type { Meta, StoryObj } from "@storybook/react"

import { Wrapper } from "@/modules/sessions/components/session_reviewed_words_table/session_reviewed_words_table"
import type { SessionHistoryWithCardEntity } from "@/modules/sessions/entities/session_history_entity"

const meta: Meta<typeof Wrapper> = {
  title: "Sessions/session_reviewed_words_table",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

const now = new Date()

const make_word = (
  overrides: Partial<SessionHistoryWithCardEntity>,
): SessionHistoryWithCardEntity => ({
  deck_id: overrides.deck_id ?? "local",
  card_id: overrides.card_id ?? Math.random().toString(36).slice(2),
  repetition_count: overrides.repetition_count ?? 3,
  ease_factor: overrides.ease_factor ?? 2.5,
  next_due_at:
    overrides.next_due_at ?? new Date(now.getTime() + 1000 * 60 * 60 * 24),
  last_reviewed_at: overrides.last_reviewed_at ?? now,
  front: overrides.front ?? "안녕하세요",
  back: overrides.back ?? "Hello",
})

export const Populated: Story = {
  args: {
    known_words: [
      make_word({
        card_id: "k1",
        front: "감사합니다",
        back: "Thank you",
        repetition_count: 4,
      }),
      make_word({
        card_id: "k2",
        front: "사랑",
        back: "Love",
        repetition_count: 6,
      }),
    ],
    unknown_words: [
      make_word({
        card_id: "u1",
        front: "학교",
        back: "School",
        repetition_count: 1,
      }),
      make_word({
        card_id: "u2",
        front: "친구",
        back: "Friend",
        repetition_count: 0,
      }),
    ],
  },
}

export const Empty: Story = {
  args: {
    known_words: [],
    unknown_words: [],
  },
}
