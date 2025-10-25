import { connector, type ContainerProps } from "./decks_update_title.container"
import { cn } from "@/lib/utils"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <fieldset className="fieldset">
      <input
        className={cn(
          "input input-lg w-full",
          props.title.length > 50 && "text-error input-error",
        )}
        placeholder={formatMessage({
          id: "decks_update_title/title/placeholder",
        })}
        value={props.title}
        onChange={(e) => props.on_change(e.target.value)}
      />

      {props.title.length > 50 && (
        <div className={cn("label text-error flex justify-end text-right")}>
          <span>
            {formatMessage(
              { id: "decks_update_title/length_error" },
              { length: props.title.length },
            )}
          </span>
        </div>
      )}
    </fieldset>
  )
}

export const DecksUpdateTitle = connector(Wrapper)
