import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_details_header"

const meta: Meta<typeof Wrapper> = {
  title: "deck_details_header",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "Apprendre les bases du coréen",
    number_of_cards: 320,
    updated_at: new Date(),
  },
}
