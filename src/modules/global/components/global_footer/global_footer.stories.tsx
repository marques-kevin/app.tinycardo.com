import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./global_footer"
import { THEMES } from "@/modules/params/constants/themes"

const meta: Meta<typeof Wrapper> = {
  title: "Global/global_footer",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    themes: THEMES,
  },
}
