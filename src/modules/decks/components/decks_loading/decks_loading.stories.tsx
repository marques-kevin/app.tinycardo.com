import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./decks_loading"

const meta: Meta<typeof Wrapper> = {
  title: "decks_loading",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    is_fetching: true,
    children: (
      <div className="border-base-300 rounded border p-6">
        This content is hidden while loading
      </div>
    ),
  },
}

export const Loaded: Story = {
  args: {
    is_fetching: false,
    children: (
      <div className="border-base-300 rounded border p-6">
        This content shows when not loading
      </div>
    ),
  },
}
