import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import { add_hash } from "../utils/add_hash"
import { remove_hash } from "../utils/remove_hash"
import { DRAWER_KEYS } from "./drawer_types"

export const _set_drawer = createAction<{
  key: keyof typeof DRAWER_KEYS
  value: string | null
}>("drawer/_set_drawer")

export const open_drawer = createAsyncThunk<
  void,
  { key: keyof typeof DRAWER_KEYS; value: string | null },
  AsyncThunkConfig
>("drawer/open_drawer", async ({ key, value }, { extra }) => {
  extra.location_service.navigate(
    add_hash({
      path: key,
      value: value ?? undefined,
      current_hash: extra.location_service.get_current_hash(),
    }),
  )
})

export const close_drawer = createAsyncThunk<
  void,
  { key: keyof typeof DRAWER_KEYS },
  AsyncThunkConfig
>("drawer/close_drawer", async ({ key }, { dispatch, extra }) => {
  dispatch(_set_drawer({ key, value: null }))

  extra.location_service.navigate(
    remove_hash({
      path: key,
      current_hash: extra.location_service.get_current_hash(),
    }),
  )
})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("drawer/global_route_changed", async (_, { dispatch, extra }) => {
  const location = extra.location_service.get_current_url()

  const { hash } = new URL(location)

  const hash_keys = UrlMatcherService.extract_from_hash({
    hash,
  })

  for (const key of Object.keys(DRAWER_KEYS)) {
    dispatch(
      _set_drawer({
        key: key as keyof typeof DRAWER_KEYS,
        value: hash_keys[key] || null,
      }),
    )
  }
})
