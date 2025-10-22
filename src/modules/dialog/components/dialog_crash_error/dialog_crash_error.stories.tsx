import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./dialog_crash_error"

const meta: Meta<typeof Wrapper> = {
  title: "Dialog/DialogCrashError",
  component: Wrapper,
  parameters: {
    layout: "",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    is_open: true,
    message: "Uncaught ReferenceError",
    stack: `get_icon is not defined
    at Wrapper (dialog_crash_error.tsx?t=1761064709401:8:20)
    at Object.react_stack_bottom_frame (react-dom_client.js?v=ff146dbe:17424:20)
    at renderWithHooks (react-dom_client.js?v=ff146dbe:4206:24)
    at updateFunctionComponent (react-dom_client.js?v=ff146dbe:6619:21)
    at beginWork (react-dom_client.js?v=ff146dbe:7654:20)
    at runWithFiberInDEV (react-dom_client.js?v=ff146dbe:1485:72)
    at performUnitOfWork (react-dom_client.js?v=ff146dbe:10868:98)
    at workLoopSync (react-dom_client.js?v=ff146dbe:10728:43)
    at renderRootSync (react-dom_client.js?v=ff146dbe:10711:13)
    at performWorkOnRoot (react-dom_client.js?v=ff146dbe:10359:46)`,
  },
}
