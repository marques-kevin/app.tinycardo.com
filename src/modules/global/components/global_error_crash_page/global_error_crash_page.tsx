import { AlertOctagonIcon, RefreshCwIcon } from "lucide-react"
import { useIntl } from "react-intl"
import { GlobalLayout } from "../global_layout/global_layout"

interface GlobalErrorCrashPageProps {
  error?: Error
  resetError?: () => void
}

export function GlobalErrorCrashPage({
  error,
  resetError,
}: GlobalErrorCrashPageProps) {
  const { formatMessage } = useIntl()

  const handleReload = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertOctagonIcon className="text-error size-16" />
        <h1 className="text-3xl font-bold">
          {formatMessage({ id: "global_error_crash_page/title" })}
        </h1>
        <p className="text-base-content/70 text-lg">
          {formatMessage({ id: "global_error_crash_page/description" })}
        </p>
      </div>

      {error && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            {formatMessage({ id: "global_error_crash_page/error_details" })}
          </h2>
          <div className="bg-base-200 border-base-300 rounded-lg border p-4">
            <p className="text-error font-mono text-sm font-semibold">
              {error.message || error.toString()}
            </p>
            {error.stack && (
              <pre className="bg-base-300 border-base-300 mt-4 overflow-auto rounded border p-4 text-xs">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button className="btn btn-primary" onClick={handleReload}>
          <RefreshCwIcon className="size-4" />
          {formatMessage({ id: "global_error_crash_page/reload" })}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => (window.location.href = "/")}
        >
          {formatMessage({ id: "global_error_crash_page/go_home" })}
        </button>
      </div>
    </div>
  )
}
