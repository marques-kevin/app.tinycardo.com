import { useIntl } from "react-intl"
import {
  CircleCheckIcon,
  OctagonXIcon,
  TriangleAlertIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react"
import type { MessageI18nKeys } from "@/intl"

export function GlobalToast(props: {
  title: MessageI18nKeys
  description?: MessageI18nKeys
  type?: "success" | "error" | "warning" | "info" | "loading"
}) {
  const { title, description, type } = props
  const { formatMessage } = useIntl()

  return (
    <div className="bg-base-100 border-base-300 text-base-content rounded-box border p-4 font-sans shadow-xl">
      <div className="flex gap-2">
        <div className="mt-0.5">
          {type === "success" && <CircleCheckIcon className="size-5" />}
          {type === "error" && <OctagonXIcon className="size-5" />}
          {type === "warning" && <TriangleAlertIcon className="size-5" />}
          {type === "info" && <InfoIcon className="size-5" />}
          {type === "loading" && (
            <Loader2Icon className="size-5 animate-spin" />
          )}
        </div>

        <div>
          <p className="font-medium">{formatMessage({ id: title })}</p>
          {description && (
            <p className="text-base-content/80 text-sm">
              {formatMessage({ id: description })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
