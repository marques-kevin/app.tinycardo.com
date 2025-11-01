import { THEMES } from "../../constants/themes"
import { Wrapper } from "./params_select_theme"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Wrapper> = {
  title: "params_select_theme",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    themes: THEMES,
  },
}
