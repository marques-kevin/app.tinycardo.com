import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"

export const open_action_dialog = createAsyncThunk<
  { deck: DiscoverDeckEntity },
  { deck_id: string },
  AsyncThunkConfig
>("discover/open_action_dialog", async (_, { getState }) => {
  const { discover } = getState()
  const decks = discover.decks
  const deck = decks.find((d) => d.id === _.deck_id)

  if (!deck) {
    throw new Error("Deck not found")
  }

  return { deck }
})

export const on_view_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("discover/on_view_deck", async (_, { extra }) => {
  extra.location_service.navigate(`/decks/${_.deck_id}/details`)
})

export const on_use_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("discover/on_use_deck", async (_, { extra }) => {
  const response = await extra.discover_decks_repository.start_using_deck({
    deck_id: _.deck_id,
  })

  extra.location_service.navigate(`/sessions/${response.id}/learn_new_words`)
})

export const close_action_dialog = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("discover/close_action_dialog", async () => {})

export const fetch_discover_decks = createAsyncThunk<
  DiscoverDeckEntity[],
  void,
  AsyncThunkConfig
>("discover/fetch_discover_decks", async (_, { extra }) => {
  const decks = await extra.discover_decks_repository.fetch_discover_decks()

  return decks
})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("discover/global_route_changed", async (_, { dispatch, extra }) => {
  const location = extra.location_service.get_current_url()
  const pathname = new URL(location).pathname

  if (UrlMatcherService.exact_match({ url: pathname, pattern: "/discover/" })) {
    await dispatch(fetch_discover_decks())
  }
})
