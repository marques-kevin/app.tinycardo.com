import { GlobalLogo } from "./global_logo"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof GlobalLogo> = {
  title: "global_logo",
  component: GlobalLogo,
}

export default meta
type Story = StoryObj<typeof GlobalLogo>

export const Default: Story = {}
