import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./discover_decks_search_modal"

const meta: Meta<typeof Wrapper> = {
  title: "discover_decks_search_modal",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {
  args: {
    title_query: "",
    on_submit: () => {},
  },
}


