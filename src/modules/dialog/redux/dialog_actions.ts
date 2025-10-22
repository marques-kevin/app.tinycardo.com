import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AsyncThunkConfig } from "@/redux/store"
import type { DialogState } from "@/modules/dialog/redux/dialog_reducers"

export const open = createAsyncThunk<
  DialogState["content"],
  DialogState["content"],
  AsyncThunkConfig
>("dialog/open", async (params) => {
  return params
})

export const close = createAsyncThunk<void, void, AsyncThunkConfig>(
  "dialog/close",
  async () => {
    return
  },
)

export const open_crash = createAsyncThunk<
  Pick<DialogState["crash"], "stack" | "message">,
  Pick<DialogState["crash"], "stack" | "message">,
  AsyncThunkConfig
>("dialog/open_crash", async (params) => {
  return params
})

export const close_crash = createAsyncThunk<void, void, AsyncThunkConfig>(
  "dialog/close_crash",
  async () => {
    return
  },
)
