import { useState, useEffect } from "react"
import { useIntl } from "react-intl"
import {
  connector,
  type ContainerProps,
} from "./deck_update_tabs_rename_modal.container"

function Wrapper(props: ContainerProps) {
  const [rename_value, set_rename_value] = useState<string>("")
  const { formatMessage } = useIntl()

  const handle_rename_save = () => {
    if (props.lesson_id && rename_value.trim()) {
      props.on_rename_lesson(props.lesson_id, rename_value.trim())
    }
  }

  const handle_rename_cancel = () => {
    props.on_close_modal()
  }

  useEffect(() => {
    if (props.is_open) {
      set_rename_value(props.name)
    }
  }, [props.is_open])

  return (
    <dialog
      className="modal"
      open={props.is_open}
      onClose={handle_rename_cancel}
    >
      <div className="modal-box">
        <h3 id="dialog-title" className="text-lg font-bold">
          {formatMessage({ id: "deck_update_tabs_rename_modal/title" })}
        </h3>

        <div className="mt-4">
          <fieldset className="fieldset">
            <input
              className="input input-lg w-full"
              placeholder={formatMessage({
                id: "deck_update_tabs_rename_modal/placeholder",
              })}
              value={rename_value}
              onChange={(e) => set_rename_value(e.target.value)}
              autoFocus
            />
          </fieldset>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={handle_rename_cancel}>
            {formatMessage({ id: "deck_update_tabs_rename_modal/cancel" })}
          </button>
          <button
            className="btn btn-primary"
            onClick={handle_rename_save}
            disabled={!rename_value.trim()}
          >
            {formatMessage({ id: "deck_update_tabs_rename_modal/save" })}
          </button>
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop"
        onClick={handle_rename_cancel}
      >
        <button>close</button>
      </form>
    </dialog>
  )
}

export const DeckUpdateTabsRenameModal = connector(Wrapper)
