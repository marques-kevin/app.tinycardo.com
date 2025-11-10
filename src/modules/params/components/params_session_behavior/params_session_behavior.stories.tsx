import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./params_session_behavior"

const meta: Meta<typeof Wrapper> = {
  title: "params_session_behavior",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {}
