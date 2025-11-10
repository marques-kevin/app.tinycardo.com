import type { Meta, StoryObj } from "@storybook/react"

import { Wrapper as SessionProgressBar } from "@/modules/sessions/components/session_progress_bar/session_progress_bar"

const meta: Meta<typeof SessionProgressBar> = {
  title: "session_progress_bar",
  component: SessionProgressBar,
}

export default meta
type Story = StoryObj<typeof SessionProgressBar>

export const Default: Story = {
  args: {
    current_index: 4,
    total_words: 10,
  },
}
