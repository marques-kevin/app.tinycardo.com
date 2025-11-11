import { useIntl } from "react-intl"
import { ScanTextIcon } from "lucide-react"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"
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
    <GlobalModal
      title={formatMessage({ id: "deck_update_import_csv_modal/title" })}
      description={formatMessage({
        id: "deck_update_import_csv_modal/description",
      })}
      icon={ScanTextIcon}
      is_open={props.is_open}
      on_close={on_close}
      actions={
        <button
          className="btn btn-lg btn-primary"
          disabled={props.selected_front === props.selected_back}
          onClick={on_apply}
        >
          {formatMessage({ id: "deck_update_import_csv_modal/apply" })}
        </button>
      }
    >
      <div className="space-y-4">
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
    </GlobalModal>
  )
}

export const DeckUpdateImportCsvModal = connector(Wrapper)
