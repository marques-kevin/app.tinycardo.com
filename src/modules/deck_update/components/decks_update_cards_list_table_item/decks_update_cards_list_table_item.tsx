import { cn } from "@/lib/utils"
import {
  connector,
  type ContainerProps,
} from "./decks_update_cards_list_table_item.container"
import { SparkleIcon } from "lucide-react"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

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
        disabled={props.is_translating}
      />

      <div className="relative w-1/2">
        <input
          className="input input-lg w-full"
          value={props.back}
          disabled={props.is_translating}
          onChange={(e) => props.on_update("back", e.target.value)}
        />
        {props.is_user_premium && (
          <div
            className="tooltip tooltip-left absolute top-2 right-2"
            data-tip={formatMessage({
              id: "decks_update_cards_list_table_item/tooltip/translate",
            })}
          >
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={props.on_translate_card}
              disabled={props.is_translating}
            >
              {props.is_translating ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <SparkleIcon className="size-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

Wrapper.displayName = "DecksUpdateCardsListTableItem"

export const DecksUpdateCardsListTableItem = connector(Wrapper)
