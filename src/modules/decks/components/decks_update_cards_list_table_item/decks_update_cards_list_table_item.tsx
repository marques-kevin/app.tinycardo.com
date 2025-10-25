import { cn } from "@/lib/utils"
import {
  connector,
  type ContainerProps,
} from "./decks_update_cards_list_table_item.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div
      className={cn("flex w-full items-center gap-2 py-1")}
      id={`card-${props.card_id}`}
    >
      <input
        type="checkbox"
        className="radio flex-shrink-0 select-none"
        checked={props.is_selected}
        onChange={() => props.on_toggle_select()}
        tabIndex={-1}
      />

      <input
        className="input input-lg w-1/2"
        value={props.front}
        onChange={(e) => props.on_update("front", e.target.value)}
        autoFocus={props.autofocus}
      />

      <input
        className="input input-lg w-1/2"
        value={props.back}
        onChange={(e) => props.on_update("back", e.target.value)}
      />
    </div>
  )
}

export const DecksUpdateCardsListTableItem = connector(Wrapper)
