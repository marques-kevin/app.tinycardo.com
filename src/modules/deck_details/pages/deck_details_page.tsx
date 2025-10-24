import { GlobalLayout } from "@/modules/global/components/global_layout/global_layout"
import { DeckDetailsHeader } from "@/modules/deck_details/components/deck_details_header/deck_details_header"
import { DeckDetailsCardsList } from "@/modules/deck_details/components/deck_details_cards_list/deck_details_cards_list"
import { DeckDetailsTabs } from "@/modules/deck_details/components/deck_details_tabs/deck_details_tabs"
import { DeckDetailsLessonsList } from "../components/deck_details_lessons_list/deck_details_lessons_list"

export function DeckDetailsPage() {
  return (
    <GlobalLayout>
      <div className="space-y-6">
        <DeckDetailsHeader />
        <DeckDetailsTabs>
          {(tab) => {
            if (tab === "lessons") {
              return (
                <div className="p-4">
                  <DeckDetailsLessonsList
                    lessons={Array.from({ length: 10 }).map((_, index) => ({
                      id: index.toString(),
                      name: `Lesson ${index + 1}`,
                      total: 10,
                      mastered: 10,
                      review: 10,
                    }))}
                  />
                </div>
              )
            }

            return <DeckDetailsCardsList />
          }}
        </DeckDetailsTabs>
      </div>
    </GlobalLayout>
  )
}
