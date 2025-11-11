import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
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
  extra.location_service.navigate(`/decks/${_.deck_id}/`)
})

export const on_use_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("discover/on_use_deck", async (_, { extra }) => {})

export const close_action_dialog = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("discover/close_action_dialog", async () => {})

export const fetch_discover_decks = createAsyncThunk<
  DiscoverDeckEntity[],
  void,
  AsyncThunkConfig
>("discover/fetch_discover_decks", async (_, { extra, getState }) => {
  const { discover } = getState()

  const decks = await extra.discover_decks_repository.fetch_discover_decks({
    spoken_language: discover.filters.spoken_language,
    learning_language: discover.filters.learning_language,
    title: discover.filters.title_query || undefined,
  })

  return decks
})

export const _set_spoken_language_filter = createAction<{
  spoken_language: string
}>("discover/_set_spoken_language_filter")

export const _set_learning_language_filter = createAction<{
  learning_language: string
}>("discover/_set_learning_language_filter")

export const _set_title_query_filter = createAction<{
  title_query: string
}>("discover/_set_title_query_filter")

export const change_language_filter = createAsyncThunk<
  void,
  { spoken_language: string; learning_language: string },
  AsyncThunkConfig
>("discover/change_language_filter", async (_, { dispatch }) => {
  dispatch(_set_spoken_language_filter({ spoken_language: _.spoken_language }))
  dispatch(
    _set_learning_language_filter({ learning_language: _.learning_language }),
  )
  dispatch(fetch_discover_decks())
})

export const change_title_query_filter = createAsyncThunk<
  void,
  { title_query: string },
  AsyncThunkConfig
>("discover/change_title_query_filter", async (_, { dispatch }) => {
  dispatch(_set_title_query_filter({ title_query: _.title_query }))
  dispatch(fetch_discover_decks())
})

export const sync_filters_with_current_language = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "discover/sync_filters_with_current_language",
  async (_, { getState, dispatch }) => {
    const { language } = getState()
    const { lang } = language

    dispatch(_set_spoken_language_filter({ spoken_language: lang }))

    if (lang === "fr") {
      dispatch(_set_learning_language_filter({ learning_language: "en" }))
    }

    dispatch(fetch_discover_decks())
  },
)

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("discover/global_route_changed", async (_, { dispatch, extra }) => {
  const location = extra.location_service.get_current_url()
  const pathname = new URL(location).pathname

  if (UrlMatcherService.exact_match({ url: pathname, pattern: "/discover/" })) {
    await dispatch(sync_filters_with_current_language())
  }
})
