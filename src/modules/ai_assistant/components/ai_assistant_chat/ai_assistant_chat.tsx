import { useEffect, useRef, memo, useCallback } from "react"
import {
  CheckCircleIcon,
  Loader2Icon,
  SendIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react"
import { useIntl } from "react-intl"
import ReactMarkdown from "react-markdown"
import { useChat } from "@ai-sdk/react"
import { z } from "zod"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  tool,
  type ToolCallPart,
} from "ai"
import { getStore, useAppDispatch, useAppSelector } from "@/redux/store"
import * as ai_assistant_actions from "@/modules/ai_assistant/redux/ai_assistant_actions"
import type {
  AiAssistantMessageEntity,
  AiAssistantMessageTool,
  AiAssistantMessageTools,
} from "../../entities/ai_assistant_messages_entity"
import { AiAssistantChatMessage } from "../ai_assistant_chat_message/ai_assistant_chat_message"
import type { DispatchToolType } from "@/modules/ai_assistant/redux/ai_assistant_actions"

const Footer = memo(
  (props: {
    on_send_message: (content: string) => void
    is_loading: boolean
  }) => {
    const { formatMessage } = useIntl()
    const input_ref = useRef<HTMLInputElement>(null)

    const on_publish = useCallback(() => {
      const value = input_ref.current!.value.trim()
      if (!value) return

      props.on_send_message(value)

      input_ref.current!.value = ""
    }, [props.on_send_message])

    return (
      <div className="border-base-300 mt-auto mb-2 flex gap-2 border-t p-4">
        <input
          className="input input-lg flex-1 resize-none"
          placeholder={formatMessage({
            id: "ai_assistant_chat/input/placeholder",
          })}
          ref={input_ref}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              on_publish()
            }
          }}
        />
        <button
          className="btn btn-primary btn-lg"
          onClick={on_publish}
          disabled={props.is_loading}
        >
          {props.is_loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <SendIcon className="size-5" />
          )}
        </button>
      </div>
    )
  },
)

export const Conversations = (props: {
  messages: AiAssistantMessageEntity[]
  is_loading: boolean
}) => {
  const messages_container_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages_container_ref.current) {
      messages_container_ref.current.scrollTop =
        messages_container_ref.current.scrollHeight
    }
  }, [
    props.messages
      .map((message) => message.content.map((message) => message.text).join(""))
      .join(""),
  ])

  return (
    <div
      ref={messages_container_ref}
      className="flex-1 space-y-8 overflow-y-auto p-4"
    >
      {props.messages.map((message) => (
        <div key={message.id} className="w-full space-y-2">
          {message.content.map((content, index) => (
            <AiAssistantChatMessage
              key={index}
              message={content}
              from={message.role}
            />
          ))}
        </div>
      ))}

      {props.is_loading && (
        <div className="flex justify-start">
          <div className="bg-base-200 text-base-content rounded-lg p-3">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        </div>
      )}
    </div>
  )
}

const Dialog = (props: {
  is_open: boolean
  on_close: () => void
  children: React.ReactNode
}) => {
  const { formatMessage } = useIntl()
  return (
    <dialog className="modal p-4" open={props.is_open} onClose={props.on_close}>
      <div className="modal-box border-base-300 rounded-box bg-base-100 flex h-full !w-full !max-w-2xl flex-col border p-0">
        <div className="border-base-300 flex items-center justify-between gap-2 border-b p-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="fill-primary text-primary-content size-5" />
            <h3 className="text-lg font-semibold">
              {formatMessage({ id: "ai_assistant_chat/title" })}
            </h3>
          </div>
          <button className="btn btn-ghost btn-circle" onClick={props.on_close}>
            <XIcon className="size-5" />
          </button>
        </div>

        {props.children}
      </div>
    </dialog>
  )
}

export function Wrapper() {
  const { messages, status, error, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/ai_assistant/chat",
      body: async () => ({
        deck: getStore().getState().deck_update.deck!,
      }),
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
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
        } as DispatchToolType),
      )
    },
  })

  const messages_to_render = messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.parts
      .map((part, index) => {
        const id = `${message.id}-${index}`

        if (part.type === "text") {
          return {
            id,
            type: "text",
            text: part.text,
          }
        }

        if (part.type.includes("tool-") && "state" in part) {
          return {
            id,
            type: "tool",
            tool_name: part.type.split("-")[1],
            tool_fetching: part.state !== "output-available",
            text: "",
          }
        }

        if (part.type === "step-start") {
          return null
        }

        console.error(`Unknown part type: ${part.type}`)
        console.error(part)

        return {
          id,
          type: "text",
          text: "unknown part type",
        }
      })
      .filter((part) => part !== null),
    timestamp: new Date(),
  }))

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
      <Conversations
        messages={messages_to_render}
        is_loading={status === "submitted"}
      />
      <Footer
        on_send_message={on_send_message}
        is_loading={status === "submitted"}
      />
    </>
  )
}

export const AiAssistantChat = () => {
  const { is_open } = useAppSelector((state) => state.ai_assistant)
  const dispatch = useAppDispatch()

  return (
    <Dialog
      is_open={is_open}
      on_close={() => {
        dispatch(ai_assistant_actions.close())
      }}
    >
      <Wrapper />
    </Dialog>
  )
}
