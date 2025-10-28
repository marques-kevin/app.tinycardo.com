import { MyDecks } from "@/modules/decks/components/my_decks/my_decks"
import { DecksListPlaceholder } from "@/modules/decks/components/decks_list_placeholder/decks_list_placeholder"
import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DecksLoading } from "@/modules/decks/components/decks_loading/decks_loading"

export function DecksListPage() {
  return (
    <GlobalLayout>
      <div className="space-y-4">
        <DecksLoading>
          <MyDecks />
          <DecksListPlaceholder />
        </DecksLoading>
      </div>
    </GlobalLayout>
  )
}
