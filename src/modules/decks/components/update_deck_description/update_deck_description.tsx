import {
  connector,
  type ContainerProps,
} from "./update_deck_description.container"
import { cn } from "@/lib/utils"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <fieldset className="fieldset">
      <textarea
        rows={4}
        className={cn(
          "textarea textarea-lg w-full resize-none",
          props.description.length > 250 && "text-error input-error",
        )}
        placeholder={formatMessage({
          id: "update_deck_description/description/placeholder",
        })}
        value={props.description}
        onChange={(e) => props.on_change(e.target.value)}
      />

      <div
        className={cn(
          "label flex justify-end text-right",
          props.description.length > 250 && "text-error",
        )}
      >
        {props.description.length > 250 && (
          <span>
            {formatMessage(
              { id: "create_deck_title/length_error" },
              { length: props.description.length },
            )}
          </span>
        )}
      </div>
    </fieldset>
  )
}

export const UpdateDeckDescription = connector(Wrapper)
