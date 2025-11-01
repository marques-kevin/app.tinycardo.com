import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper as SessionHelpDialog } from "@/modules/sessions/components/session_help_dialog/session_help_dialog"

const meta: Meta<typeof SessionHelpDialog> = {
  title: "session_help_dialog",
  component: SessionHelpDialog,
}

export default meta
type Story = StoryObj<typeof SessionHelpDialog>

export const Loading: Story = {
  args: {
    is_open: true,
    is_loading: true,
  },
}

export const WithContent: Story = {
  args: {
    is_loading: false,
    is_open: true,
    content: "hello",
  },
}
