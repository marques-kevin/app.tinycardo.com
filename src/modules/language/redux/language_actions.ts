import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"

export const _store = createAction<{
  lang: string
}>("language/_store")

export const store = createAsyncThunk<void, { lang: string }, AsyncThunkConfig>(
  "language/store",
  async ({ lang }, { dispatch, extra }) => {
    extra.local_storage_service.set(LOCAL_STORAGE_KEYS.language, lang)
    dispatch(_store({ lang }))
  },
)
