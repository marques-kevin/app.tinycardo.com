import { useState } from "react"
import { useIntl } from "react-intl"
import { cn } from "@/lib/utils"

export function DeckDetailsTabs(props: {
  children: (tab: "lessons" | "cards") => React.ReactNode
}) {
  const { formatMessage } = useIntl()
  const [active_tab, set_active_tab] = useState<"lessons" | "cards">("cards")

  return (
    <div role="tablist" className="tabs tabs-lg tabs-lift w-full">
      <a
        role="tab"
        className={cn("tab", active_tab === "cards" && "tab-active")}
        onClick={() => set_active_tab("cards")}
      >
        {formatMessage({ id: "deck_details_tabs/cards" })}
      </a>
      <div className="tab-content bg-base-100 border-base-300">
        {active_tab === "cards" && props.children("cards")}
      </div>

      <a
        role="tab"
        className={cn("tab", active_tab === "lessons" && "tab-active")}
        onClick={() => set_active_tab("lessons")}
      >
        {formatMessage({ id: "deck_details_tabs/lessons" })}
      </a>

      <div className="tab-content bg-base-100 border-base-300">
        {active_tab === "lessons" && props.children("lessons")}
      </div>
    </div>
  )
}
