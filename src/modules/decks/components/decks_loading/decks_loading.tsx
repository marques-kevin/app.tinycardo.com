import type { ContainerProps } from "./decks_loading.container"
import { connector } from "./decks_loading.container"
import { useIntl } from "react-intl"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  if (!props.is_fetching) {
    return <>{props.children}</>
  }

  return (
    <div className="flex items-center justify-center py-40">
      <div className="space-y-4 text-center">
        <div className="loading loading-xl loading-spinner inline-block" />
        <div className="text-lg font-medium">
          {formatMessage({ id: "decks_loading/loading" })}
        </div>
      </div>
    </div>
  )
}

export const DecksLoading = connector(Wrapper)
