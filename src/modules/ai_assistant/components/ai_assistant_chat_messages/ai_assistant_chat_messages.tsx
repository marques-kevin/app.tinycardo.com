import { useEffect, useRef } from "react"
import type { AiAssistantMessageEntity } from "@/modules/ai_assistant/entities/ai_assistant_messages_entity"
import { AiAssistantChatMessage } from "@/modules/ai_assistant/components/ai_assistant_chat_message/ai_assistant_chat_message"

export const AiAssistantChatMessages = (props: {
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
      .flatMap((message) => message.content.map((message) => message.text))
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
              role={message.role}
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
