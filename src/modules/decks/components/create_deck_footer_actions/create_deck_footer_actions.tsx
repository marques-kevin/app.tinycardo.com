import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions.container"
import { useIntl } from "react-intl"
import { ArrowLeftIcon } from "lucide-react"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className="btn btn-ghost btn-lg"
        onClick={props.on_back}
      >
        <ArrowLeftIcon className="size-5" />
        {formatMessage({ id: "create_deck_footer_actions/back" })}
      </button>
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={props.on_save}
      >
        {formatMessage({ id: "create_deck_footer_actions/save" })}
      </button>
    </div>
  )
}

export const CreateDeckFooterActions = connector(Wrapper)
