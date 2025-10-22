import {
  connector,
  type ContainerProps,
} from "@/modules/dialog/components/dialog/dialog.container"
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { useIntl } from "react-intl"

function get_icon(type: ContainerProps["type"]) {
  switch (type) {
    case "error":
      return { Icon: AlertTriangleIcon }
    case "success":
      return { Icon: CheckCircle2Icon }
    case "warning":
      return { Icon: AlertTriangleIcon }
    case "info":
    default:
      return { Icon: InfoIcon }
  }
}

export function Wrapper(props: ContainerProps) {
  const { Icon } = get_icon(props.type)
  const { formatMessage } = useIntl()

  return (
    <dialog className="modal" open={props.is_open} onClose={props.on_close}>
      <div className="modal-box">
        <h3
          id="dialog-title"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <Icon className={`size-6`} />
          {props.title && formatMessage({ id: props.title })}
        </h3>

        <p className="py-4">
          {props.description && formatMessage({ id: props.description })}
        </p>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={props.on_close}>
            {formatMessage({ id: "dialog/close" })}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={props.on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const Dialog = connector(Wrapper)
