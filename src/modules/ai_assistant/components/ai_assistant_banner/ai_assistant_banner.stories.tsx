import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./ai_assistant_banner"

const meta: Meta<typeof Wrapper> = {
  title: "ai_assistant_banner",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {},
}
