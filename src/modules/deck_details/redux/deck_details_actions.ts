import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import type { LessonEntity } from "@/modules/decks/entities/lesson_entity"
import type { SessionHistoryEntity } from "@/modules/sessions/entities/session_history_entity"

export const fetch_deck_details = createAsyncThunk<
  {
    deck: DeckEntity
    cards: CardEntity[]
    lessons: LessonEntity[]
    history: SessionHistoryEntity[]
  },
  { deck_id: string },
  AsyncThunkConfig
>(
  "decks_details/fetch_deck_details",
  async ({ deck_id }, { extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) throw new Error("User not authenticated")

    const user_id = authentication.user.id

    const [deck, cards, lessons, history] = await Promise.all([
      extra.decks_repository.get_deck_by_id({
        deck_id,
        user_id,
      }),
      extra.decks_repository.get_cards_by_deck_id({
        deck_id,
        user_id,
      }),
      extra.decks_repository.fetch_lessons({
        deck_id,
        user_id,
      }),
      extra.sessions_repository.fetch_history({
        deck_id,
        user_id,
      }),
    ])

    return { deck, cards, lessons, history }
  },
)

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks_details/global_route_changed", async (_, { dispatch, extra }) => {
  const location = extra.location_service.get_current_url()
  const pathname = new URL(location).pathname
  const { deck_id } = UrlMatcherService.extract({
    pattern: "/decks/:deck_id/",
    url: pathname,
  })

  if (deck_id) {
    await dispatch(fetch_deck_details({ deck_id }))
  }
})
