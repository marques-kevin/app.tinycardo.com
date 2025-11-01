import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./deck_details_lessons_list"

const meta: Meta<typeof Wrapper> = {
  title: "deck_details_lessons_list",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    lessons: [
      {
        id: "1",
        name: `Verbes`,
        total: 20,
        mastered: 2,
        review: 18,
      },
      {
        id: "2",
        name: `Adjectifs`,
        total: 20,
        mastered: 10,
        review: 10,
      },
      {
        id: "3",
        name: `Nombres`,
        total: 20,
        mastered: 0,
        review: 0,
      },
      {
        id: "3",
        name: `Présentations`,
        total: 20,
        mastered: 0,
        review: 0,
      },
    ],
  },
}
