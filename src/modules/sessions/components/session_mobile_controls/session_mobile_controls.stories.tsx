import type { Meta, StoryObj } from "@storybook/react"

import { SessionMobileControls } from "@/modules/sessions/components/session_mobile_controls/session_mobile_controls"

const meta: Meta<typeof SessionMobileControls> = {
  title: "session_mobile_controls",
  component: SessionMobileControls,
}

export default meta
type Story = StoryObj<typeof SessionMobileControls>

export const Default: Story = {
  args: {},
}
