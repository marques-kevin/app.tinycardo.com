import { connector, type ContainerProps } from "./dialog_crash_error.container"
import { AlertOctagonIcon } from "lucide-react"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <dialog className="modal" open={props.is_open} onClose={props.on_close}>
      <div className="modal-box">
        <h3
          id="dialog-title"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <AlertOctagonIcon className={`size-6`} />
          {props.message}
        </h3>

        <pre className="bg-base-200 border-base-300 mt-4 overflow-auto rounded border p-4 text-xs">
          {props.stack}
        </pre>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={props.on_close}>
            {formatMessage({ id: "dialog_crash_error/close" })}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={props.on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const DialogCrashError = connector(Wrapper)
