import type { Meta, StoryObj } from "@storybook/react"
import { SessionPage } from "@/modules/sessions/pages/session_page"
import { useEffect } from "react"
import { useAppDispatch } from "@/redux/store"
import * as actions from "@/modules/sessions/redux/sessions_actions"

const meta: Meta<typeof SessionPage> = {
  title: "session_page",
  component: SessionPage,
  parameters: {
    layout: "",
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render() {
    const dispatch = useAppDispatch()

    useEffect(() => {
      dispatch(actions._set_is_loading({ is_loading: true }))
    }, [])

    return <SessionPage />
  },
}
