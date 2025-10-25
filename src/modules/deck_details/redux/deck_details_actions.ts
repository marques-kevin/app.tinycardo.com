import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"

export const fetch_deck_details = createAsyncThunk<
  { deck: DeckEntity; cards: CardEntity[] },
  { deck_id: string },
  AsyncThunkConfig
>("decks_details/fetch_deck_details", async ({ deck_id }, { extra }) => {
  const deck = await extra.decks_repository.get_deck_by_id({ id: deck_id })
  const cards = await extra.decks_repository.get_cards_by_deck_id({ deck_id })

  return { deck, cards }
})

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
