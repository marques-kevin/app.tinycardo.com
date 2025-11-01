import type { Meta, StoryObj } from "@storybook/react"
import { Wrapper } from "@/modules/dialog/components/dialog/dialog"
import type { MessageI18nKeys } from "@/intl"

const title_options: MessageI18nKeys[] = [
  "decks_actions/dialog/create_deck/title",
]

const description_options: MessageI18nKeys[] = [
  "decks_actions/dialog/create_deck/errors/dialog/description",
  "decks_actions/dialog/create_deck/errors/title_required",
  "decks_actions/dialog/create_deck/errors/title_too_long",
  "decks_actions/dialog/create_deck/errors/at_least_one_card",
  "decks_actions/dialog/create_deck/errors/front_back_required",
  "decks_actions/dialog/create_deck/errors/languages_cannot_match",
]

const meta: Meta<typeof Wrapper> = {
  title: "dialog",
  component: Wrapper,
  parameters: {
    layout: "",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["error", "success", "warning", "info"],
      description: "Dialog type",
    },
    title: {
      control: "select",
      options: title_options,
      description: "Dialog title translation key",
    },
    description: {
      control: "select",
      options: description_options,
      description: "Dialog description translation key",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    is_open: true,
    type: "error",
    title: "decks_actions/dialog/create_deck/title",
    description: "decks_actions/dialog/create_deck/errors/front_back_required",
    on_close: () => {},
  },
}
