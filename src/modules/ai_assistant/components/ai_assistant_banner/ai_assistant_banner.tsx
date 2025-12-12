import { SparklesIcon } from "lucide-react"
import {
  connector,
  type ContainerProps,
} from "@/modules/ai_assistant/components/ai_assistant_banner/ai_assistant_banner.container"
import { useIntl } from "react-intl"

export const Wrapper = (props: ContainerProps) => {
  const { formatMessage } = useIntl()
  return (
    <div role="alert" className="card card-lg border-base-300 border-2">
      <div className="card-body">
        <SparklesIcon className="fill-primary text-primary-content size-6" />

        <div>
          <h3 className="card-title">
            {formatMessage({ id: "ai_assistant_banner/title" })}
          </h3>

          <div>{formatMessage({ id: "ai_assistant_banner/description" })}</div>
        </div>

        <div>
          <button
            className="btn btn-lg btn-primary mt-4"
            onClick={props.on_open}
          >
            {formatMessage({ id: "ai_assistant_banner/button" })}
          </button>
        </div>
      </div>
    </div>
  )
}

export const AiAssistantBanner = connector(Wrapper)
