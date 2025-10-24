import { Link } from "react-router-dom"
import { useIntl } from "react-intl"
import { connector, type ContainerProps } from "./deck_actions_dialog.container"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  const handle_close = () => {
    props.on_close()
  }

  return (
    <>
      <dialog className="modal" open={props.is_open} onClose={handle_close}>
        <div className="modal-box">
          <h3 className="mb-4 text-lg font-bold">{props.deck?.name}</h3>

          <div className="text-base-content/60 mb-4 text-sm">
            <div>
              {formatMessage(
                { id: "deck_actions_dialog/total_cards" },
                { count: props.deck?.number_of_cards },
              )}
            </div>
            <div>
              {formatMessage(
                { id: "deck_actions_dialog/ready_to_review" },
                { count: props.deck?.number_of_cards_ready_to_be_reviewed },
              )}
            </div>
            <div>
              {formatMessage(
                { id: "deck_actions_dialog/not_ready" },
                {
                  count: props.deck?.number_of_cards_not_ready_to_be_reviewed,
                },
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              className="btn btn-outline"
              onClick={() =>
                props.on_start_session({
                  deck_id: props.deck!.id,
                  mode: "review",
                })
              }
            >
              {formatMessage({ id: "deck_actions_dialog/review_cards" })}
            </button>

            <button
              className="btn btn-outline"
              onClick={() =>
                props.on_start_session({
                  deck_id: props.deck!.id,
                  mode: "learn_new_words",
                })
              }
            >
              {formatMessage({ id: "deck_actions_dialog/learn_new_cards" })}
            </button>

            <Link
              className="btn btn-outline"
              to={`/decks/${props.deck?.id}`}
              onClick={handle_close}
            >
              {formatMessage({ id: "deck_actions_dialog/view_deck_details" })}
            </Link>

            <Link
              className="btn btn-outline"
              to={`/decks/${props.deck?.id}/update`}
              onClick={handle_close}
            >
              {formatMessage({ id: "deck_actions_dialog/update_deck" })}
            </Link>

            <button
              className="btn btn-outline"
              onClick={() =>
                props.on_start_session({
                  deck_id: props.deck!.id,
                  mode: "randomized",
                })
              }
            >
              {formatMessage({ id: "deck_actions_dialog/random" })}
            </button>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={handle_close}>
              {formatMessage({ id: "deck_actions_dialog/cancel" })}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handle_close}>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export const DeckActionsDialog = connector(Wrapper)
