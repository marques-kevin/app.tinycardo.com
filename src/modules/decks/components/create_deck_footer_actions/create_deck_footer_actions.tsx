import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions.container"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  return (
    <div className="flex items-center justify-end">
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
