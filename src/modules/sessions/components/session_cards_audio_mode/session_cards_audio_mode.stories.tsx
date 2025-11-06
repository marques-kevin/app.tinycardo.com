import { Wrapper } from "./session_cards_audio_mode"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "session_cards_audio_mode",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    back: "Travail",
    front: "일",
    is_flipped: false,
    on_flip: () => alert("on_flip"),
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Wrapper {...args} />
    </div>
  ),
}

export const Flipped: Story = {
  args: {
    back: "Je travaille dans une grande entreprise internationale",
    front: "국제적인 대기업에서 일하다",
    is_flipped: true,
    on_flip: () => alert("on_flip"),
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Wrapper {...args} />
    </div>
  ),
}
