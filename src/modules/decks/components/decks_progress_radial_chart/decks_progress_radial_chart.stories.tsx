import type { Meta, StoryObj } from "@storybook/react"
import { DecksProgressRadialChart } from "./decks_progress_radial_chart"

const meta: Meta<typeof DecksProgressRadialChart> = {
  title: "decks/decks_progress_radial_chart",
  component: DecksProgressRadialChart,
}

export default meta
type Story = StoryObj<typeof DecksProgressRadialChart>

export const Default: Story = {
  args: {
    total: 100,
    mastered: 42,
  },
}

export const ZeroTotal: Story = {
  args: {
    total: 0,
    mastered: 0,
  },
}

export const NoneMastered: Story = {
  args: {
    total: 80,
    mastered: 0,
  },
}

export const FullMastered: Story = {
  args: {
    total: 80,
    mastered: 80,
  },
}

export const CustomSizeThin: Story = {
  args: {
    total: 100,
    mastered: 75,
    size: 80,
    thickness: 8,
  },
}

export const LargeThick: Story = {
  args: {
    total: 120,
    mastered: 90,
    size: 120,
    thickness: 16,
  },
}
