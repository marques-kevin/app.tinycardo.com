import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DeckDetailsHeader } from "@/modules/deck_details/components/deck_details_header/deck_details_header"
import { DeckDetailsLessonsList } from "@/modules/deck_details/components/deck_details_lessons_list/deck_details_lessons_list"
import { DeckDetailsTabs } from "@/modules/deck_details/components/deck_details_tabs/deck_details_tabs"
import { DeckDetailsCardsList } from "@/modules/deck_details/components/deck_details_cards_list/deck_details_cards_list"
import { DeckDetailsLoading } from "@/modules/deck_details/components/deck_details_loading/deck_details_loading"

export function DeckDetailsPage() {
  return (
    <GlobalLayout>
      <DeckDetailsLoading>
        <div className="space-y-4">
          <DeckDetailsHeader />
          <DeckDetailsTabs>
            {(tab) => {
              if (tab === "lessons") {
                return <DeckDetailsLessonsList />
              }

              return <DeckDetailsCardsList />
            }}
          </DeckDetailsTabs>
        </div>
      </DeckDetailsLoading>
    </GlobalLayout>
  )
}
