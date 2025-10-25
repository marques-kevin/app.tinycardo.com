import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DecksUpdateDescription } from "@/modules/decks/components/decks_update_description/decks_update_description"
import { DecksUpdateVisibilitySelect } from "@/modules/decks/components/decks_update_visibility_select/decks_update_visibility_select"
import { DecksUpdateCardsListTable } from "@/modules/decks/components/decks_update_cards_list_table/decks_update_cards_list_table"
import { DecksUpdateFooterActions } from "@/modules/decks/components/decks_update_footer_actions/decks_update_footer_actions"
import { DecksUpdateTitle } from "@/modules/decks/components/decks_update_title/decks_update_title"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"

export function DecksUpdatePage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <GlobalNavbar />
        <div className="px-4 py-4">
          <DecksUpdateTitle />
          <DecksUpdateVisibilitySelect />
          <DecksUpdateDescription />
          <DecksUpdateCardsListTable />
        </div>
      </div>
      <div className="mt-auto">
        <DecksUpdateFooterActions />
      </div>
    </div>
  )
}
