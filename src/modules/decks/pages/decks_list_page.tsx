import { MyDecks } from "@/modules/decks/components/my_decks/my_decks"
import { DecksListPlaceholder } from "../components/decks_list_placeholder/decks_list_placeholder"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DeckDetailsDrawer } from "@/modules/deck_details/components/deck_details_drawer/deck_details_drawer"
import { DeckUpdateDrawer } from "@/modules/decks/components/deck_update_drawer/deck_update_drawer"

export function DecksListPage() {
  return (
    <GlobalLayout>
      <div className="space-y-4">
        <MyDecks />
        <DecksListPlaceholder />
        <DeckDetailsDrawer />
        <DeckUpdateDrawer />
      </div>
    </GlobalLayout>
  )
}
