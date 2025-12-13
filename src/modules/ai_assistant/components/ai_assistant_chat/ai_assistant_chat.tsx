import { useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
import { getStore } from "@/redux/store"
import * as ai_assistant_actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import type {
  AiAssistantMessageEntity,
  AiAssistantMessageToolName,
  AiAssistantToolDispatch,
} from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import { catch_error } from "@/modules/global/redux/global_actions"
import { AiAssistantChatMessages } from "@/modules/ai_assistant/components/ai_assistant_chat_messages/ai_assistant_chat_messages"
import { AiAssistantChatDialog } from "@/modules/ai_assistant/components/ai_assistant_chat_dialog/ai_assistant_chat_dialog"
import { AiAssistantChatFooter } from "@/modules/ai_assistant/components/ai_assistant_chat_footer/ai_assistant_chat_footer"

export function Wrapper() {
  const { messages, status, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/ai_assistant/chat",
      body: async () => ({
        deck: getStore().getState().deck_update.deck!,
      }),
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(LOCAL_STORAGE_KEYS.jwt)}`,
      },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (error) => {
      const store = getStore()

      store.dispatch(
        catch_error({
          message: error.message,
          stack: error.stack || "",
        }),
      )
    },
    onToolCall: async ({ toolCall }) => {
      const store = getStore()

      store.dispatch(
        ai_assistant_actions.dispatch_tool({
          tool_name: toolCall.toolName,
          values_returned_by_ai: toolCall.input,
          callback: (values_to_send_to_ai: unknown) => {
            addToolOutput({
              tool: toolCall.toolName,
              toolCallId: toolCall.toolCallId,
              output: JSON.stringify(values_to_send_to_ai),
            })
          },
        } as AiAssistantToolDispatch),
      )
    },
  })

  const messages_to_render: AiAssistantMessageEntity[] = messages.map(
    (message) => ({
      id: message.id,
      role: message.role,
      content: message.parts
        .filter((part) => part.type === "text" || part.type.includes("tool-"))
        .map((part, index) => {
          const id = `${message.id}-${index}`

          if (part.type.includes("tool-") && "state" in part) {
            return {
              id,
              type: "tool" as const,
              tool_name: part.type.split("-")[1] as AiAssistantMessageToolName,
              tool_fetching: part.state !== "output-available",
              text: "",
            }
          }

          return {
            id,
            type: "text" as const,
            text: (part as { text: string }).text,
          }
        }),
      timestamp: new Date(),
    }),
  )

  const on_send_message = useCallback(
    (content: string) => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: content }],
      })
    },
    [sendMessage],
  )

  return (
    <>
      <AiAssistantChatMessages
        messages={messages_to_render}
        is_loading={status === "submitted"}
      />
      <AiAssistantChatFooter
        on_send_message={on_send_message}
        is_loading={status === "submitted"}
      />
    </>
  )
}

export const AiAssistantChat = () => {
  return (
    <AiAssistantChatDialog>
      <Wrapper />
    </AiAssistantChatDialog>
  )
}
