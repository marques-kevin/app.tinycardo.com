import { createReducer } from "@reduxjs/toolkit"
import * as actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"

export interface AiAssistantState {
  is_open: boolean
  messages: AiAssistantMessageEntity[]
}

const initialState: AiAssistantState = {
  is_open: false,
  messages: [],
}

export const ai_assistant_reducers = createReducer(initialState, (builder) => {
  builder.addCase(actions.open, (state) => {
    state.is_open = true
  })

  builder.addCase(actions.close, (state) => {
    state.is_open = false
  })

  builder.addCase(actions.store_new_message, (state, action) => {
    state.messages.push(action.payload)
  })
})
