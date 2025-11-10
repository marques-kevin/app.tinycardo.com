import { useState, useEffect, useRef } from "react"
import { useIntl } from "react-intl"
import {
  connector,
  type ContainerProps,
} from "./deck_update_tabs_rename_modal.container"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"
import { PencilIcon } from "lucide-react"

function Wrapper(props: ContainerProps) {
  const [rename_value, set_rename_value] = useState<string>("")
  const { formatMessage } = useIntl()
  const input_ref = useRef<HTMLInputElement>(null)

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
    <GlobalModal
      title={formatMessage({ id: "deck_update_tabs_rename_modal/title" })}
      description={formatMessage({
        id: "deck_update_tabs_rename_modal/description",
      })}
      icon={PencilIcon}
      is_open={props.is_open}
      on_close={handle_rename_cancel}
      actions={
        <>
          <button
            className="btn btn-lg btn-primary"
            onClick={handle_rename_save}
          >
            {formatMessage({ id: "deck_update_tabs_rename_modal/save" })}
          </button>
        </>
      }
    >
      <fieldset className="fieldset">
        <input
          ref={input_ref}
          className="input input-lg w-full"
          placeholder={formatMessage({
            id: "deck_update_tabs_rename_modal/placeholder",
          })}
          value={rename_value}
          onChange={(e) => set_rename_value(e.target.value)}
          autoFocus
        />
      </fieldset>
    </GlobalModal>
  )
}

export const DeckUpdateTabsRenameModal = connector(Wrapper)
