import {
  connector,
  type ContainerProps,
} from "./decks_update_description.container"
import { cn } from "@/lib/utils"
import { useIntl } from "react-intl"
import { Sparkles } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/lib/shadcn/tooltip"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <fieldset className="fieldset">
      <div className="relative">
        <textarea
          rows={4}
          className={cn(
            "textarea textarea-lg w-full resize-none pr-12",
            props.description.length > 1000 && "text-error input-error",
          )}
          placeholder={formatMessage({
            id: "decks_update_description/description/placeholder",
          })}
          value={props.description}
          onChange={(e) => props.on_change(e.target.value)}
          disabled={props.is_updating_description_with_ai}
        />
        {props.is_user_premium && (
          <div className="absolute top-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={props.on_update_description_with_ai}
                  disabled={props.is_updating_description_with_ai}
                >
                  {props.is_updating_description_with_ai ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {formatMessage({
                  id: "decks_update_description/update_with_ai",
                })}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <div
        className={cn(
          "label flex justify-end text-right",
          props.description.length > 1000 && "text-error",
        )}
      >
        {props.description.length > 1000 && (
          <span>
            {formatMessage(
              { id: "decks_update_description/length_error" },
              { length: props.description.length },
            )}
          </span>
        )}
      </div>
    </fieldset>
  )
}

export const DecksUpdateDescription = connector(Wrapper)
