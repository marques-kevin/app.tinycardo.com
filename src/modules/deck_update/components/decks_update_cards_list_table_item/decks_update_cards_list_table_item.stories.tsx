import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "./decks_update_cards_list_table_item"

const meta: Meta<typeof Wrapper> = {
  title: "decks_update_cards_list_table_item",
  component: Wrapper,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    front: "Front",
    back: "Back",
    card_id: "1",
    is_selected: false,
    is_translating: false,
    on_update: () => {},
    on_toggle_select: () => {},
    on_translate_card: () => {},
  },
}

export const Translating: Story = {
  args: {
    front: "Front",
    back: "Back",
    card_id: "1",
    is_selected: false,
    is_translating: true,
    on_update: () => {},
    on_toggle_select: () => {},
    on_translate_card: () => {},
  },
}

export const Selected: Story = {
  args: {
    front: "Front",
    back: "Back",
    card_id: "1",
    is_selected: true,
    is_translating: false,
    on_update: () => {},
    on_toggle_select: () => {},
    on_translate_card: () => {},
  },
}
