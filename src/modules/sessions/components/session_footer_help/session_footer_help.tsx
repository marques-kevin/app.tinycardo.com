import { useIsMobile } from "@/lib/is_mobile"

function KeyboardShortcut(props: { shortcut: string }) {
  return <span className="kbd kbd-lg px-4">{props.shortcut}</span>
}

export function SessionFooterHelp() {
  const is_mobile = useIsMobile()

  if (is_mobile) return null

  return (
    <p className="text-base-content/50 text-lg">
      Press <KeyboardShortcut shortcut="space" /> or click the card to flip the
      card. Press <KeyboardShortcut shortcut="→" /> if you know the word. Press{" "}
      <KeyboardShortcut shortcut="←" /> if you don't know the word.
    </p>
  )
}
