import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import { v4 } from "uuid"
import type { AsyncThunkConfig } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import { store } from "@/modules/language/redux/language_actions"

export const open = createAction("ai_assistant/open")

export const close = createAction("ai_assistant/close")

export const store_new_message = createAction<AiAssistantMessageEntity>(
  "ai_assistant/store_new_message",
)

export const send_message = createAsyncThunk<
  void,
  { content: string },
  AsyncThunkConfig
>(
  "ai_assistant/send_message",
  async (params, { getState, dispatch, extra }) => {
    dispatch(
      store_new_message({
        id: v4(),
        role: "user",
        content: params.content,
        timestamp: new Date(),
        actions: [],
      }),
    )

    const response = await extra.ai_assistant_service.chat({
      message: params.content,
      cards: getState().deck_update.cards.map(
        (c) => getState().deck_update.cards_map[c],
      ),
      lessons: getState().deck_update.lessons,
      deck: getState().deck_update.deck!,
    })

    for (const action of response.actions) {
      if (action.type === "create_cards") {
        dispatch(
          // @todo create a dedicated action for this
          deck_update_actions._add_cards_from_import({
            cards: action.payload.cards,
          }),
        )
      }

      if (action.type === "update_cards") {
        for (const card of action.payload.cards) {
          dispatch(
            deck_update_actions.update_card({
              id: card.id,
              field: "front",
              value: card.front,
            }),
          )
          dispatch(
            deck_update_actions.update_card({
              id: card.id,
              field: "back",
              value: card.back,
            }),
          )
        }
      }
    }

    dispatch(store_new_message(response))
  },
)
