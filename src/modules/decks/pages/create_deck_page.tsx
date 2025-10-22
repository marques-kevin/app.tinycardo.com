import { CreateDeckFooterActions } from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions"
import { CreateDeckTitle } from "@/modules/decks/components/create_deck_title/create_deck_title"
import { CreateDeckCardsListTable } from "@/modules/decks/components/create_deck_cards_list_table/create_deck_cards_list_table"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { useAppSelector } from "@/redux/store"
import { useIntl } from "react-intl"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"

export function CreateDeckPage() {
  const { formatMessage } = useIntl()

  const is_loading = useAppSelector((s) => s.decks.create_deck.is_loading)

  return (
    <GlobalLayout>
      <GlobalNavbar />

      <div className="w-full">
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
    </GlobalLayout>
  )
}
