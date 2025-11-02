import type { Meta, StoryObj } from "@storybook/react"
import { GlobalModal } from "./global_modal"
import { AlertCircleIcon, InfoIcon, CheckCircle2Icon } from "lucide-react"

const meta: Meta<typeof GlobalModal> = {
  title: "global_modal",
  component: GlobalModal,
  parameters: {
    layout: "",
  },
  argTypes: {
    is_open: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    title: {
      control: "text",
      description: "Modal title",
    },
    description: {
      control: "text",
      description: "Modal description",
    },
    icon: {
      control: false,
      description: "Optional icon component from lucide-react",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    is_open: true,
    title: "Are you sure you want to delete this card?",
    description:
      "This action cannot be undone. Please review the following information carefully.",
    icon: AlertCircleIcon,
    on_close: () => {},
    actions: (
      <>
        <button className="btn btn-lg btn-primary">Confirm</button>
      </>
    ),
  },
}
