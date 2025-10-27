import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { StreakEntity } from "@/modules/streak/entities/streak_entity"

export const open_streak_modal = createAction("streak/open_streak_modal")
export const close_streak_modal = createAction("streak/close_streak_modal")
export const next_month = createAction("streak/next_month")
export const previous_month = createAction("streak/previous_month")

export const fetch_streaks = createAsyncThunk<
  StreakEntity[],
  void,
  AsyncThunkConfig
>("streak/fetch_streaks", async (_, { extra, getState }) => {
  const { authentication } = getState()

  if (!authentication.user?.id) return []

  return await extra.streak_repository.fetch({
    user_id: authentication.user.id,
  })
})
