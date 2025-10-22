import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

export const _store_theme = createAction<{ theme: string }>(
  "params/store_theme",
)

export const store_theme = createAsyncThunk<
  void,
  { theme: string },
  AsyncThunkConfig
>("params/store_theme", async ({ theme }, { dispatch, extra }) => {
  extra.local_storage_service.set(LOCAL_STORAGE_KEYS.theme, theme)
  document.documentElement.setAttribute("data-theme", theme)
  dispatch(_store_theme({ theme }))
})

export const _store_how_many_words_to_review = createAction<{
  how_many_words_to_review: number
}>("params/store_how_many_words_to_review")

export const store_how_many_words_to_review = createAsyncThunk<
  void,
  { how_many_words_to_review: number },
  AsyncThunkConfig
>(
  "params/store_how_many_words_to_review",
  async ({ how_many_words_to_review }, { dispatch, extra }) => {
    extra.local_storage_service.set(
      LOCAL_STORAGE_KEYS.how_many_words_to_review,
      how_many_words_to_review.toString(),
    )
    dispatch(_store_how_many_words_to_review({ how_many_words_to_review }))
  },
)

export const _store_how_many_words_to_learn_new_words = createAction<{
  how_many_words_to_learn_new_words: number
}>("params/store_how_many_words_to_learn_new_words")

export const store_how_many_words_to_learn_new_words = createAsyncThunk<
  void,
  { how_many_words_to_learn_new_words: number },
  AsyncThunkConfig
>(
  "params/store_how_many_words_to_learn_new_words",
  async ({ how_many_words_to_learn_new_words }, { dispatch, extra }) => {
    extra.local_storage_service.set(
      LOCAL_STORAGE_KEYS.how_many_words_to_learn_new_words,
      how_many_words_to_learn_new_words.toString(),
    )
    dispatch(
      _store_how_many_words_to_learn_new_words({
        how_many_words_to_learn_new_words,
      }),
    )
  },
)

export const _store_how_many_words_to_randomized = createAction<{
  how_many_words_to_randomized: number
}>("params/store_how_many_words_to_randomized")

export const store_how_many_words_to_randomized = createAsyncThunk<
  void,
  { how_many_words_to_randomized: number },
  AsyncThunkConfig
>(
  "params/store_how_many_words_to_randomized",
  async ({ how_many_words_to_randomized }, { dispatch, extra }) => {
    extra.local_storage_service.set(
      LOCAL_STORAGE_KEYS.how_many_words_to_randomized,
      how_many_words_to_randomized.toString(),
    )
    dispatch(
      _store_how_many_words_to_randomized({ how_many_words_to_randomized }),
    )
  },
)

export const global_app_initialized = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("params/global_app_initialized", async (_, { dispatch, extra }) => {
  const [
    theme,
    how_many_words_to_review,
    how_many_words_to_learn_new_words,
    how_many_words_to_randomized,
  ] = await Promise.all([
    extra.local_storage_service.get(LOCAL_STORAGE_KEYS.theme),
    extra.local_storage_service.get(
      LOCAL_STORAGE_KEYS.how_many_words_to_review,
    ),
    extra.local_storage_service.get(
      LOCAL_STORAGE_KEYS.how_many_words_to_learn_new_words,
    ),
    extra.local_storage_service.get(
      LOCAL_STORAGE_KEYS.how_many_words_to_randomized,
    ),
  ])

  dispatch(store_theme({ theme: theme || "light" }))
  dispatch(
    store_how_many_words_to_review({
      how_many_words_to_review: Number(how_many_words_to_review) || 50,
    }),
  )
  dispatch(
    store_how_many_words_to_learn_new_words({
      how_many_words_to_learn_new_words:
        Number(how_many_words_to_learn_new_words) || 10,
    }),
  )
  dispatch(
    store_how_many_words_to_randomized({
      how_many_words_to_randomized: Number(how_many_words_to_randomized) || 100,
    }),
  )
})

export const delete_all_data = createAsyncThunk<void, void, AsyncThunkConfig>(
  "params/delete_all_data",
  async (_, { extra }) => {
    await extra.sessions_repository.clear_history()
    await extra.location_service.refresh()
  },
)
