import { MyDecks } from "@/modules/decks/components/my_decks/my_decks"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { DecksListPlaceholder } from "../components/decks_list_placeholder/decks_list_placeholder"
import { GlobalFooter } from "@/modules/global/components/global_footer/global_footer"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"

export function DecksListPage() {
  return (
    <GlobalLayout>
      <GlobalNavbar />
      <MyDecks />
      <DecksListPlaceholder />
      <GlobalFooter />
    </GlobalLayout>
  )
}
