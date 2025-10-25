import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/decks_update_footer_actions/decks_update_footer_actions.container"
import { useIntl } from "react-intl"
import { SaveIcon, TrashIcon, XIcon } from "lucide-react"
import { CsvImportButton } from "@/modules/decks/components/csv_import_button/csv_import_button"
import { cn } from "@/lib/utils"

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
          <CsvImportButton />

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
