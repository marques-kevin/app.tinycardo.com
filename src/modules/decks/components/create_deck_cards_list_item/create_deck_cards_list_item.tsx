import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_cards_list_item/create_deck_cards_list_item.container"
import { TrashIcon } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="flex w-full gap-2">
      <input
        className="input w-1/2"
        value={props.front}
        onChange={(e) => props.on_update("front", e.target.value)}
      />

      <input
        className="input w-1/2"
        value={props.back}
        onChange={(e) => props.on_update("back", e.target.value)}
      />

      <div
        className="btn btn-error btn-ghost flex-shrink-0"
        onClick={() => props.on_remove()}
      >
        <TrashIcon className="size-4" />
      </div>
    </div>
  )
}

export const CreateDeckCardsListItem = connector(Wrapper)
