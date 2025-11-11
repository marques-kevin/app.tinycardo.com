import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DiscoverDecksList } from "@/modules/discover/components/discover_decks_list/discover_decks_list"
import { DiscoverDecksFilters } from "@/modules/discover/components/discover_decks_filters/discover_decks_filters"
import { DiscoverDecksSearchModal } from "@/modules/discover/components/discover_decks_search_modal/discover_decks_search_modal"

export function DiscoverIndexPage() {
  return (
    <GlobalLayout>
      <div className="space-y-4">
        <div className="border-base-300 rounded-box flex justify-between border-2 p-4">
          <DiscoverDecksFilters />
          <DiscoverDecksSearchModal />
        </div>
        <DiscoverDecksList />
      </div>
    </GlobalLayout>
  )
}
