import { useIntl } from "react-intl"
import { ScanTextIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "./deck_update_import_csv_modal.container"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  const on_update_front_column = (value: number) => {
    props.on_update_front_column(value)
  }

  const on_update_back_column = (value: number) => {
    props.on_update_back_column(value)
  }

  const on_close = () => {
    props.on_close()
  }

  const on_apply = () => {
    props.on_apply()
  }

  return (
    <dialog open={props.is_open} className="modal">
      <div className="modal-box w-full max-w-2xl">
        <h3 className="text-accent flex items-center gap-2 text-2xl font-bold">
          <ScanTextIcon className={`size-6`} />
          {formatMessage({ id: "deck_update_import_csv_modal/title" })}
        </h3>

        <p className="text-base-content/50 mt-2">
          {formatMessage({ id: "deck_update_import_csv_modal/description" })}
        </p>

        <div className="mt-8 space-y-4">
          <fieldset className="fieldset">
            <label className="label">
              {formatMessage({
                id: "deck_update_import_csv_modal/front_column",
              })}
            </label>
            <select
              className="select select-lg select-bordered w-full"
              value={props.selected_front}
              onChange={(e) => on_update_front_column(parseInt(e.target.value))}
            >
              {props.headers.map((header, i) => (
                <option key={`front-${i}`} value={i}>
                  {header}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <label className="label">
              {formatMessage({
                id: "deck_update_import_csv_modal/back_column",
              })}
            </label>
            <select
              className="select select-lg select-bordered w-full"
              value={props.selected_back}
              onChange={(e) => on_update_back_column(parseInt(e.target.value))}
            >
              {props.headers.map((header, i) => (
                <option key={`back-${i}`} value={i}>
                  {header}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        <div className="modal-action justify-between">
          <button className="btn btn-ghost" onClick={on_close}>
            {formatMessage({ id: "deck_update_import_csv_modal/cancel" })}
          </button>
          <button
            className="btn btn-primary"
            disabled={props.selected_front === props.selected_back}
            onClick={on_apply}
          >
            {formatMessage({ id: "deck_update_import_csv_modal/apply" })}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export const DeckUpdateImportCsvModal = connector(Wrapper)
