import { useRef, memo, useCallback } from "react"
import { SendIcon } from "lucide-react"
import { useIntl } from "react-intl"

export const AiAssistantChatFooter = memo(
  (props: {
    on_send_message: (content: string) => void
    is_loading: boolean
  }) => {
    const { formatMessage } = useIntl()
    const input_ref = useRef<HTMLInputElement>(null)

    const on_send_message = useCallback(() => {
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
            id: "ai_assistant_chat_footer/input/placeholder",
          })}
          ref={input_ref}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              on_send_message()
            }
          }}
        />
        <button
          className="btn btn-primary btn-lg"
          onClick={on_send_message}
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
