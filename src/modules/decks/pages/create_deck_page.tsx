import { CreateDeckFooterActions } from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions"
import { CreateDeckTitle } from "@/modules/decks/components/create_deck_title/create_deck_title"
import { CreateDeckCardsListTable } from "@/modules/decks/components/create_deck_cards_list_table/create_deck_cards_list_table"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { useAppSelector, useAppDispatch } from "@/redux/store"
import * as actions from "@/modules/decks/redux/decks_actions"
import { useIntl } from "react-intl"

export function CreateDeckPage() {
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const is_loading = useAppSelector((s) => s.decks.create_deck.is_loading)
  const csv_mapping = useAppSelector(
    (s) => s.decks.create_deck.csv_import_dialog,
  )

  const handleUpdateFrontColumn = (selected_front: number) => {
    dispatch(actions._update_csv_import_dialog({ selected_front }))
  }

  const handleUpdateBackColumn = (selected_back: number) => {
    dispatch(actions._update_csv_import_dialog({ selected_back }))
  }

  const handleCloseDialog = () => {
    dispatch(actions._close_csv_import_dialog())
  }

  const handleApplyMapping = () => {
    dispatch(actions.apply_csv_import_mapping())
  }

  return (
    <>
      <GlobalNavbar />
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">
            {formatMessage({ id: "create_deck_page/title" })}
          </h1>
          <p className="opacity-60">
            {formatMessage({ id: "create_deck_page/description" })}
          </p>
        </div>

        {is_loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <CreateDeckTitle />
            <CreateDeckCardsListTable />
            <CreateDeckFooterActions />
          </div>
        )}
      </div>

      {csv_mapping?.open && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">
              {formatMessage({ id: "create_deck_page/csv_mapping_title" })}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    {formatMessage({
                      id: "create_deck_page/csv_mapping/front_column",
                    })}
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={csv_mapping.selected_front}
                  onChange={(e) =>
                    handleUpdateFrontColumn(parseInt(e.target.value))
                  }
                >
                  {csv_mapping.headers.map((h, i) => (
                    <option key={`front-${i}`} value={i}>
                      {i + 1}. {h || `Column ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    {formatMessage({
                      id: "create_deck_page/csv_mapping/back_column",
                    })}
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={csv_mapping.selected_back}
                  onChange={(e) =>
                    handleUpdateBackColumn(parseInt(e.target.value))
                  }
                >
                  {csv_mapping.headers.map((h, i) => (
                    <option key={`back-${i}`} value={i}>
                      {i + 1}. {h || `Column ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={handleCloseDialog}>
                {formatMessage({ id: "create_deck_page/csv_mapping/cancel" })}
              </button>
              <button
                className="btn btn-primary"
                disabled={
                  csv_mapping.selected_front === csv_mapping.selected_back
                }
                onClick={handleApplyMapping}
              >
                {formatMessage({ id: "create_deck_page/csv_mapping/apply" })}
              </button>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={handleCloseDialog}
          >
            <button>
              {formatMessage({ id: "create_deck_page/csv_mapping/close" })}
            </button>
          </form>
        </dialog>
      )}
    </>
  )
}
