import { SparklesIcon, XIcon } from "lucide-react"
import { useIntl } from "react-intl"
import {
  connector,
  type ContainerProps,
} from "./ai_assistant_chat_dialog.container"

const Wrapper = (props: ContainerProps) => {
  const { formatMessage } = useIntl()
  return (
    <dialog className="modal p-4" open={props.is_open} onClose={props.on_close}>
      <div className="modal-box border-base-300 rounded-box bg-base-100 flex h-full !w-full !max-w-2xl flex-col border p-0">
        <div className="border-base-300 flex items-center justify-between gap-2 border-b p-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="fill-primary text-primary-content size-5" />
            <h3 className="text-lg font-semibold">
              {formatMessage({ id: "ai_assistant_chat_dialog/title" })}
            </h3>
          </div>
          <button className="btn btn-ghost btn-circle" onClick={props.on_close}>
            <XIcon className="size-5" />
          </button>
        </div>

        {props.children}
      </div>
    </dialog>
  )
}

export const AiAssistantChatDialog = connector(Wrapper)
