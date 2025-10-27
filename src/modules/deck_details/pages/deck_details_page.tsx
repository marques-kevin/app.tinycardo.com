import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DeckDetailsHeader } from "../components/deck_details_header/deck_details_header"
import { DeckDetailsLessonsList } from "../components/deck_details_lessons_list/deck_details_lessons_list"
import { DeckDetailsTabs } from "../components/deck_details_tabs/deck_details_tabs"
import { DeckDetailsCardsList } from "../components/deck_details_cards_list/deck_details_cards_list"

export function DeckDetailsPage() {
  return (
    <GlobalLayout>
      <div className="space-y-4">
        <DeckDetailsHeader />
        <DeckDetailsTabs>
          {(tab) => {
            if (tab === "lessons") {
              return <DeckDetailsLessonsList lessons={[]} />
            }

            return <DeckDetailsCardsList />
          }}
        </DeckDetailsTabs>
      </div>
    </GlobalLayout>
  )
}
