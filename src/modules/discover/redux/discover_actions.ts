import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { DiscoverDeckEntity } from "@/modules/discover/entities/discover_deck_entity"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"

export const _store_discover_decks = createAction<DiscoverDeckEntity[]>(
  "discover/_store_discover_decks",
)

export const fetch_discover_decks = createAsyncThunk<
  DiscoverDeckEntity[],
  void,
  AsyncThunkConfig
>("discover/fetch_discover_decks", async (_, { extra }) => {
  return await extra.discover_decks_repository.fetch_discover_decks()
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
