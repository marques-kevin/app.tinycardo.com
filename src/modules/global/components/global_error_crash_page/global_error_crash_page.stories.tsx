import type { Meta, StoryObj } from "@storybook/react"
import { GlobalErrorCrashPage } from "./global_error_crash_page"

const meta: Meta<typeof GlobalErrorCrashPage> = {
  title: "global_error_crash_page",
  component: GlobalErrorCrashPage,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    error: {
      control: false,
      description: "Optional error object to display",
    },
    resetError: {
      control: false,
      description: "Optional function to reset the error boundary",
      action: "resetError",
    },
  },
}

export default meta
type Story = StoryObj<typeof GlobalErrorCrashPage>

export const Default: Story = {
  args: {
    error: undefined,
    resetError: () => {},
  },
}

export const WithError: Story = {
  args: {
    error: new Error("Something went wrong while processing your request"),
    resetError: () => {},
  },
}

export const WithErrorAndStack: Story = {
  args: {
    error: (() => {
      const error = new Error("Uncaught ReferenceError: get_icon is not defined")
      error.stack = `get_icon is not defined
    at Wrapper (global_error_crash_page.tsx:10:20)
    at Object.react_stack_bottom_frame (react-dom_client.js:17424:20)
    at renderWithHooks (react-dom_client.js:4206:24)
    at updateFunctionComponent (react-dom_client.js:6619:21)
    at beginWork (react-dom_client.js:7654:20)
    at runWithFiberInDEV (react-dom_client.js:1485:72)
    at performUnitOfWork (react-dom_client.js:10868:98)
    at workLoopSync (react-dom_client.js:10728:43)
    at renderRootSync (react-dom_client.js:10711:13)
    at performWorkOnRoot (react-dom_client.js:10359:46)`
      return error
    })(),
    resetError: () => {},
  },
}

export const WithLongError: Story = {
  args: {
    error: (() => {
      const error = new Error(
        "This is a very long error message that demonstrates how the component handles longer error messages that might wrap or overflow. It should be displayed properly within the error container.",
      )
      error.stack = `Error: This is a very long error message that demonstrates how the component handles longer error messages that might wrap or overflow. It should be displayed properly within the error container.
    at GlobalErrorCrashPage (global_error_crash_page.tsx:10:20)
    at ErrorBoundary (sentry-react.tsx:45:12)
    at App (App.tsx:14:20)
    at LanguageIntlProvider (language_intl_provider.tsx:12:15)
    at RouterProvider (react-router.tsx:123:45)
    at Provider (react-redux.tsx:456:12)
    at StrictMode (react-dom.tsx:123:45)`
      return error
    })(),
    resetError: () => {},
  },
}

