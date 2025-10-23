import { GlobalFooter } from "@/modules/global/components/global_footer/global_footer"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { DiscoverDecksList } from "@/modules/discover/components/discover_decks_list/discover_decks_list"

export function DiscoverIndexPage() {
  return (
    <GlobalLayout>
      <GlobalNavbar />
      <DiscoverDecksList />
      <GlobalFooter />
    </GlobalLayout>
  )
}
