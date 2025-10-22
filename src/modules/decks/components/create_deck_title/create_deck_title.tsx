import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_title/create_deck_title.container"
import { cn } from "@/lib/utils"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        {formatMessage({ id: "create_deck_title/title/fieldset_legend" })}
      </legend>
      <input
        className={cn(
          "input w-full",
          props.title.length > 50 && "text-error input-error",
        )}
        value={props.title}
        onChange={(e) => props.on_change(e.target.value)}
      />

      <div className={cn("label", props.title.length > 50 && "text-error")}>
        {props.title.length <= 50 && <span>{props.title.length}/50</span>}

        {props.title.length > 50 && (
          <span>
            {formatMessage(
              { id: "create_deck_title/length_error" },
              { length: props.title.length },
            )}
          </span>
        )}
      </div>
    </fieldset>
  )
}

export const CreateDeckTitle = connector(Wrapper)
