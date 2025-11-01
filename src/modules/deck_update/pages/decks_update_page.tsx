import { DecksUpdateDescription } from "@/modules/deck_update/components/decks_update_description/decks_update_description"
import { DecksUpdateVisibilitySelect } from "@/modules/deck_update/components/decks_update_visibility_select/decks_update_visibility_select"
import { DecksUpdateCardsListTable } from "@/modules/deck_update/components/decks_update_cards_list_table/decks_update_cards_list_table"
import { DecksUpdateFooterActions } from "@/modules/deck_update/components/decks_update_footer_actions/decks_update_footer_actions"
import { DecksUpdateTitle } from "@/modules/deck_update/components/decks_update_title/decks_update_title"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { DeckUpdateTabs } from "@/modules/deck_update/components/deck_update_tabs/deck_update_tabs"
import { DeckUpdateTabsRenameModal } from "@/modules/deck_update/components/deck_update_tabs_rename_modal/deck_update_tabs_rename_modal"
import { DeckUpdateAddCardsToLessonModal } from "@/modules/deck_update/components/deck_update_add_cards_to_lesson_modal/deck_update_add_cards_to_lesson_modal"

export function DecksUpdatePage() {
  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex-1 overflow-y-auto">
          <GlobalNavbar />
          <div className="px-4 py-4">
            <DecksUpdateTitle />
            <DecksUpdateVisibilitySelect />
            <DecksUpdateDescription />
            <DeckUpdateTabs />
            <DecksUpdateCardsListTable />
          </div>
        </div>
        <div className="mt-auto">
          <DecksUpdateFooterActions />
        </div>
      </div>
      <DeckUpdateTabsRenameModal />
      <DeckUpdateAddCardsToLessonModal />
    </>
  )
}
