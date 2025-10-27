import { PlayIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./discover_decks_action_dialog.container"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <dialog className="modal" open={props.is_open} onClose={props.on_close}>
      <div className="modal-box">
        <h3 id="dialog-title" className="text-lg font-bold">
          {props.name}
        </h3>

        <div className="mt-8 flex flex-col gap-2">
          <button
            className="btn"
            onClick={() => props.on_show_deck(props?.deck_id ?? "")}
          >
            {formatMessage({ id: "discover_decks_action_dialog/show_deck" })}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => props.on_start_using_deck(props?.deck_id ?? "")}
          >
            <PlayIcon className="size-4" />
            <span>
              {formatMessage({
                id: "discover_decks_action_dialog/start_using_this_deck",
              })}
            </span>
          </button>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={props.on_close}>
            {formatMessage({ id: "discover_decks_action_dialog/close" })}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={props.on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const DiscoverDecksActionDialog = connector(Wrapper)
