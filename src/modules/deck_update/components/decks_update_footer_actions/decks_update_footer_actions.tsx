import {
  connector,
  type ContainerProps,
} from "@/modules/deck_update/components/decks_update_footer_actions/decks_update_footer_actions.container"
import { useIntl } from "react-intl"
import { SaveIcon, TrashIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef } from "react"
import { DownloadIcon } from "lucide-react"

function CsvImportButton(props: { on_import_csv: (content: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handle_file_change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content) {
        props.on_import_csv(content)
      }
    }
    reader.readAsText(file)

    event.target.value = ""
  }

  const handle_click = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <button
        className="btn text-base-content btn-ghost tooltip tooltip-left"
        data-tip="Import from csv file"
        onClick={handle_click}
      >
        <DownloadIcon className="size-5" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handle_file_change}
      />
    </>
  )
}

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  return (
    <div className="bg-base-100 border-base-content/20 z-10 border px-2 py-4">
      <div className="grid grid-cols-3 items-center justify-between gap-4">
        <div>
          <button
            onClick={props.on_back}
            className="btn btn-ghost gap-2 uppercase"
          >
            <XIcon className="size-5" />
            <span>
              {formatMessage({ id: "decks_update_footer_actions/back" })}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center">
          {props.selected_cards_length > 0 ? (
            <button
              className="btn btn-error gap-2 uppercase"
              onClick={props.on_delete_selected_cards}
            >
              <TrashIcon className="size-5" />
              <span>
                {formatMessage(
                  {
                    id: "decks_update_footer_actions/delete_selected_cards",
                  },
                  { length: props.selected_cards_length },
                )}
              </span>
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <CsvImportButton on_import_csv={props.on_import_csv} />

          <button
            onClick={props.on_save}
            disabled={props.is_updating}
            className={cn("btn btn-primary gap-2 uppercase")}
          >
            {props.is_updating ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <SaveIcon className="size-5" />
            )}
            <span>
              {formatMessage({ id: "decks_update_footer_actions/save" })}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export const DecksUpdateFooterActions = connector(Wrapper)
