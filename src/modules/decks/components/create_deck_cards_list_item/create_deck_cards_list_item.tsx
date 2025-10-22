import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_cards_list_item/create_deck_cards_list_item.container"
import { TrashIcon } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  return (
    <tr>
      <td>
        <input
          className="input w-full"
          value={props.front}
          onChange={(e) => props.on_update("front", e.target.value)}
        />
      </td>
      <td>
        <input
          className="input w-full"
          value={props.back}
          onChange={(e) => props.on_update("back", e.target.value)}
        />
      </td>
      <td className="">
        <div
          className="btn btn-error btn-ghost"
          onClick={() => props.on_remove()}
        >
          <TrashIcon className="size-4" />
        </div>
      </td>
    </tr>
  )
}

export const CreateDeckCardsListItem = connector(Wrapper)
