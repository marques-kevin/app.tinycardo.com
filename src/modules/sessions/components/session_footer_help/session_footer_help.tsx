import { useIsMobile } from "@/lib/is_mobile"
import { useIntl } from "react-intl"

function KeyboardShortcut(props: { shortcut: string }) {
  return <span className="kbd kbd-lg mx-1 px-4">{props.shortcut}</span>
}

export function SessionFooterHelp() {
  const is_mobile = useIsMobile()
  const { formatMessage } = useIntl()

  if (is_mobile) return null

  return (
    <p className="text-base-content/50 text-lg">
      {formatMessage(
        { id: "session_footer_help/message" },
        {
          space: <KeyboardShortcut shortcut="space" />,
          right: <KeyboardShortcut shortcut="→" />,
          left: <KeyboardShortcut shortcut="←" />,
        },
      )}
    </p>
  )
}
