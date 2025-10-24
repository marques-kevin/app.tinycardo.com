import { CreateDeckFooterActions } from "@/modules/decks/components/create_deck_footer_actions/create_deck_footer_actions"
import { CreateDeckTitle } from "@/modules/decks/components/create_deck_title/create_deck_title"
import { CreateDeckCardsListTable } from "@/modules/decks/components/create_deck_cards_list_table/create_deck_cards_list_table"
import { useAppSelector } from "@/redux/store"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { UpdateDeckDescription } from "../components/update_deck_description/update_deck_description"

export function CreateDeckPage() {
  const is_loading = useAppSelector((s) => s.decks.create_deck.is_loading)

  return (
    <GlobalLayout>
      <div className="w-full">
        {is_loading ? (
          <div className="flex items-center justify-center py-10">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <CreateDeckTitle />
            <UpdateDeckDescription />
            <CreateDeckCardsListTable />
            <CreateDeckFooterActions />
          </div>
        )}
      </div>
    </GlobalLayout>
  )
}
