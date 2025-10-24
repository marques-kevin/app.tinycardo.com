import { cn } from "@/lib/utils"
import {
  connector,
  type ContainerProps,
} from "./deck_details_cards_list.container"
import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import { useWindowVirtualizer } from "@tanstack/react-virtual"

export function Wrapper(props: ContainerProps) {
  const row_virtualizer = useWindowVirtualizer({
    count: props.cards.length,
    estimateSize: () => 40,
    overscan: 10,
  })
  const virtual_items = row_virtualizer.getVirtualItems()
  const total_size = row_virtualizer.getTotalSize()

  return (
    <div className="rounded-box border-base-content/10 bg-base-100 border">
      <div className="text-base-content divide-base-content/10 border-base-content/10 grid grid-cols-2 gap-2 divide-x border-b text-xl">
        <div className="p-4">{emoji_flags[props.front_language]}</div>
        <div className="p-4">{emoji_flags[props.back_language]}</div>
      </div>

      <div
        style={{
          height: `${total_size}px`,
          position: "relative",
          width: "100%",
        }}
        className="divide-base-content/10 border-base-content/10 divide-y border-b"
      >
        {virtual_items.map((virtual_item) => (
          <div
            key={virtual_item.key}
            data-index={virtual_item.index}
            ref={row_virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtual_item.start}px)`,
            }}
            className={cn(
              "divide-base-content/10 grid grid-cols-2 gap-2 divide-x text-lg",
              virtual_item.index % 2 === 0 ? "bg-base-100" : "bg-base-200",
            )}
          >
            <div className="p-4">{props.cards[virtual_item.index].front}</div>
            <div className="p-4">{props.cards[virtual_item.index].back}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const DeckDetailsCardsList = connector(Wrapper)
