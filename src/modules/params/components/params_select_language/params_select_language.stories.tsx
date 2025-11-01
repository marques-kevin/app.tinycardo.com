import { Wrapper } from "./params_select_language"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "params_select_language",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {},
}
