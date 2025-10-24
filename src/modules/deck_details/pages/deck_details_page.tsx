import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DeckDetailsHeader } from "@/modules/deck_details/components/deck_details_header/deck_details_header"
import { DeckDetailsCardsList } from "@/modules/deck_details/components/deck_details_cards_list/deck_details_cards_list"

export function DeckDetailsPage() {
  return (
    <GlobalLayout>
      <GlobalNavbar />
      <div className="space-y-6">
        <DeckDetailsHeader />
        <DeckDetailsCardsList />
      </div>
    </GlobalLayout>
  )
}
