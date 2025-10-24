import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import { add_hash } from "../utils/add_hash"
import { remove_hash } from "../utils/remove_hash"

export const _set_deck_details_drawer = createAction<{ value: string | null }>(
  "drawer/_set_deck_details_drawer",
)

export const open_deck_details_drawer = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("drawer/open_deck_details_drawer", async ({ deck_id }, { extra }) => {
  extra.location_service.navigate(
    add_hash({
      path: "deck_details_drawer",
      value: deck_id,
      current_hash: extra.location_service.get_current_hash(),
    }),
  )
})

export const close_deck_details_drawer = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("drawer/close_deck_details_drawer", async (_, { extra }) => {
  extra.location_service.navigate(
    remove_hash({
      path: "deck_details_drawer",
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

  const { deck_details_drawer } = UrlMatcherService.extract_from_hash({
    hash,
  })

  dispatch(_set_deck_details_drawer({ value: deck_details_drawer || null }))
})
