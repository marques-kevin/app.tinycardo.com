import { useAppDispatch, useAppSelector } from "@/redux/store"
import { go_on_session_page } from "@/modules/sessions/redux/sessions_actions"
import { _close_deck_actions_dialog } from "@/modules/decks/redux/decks_actions"
import { Link } from "react-router-dom"
import { useIntl } from "react-intl"

export function DeckActionsDialog() {
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()
  const { open: isOpen, deck } = useAppSelector(
    (state) => state.decks.deck_actions_dialog,
  )

  const handleAction = (action: () => void) => {
    action()
    dispatch(_close_deck_actions_dialog())
  }

  const handleClose = () => {
    dispatch(_close_deck_actions_dialog())
  }

  if (!deck) return null

  return (
    <>
      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">{deck.name}</h3>

            <div className="text-base-content/60 mb-4 text-sm">
              <div>
                {formatMessage(
                  { id: "deck_actions_dialog/total_cards" },
                  { count: deck.number_of_cards },
                )}
              </div>
              <div>
                {formatMessage(
                  { id: "deck_actions_dialog/ready_to_review" },
                  { count: deck.number_of_cards_ready_to_be_reviewed },
                )}
              </div>
              <div>
                {formatMessage(
                  { id: "deck_actions_dialog/not_ready" },
                  { count: deck.number_of_cards_not_ready_to_be_reviewed },
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                className="btn btn-outline"
                onClick={() =>
                  handleAction(() => {
                    dispatch(
                      go_on_session_page({ deck_id: deck.id, mode: "review" }),
                    )
                  })
                }
              >
                {formatMessage({ id: "deck_actions_dialog/review_cards" })}
              </button>

              <button
                className="btn btn-outline"
                onClick={() =>
                  handleAction(() => {
                    dispatch(
                      go_on_session_page({
                        deck_id: deck.id,
                        mode: "learn_new_words",
                      }),
                    )
                  })
                }
              >
                {formatMessage({ id: "deck_actions_dialog/learn_new_cards" })}
              </button>

              <Link
                className="btn btn-outline"
                to={`/decks/${deck.id}/details`}
                onClick={handleClose}
              >
                {formatMessage({ id: "deck_actions_dialog/view_deck_details" })}
              </Link>

              <Link
                className="btn btn-outline"
                to={`/decks/${deck.id}/update`}
                onClick={handleClose}
              >
                {formatMessage({ id: "deck_actions_dialog/update_deck" })}
              </Link>

              <button
                className="btn btn-outline"
                onClick={() =>
                  handleAction(() => {
                    dispatch(
                      go_on_session_page({
                        deck_id: deck.id,
                        mode: "randomized",
                      }),
                    )
                  })
                }
              >
                {formatMessage({ id: "deck_actions_dialog/random" })}
              </button>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={handleClose}>
                {formatMessage({ id: "deck_actions_dialog/cancel" })}
              </button>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={handleClose}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </>
  )
}
