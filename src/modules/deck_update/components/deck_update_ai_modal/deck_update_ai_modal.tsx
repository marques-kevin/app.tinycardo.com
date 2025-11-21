import { useIntl } from "react-intl"
import { useState } from "react"
import { Sparkles } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./deck_update_ai_modal.container"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  const [message, set_message] = useState("")

  const handle_send = () => {
    if (message.trim() && !props.is_sending) {
      props.on_send(message.trim())
      // Don't clear message here - parent component will handle the state
    }
  }

  const handle_close = () => {
    if (!props.is_sending) {
      set_message("")
      props.on_close()
    }
  }

  return (
    <GlobalModal
      title={formatMessage({
        id: "deck_update_ai_modal/title",
      })}
      description={formatMessage({
        id: "deck_update_ai_modal/description",
      })}
      icon={Sparkles}
      is_open={props.is_open}
      on_close={handle_close}
      actions={
        <button
          className="btn btn-lg btn-primary gap-2"
          onClick={handle_send}
          disabled={!message.trim() || props.is_sending}
        >
          {props.is_sending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {formatMessage({
                id: "deck_update_ai_modal/sending",
              })}
            </>
          ) : (
            formatMessage({
              id: "deck_update_ai_modal/send",
            })
          )}
        </button>
      }
    >
      <div className="space-y-4">
        <fieldset className="fieldset">
          <textarea
            rows={6}
            className="textarea textarea-lg w-full resize-none"
            placeholder={formatMessage({
              id: "deck_update_ai_modal/textarea_placeholder",
            })}
            value={message}
            onChange={(e) => set_message(e.target.value)}
            disabled={props.is_sending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !props.is_sending) {
                e.preventDefault()
                handle_send()
              }
            }}
          />
        </fieldset>
      </div>
    </GlobalModal>
  )
}

export const DeckUpdateAiModal = connector(Wrapper)
