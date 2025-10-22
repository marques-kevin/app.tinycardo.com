import { MyDecks } from "@/modules/decks/components/my_decks/my_decks"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { DecksListPlaceholder } from "../components/decks_list_placeholder/decks_list_placeholder"

export function DecksListPage() {
  return (
    <div>
      <GlobalNavbar />
      <div className="container mx-auto flex flex-col gap-4">
        <MyDecks />
        <DecksListPlaceholder />
      </div>
    </div>
  )
}
