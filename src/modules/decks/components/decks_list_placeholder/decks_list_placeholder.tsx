import { FolderOpenIcon, PlusIcon, SearchIcon } from "lucide-react"
import { useIntl } from "react-intl"
import { Link } from "react-router-dom"
import {
  connector,
  type ContainerProps,
} from "./decks_list_placeholder.container"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="bg-base-200 border-base-300 rounded-lg border px-4 py-8 text-center lg:p-8 lg:py-16">
      <FolderOpenIcon className="inline-block size-10 lg:size-14" />

      <div className="mt-4 text-balance">
        <div className="text-xl font-bold lg:text-2xl">
          {formatMessage({ id: "decks_list_placeholder/title" })}
        </div>
        <p className="text-base-content/60 lg:text-lg">
          {formatMessage({ id: "decks_list_placeholder/description" })}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/discover/" className="btn lg:btn-lg btn-secondary gap-2">
          <SearchIcon className="size-5" />
          <span>
            {formatMessage({ id: "decks_list_placeholder/discover" })}
          </span>
        </Link>
        <button
          onClick={props.on_create_new_deck}
          className="btn lg:btn-lg btn-primary gap-2"
        >
          <PlusIcon className="size-5" />
          <span>{formatMessage({ id: "decks_list_placeholder/create" })}</span>
        </button>
      </div>
    </div>
  )
}

export const DecksListPlaceholder = connector(Wrapper)
