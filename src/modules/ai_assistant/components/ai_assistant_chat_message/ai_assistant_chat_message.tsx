import { memo } from "react"
import ReactMarkdown from "react-markdown"
import { Loader2Icon, CheckCircleIcon } from "lucide-react"
import type { AiAssistantMessageContent } from "../../entities/ai_assistant_messages_entity"
import { useIntl } from "react-intl"

export const AiAssistantChatMessage = memo(
  (props: {
    message: AiAssistantMessageContent
    from: "user" | "assistant"
  }) => {
    const { formatMessage } = useIntl()

    return (
      <>
        {props.from === "user" && (
          <div className="flex justify-end">
            <div
              className={`rounded-box bg-base-300 text-base-content inline-block p-3 px-4`}
            >
              <p className="prose prose-lg">{props.message.text}</p>
            </div>
          </div>
        )}

        {props.from === "assistant" && props.message.type === "text" && (
          <div className="prose prose-lg text-base-content">
            <ReactMarkdown>{props.message.text}</ReactMarkdown>
          </div>
        )}

        {props.message.type === "tool" && (
          <div>
            <div className="bg-base-200 text-base-content/80 inline-flex items-center gap-2 rounded-lg p-2 text-sm">
              {props.message.tool_fetching ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <CheckCircleIcon className="text-success size-4" />
              )}
              <span>
                {formatMessage({
                  id: `ai_assistant_chat_message/tools/${props.message.tool_name}`,
                })}
              </span>
            </div>
          </div>
        )}
      </>
    )
  },
  (prevProps, nextProps) => prevProps.message === nextProps.message,
)
