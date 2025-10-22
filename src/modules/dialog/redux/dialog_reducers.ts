import { createReducer } from "@reduxjs/toolkit"
import type { MessageI18nKeys } from "@/intl"
import * as dialog_actions from "@/modules/dialog/redux/dialog_actions"

export interface DialogState {
  is_open: boolean
  content: {
    type: "error" | "success" | "warning" | "info"
    title: MessageI18nKeys | null
    description: MessageI18nKeys | null
  }
  crash: {
    is_open: boolean
    message: string
    stack: string
  }
}

export const initialState: DialogState = {
  is_open: false,
  content: {
    type: "info",
    title: null,
    description: null,
  },
  crash: {
    is_open: false,
    message: "",
    stack: "",
  },
}

export const dialog_reducers = createReducer(initialState, (builder) => {
  builder.addCase(dialog_actions.open.fulfilled, (state, action) => {
    state.is_open = true
    state.content = action.payload
  })

  builder.addCase(dialog_actions.close.fulfilled, (state) => {
    state.is_open = false
  })

  builder.addCase(dialog_actions.open_crash.fulfilled, (state, action) => {
    state.crash.is_open = true
    state.crash.message = action.payload.message
    state.crash.stack = action.payload.stack
  })

  builder.addCase(dialog_actions.close_crash.fulfilled, (state) => {
    state.crash.is_open = false
  })
})
