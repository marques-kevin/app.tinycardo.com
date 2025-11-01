import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_details_lessons_list_item"

const meta: Meta<typeof Wrapper> = {
  title: "deck_details_lessons_list_item",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "Lesson 1",
    number_of_cards: 10,
    number_of_cards_ready_to_be_reviewed: 5,
    number_of_cards_not_ready_to_be_reviewed: 5,
  },
  render: (args) => (
    <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <Wrapper {...args} />
    </div>
  ),
}
