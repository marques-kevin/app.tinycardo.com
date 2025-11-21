import {
  connector,
  type ContainerProps,
} from "./decks_update_open_ai_modal_button.container"
import { useIntl } from "react-intl"
import { Sparkles } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/lib/shadcn/tooltip"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          onClick={props.on_open_ai_modal}
          className="btn btn-ghost gap-2 uppercase"
        >
          <Sparkles className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {formatMessage({ id: "decks_update_open_ai_modal_button/label" })}
      </TooltipContent>
    </Tooltip>
  )
}

export const DecksUpdateOpenAiModalButton = connector(Wrapper)
