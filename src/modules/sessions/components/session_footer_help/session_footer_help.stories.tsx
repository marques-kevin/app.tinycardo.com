import type { Meta, StoryObj } from "@storybook/react"

import { SessionFooterHelp } from "@/modules/sessions/components/session_footer_help/session_footer_help"

const meta: Meta<typeof SessionFooterHelp> = {
  title: "session_footer_help",
  component: SessionFooterHelp,
}

export default meta
type Story = StoryObj<typeof SessionFooterHelp>

export const Default: Story = {
  args: {},
}
