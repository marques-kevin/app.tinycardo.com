import { useState } from "react"
import { CheckCircleIcon, SendIcon, SparklesIcon, XIcon } from "lucide-react"
import { useIntl } from "react-intl"
import ReactMarkdown from "react-markdown"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: Array<{
    type: string
    payload: unknown
    description: string
  }>
}

type Props = {
  messages?: Message[]
  is_loading?: boolean
  on_send_message?: (message: string) => void
}

export function Wrapper(props: Props) {
  const { formatMessage } = useIntl()
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim() || props.is_loading) return
    props.on_send_message?.(input.trim())
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const messages = props.messages || []

  return (
    <div className="flex h-screen flex-col p-4">
      <div className="border-base-300 rounded-box bg-base-100 flex h-full flex-col border">
        {/* Header */}
        <div className="border-base-300 flex items-center justify-between gap-2 border-b p-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="fill-primary text-primary-content size-5" />
            <h3 className="text-lg font-semibold">
              {formatMessage({ id: "ai_assistant_chat/title" })}
            </h3>
          </div>
          <button className="btn btn-ghost btn-circle">
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "user" && (
                  <div
                    className={`rounded-box bg-base-300 text-base-content max-w-[80%] p-3`}
                  >
                    <p className="prose prose-lg">{message.content}</p>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className={`max-w-[80%]`}>
                    <p className="prose prose-lg">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </p>
                  </div>
                )}
              </div>

              {/* Actions proposées par l'IA */}
              {message.role === "assistant" &&
                message.actions &&
                message.actions.length > 0 && (
                  <div className="">
                    {message.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 opacity-50"
                      >
                        <CheckCircleIcon className="text-success size-4" />
                        <span>{action.description}</span>
                      </div>
                    ))}
                  </div>
                )}
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

        {/* Input area */}
        <div className="border-base-300 mt-auto mb-2 flex gap-2 border-t p-4">
          <input
            className="input input-lg flex-1 resize-none"
            placeholder={formatMessage({
              id: "ai_assistant_chat/input/placeholder",
            })}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={props.is_loading}
          />
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSend}
            disabled={props.is_loading}
          >
            {props.is_loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <SendIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export const AiAssistantChat = Wrapper
