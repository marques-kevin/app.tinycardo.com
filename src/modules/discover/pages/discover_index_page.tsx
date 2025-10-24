import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DiscoverDecksList } from "@/modules/discover/components/discover_decks_list/discover_decks_list"
import { DiscoverDecksActionDialog } from "@/modules/discover/components/discover_decks_action_dialog/discover_decks_action_dialog"
import { DiscoverDecksSearch } from "@/modules/discover/components/discover_decks_search/discover_decks_search"

export function DiscoverIndexPage() {
  return (
    <GlobalLayout>
      <div className="space-y-4">
        <DiscoverDecksSearch />
        <DiscoverDecksList />
        <DiscoverDecksActionDialog />
      </div>
    </GlobalLayout>
  )
}
