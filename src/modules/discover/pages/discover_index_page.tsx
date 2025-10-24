import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DiscoverDecksList } from "@/modules/discover/components/discover_decks_list/discover_decks_list"
import { DiscoverDecksActionDialog } from "@/modules/discover/components/discover_decks_action_dialog/discover_decks_action_dialog"

export function DiscoverIndexPage() {
  return (
    <GlobalLayout>
      <DiscoverDecksList />
      <DiscoverDecksActionDialog />
    </GlobalLayout>
  )
}
