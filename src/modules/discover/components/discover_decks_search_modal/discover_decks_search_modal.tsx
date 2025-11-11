import { type FormEvent, useState } from "react"
import { useIntl } from "react-intl"
import { Search, XIcon } from "lucide-react"
import { GlobalModal } from "@/modules/global/components/global_modal/global_modal"
import {
  connector,
  type ContainerProps,
} from "@/modules/discover/components/discover_decks_search_modal/discover_decks_search_modal.container"
import { cn } from "@/lib/utils"

const form_id = "discover-decks-search-modal-form"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  const [is_open, set_is_open] = useState(false)
  const [local_query, set_local_query] = useState(props.title_query)

  const open_modal = () => {
    set_local_query(props.title_query)
    set_is_open(true)
  }

  const close_modal = () => {
    set_is_open(false)
  }

  const on_submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    props.on_submit(local_query.trim())
    set_is_open(false)
  }

  const has_query = props.title_query.trim().length > 0

  return (
    <>
      <button
        type="button"
        className={cn(
          "btn btn-lg btn-secondary",
          has_query && "pr-0",
          !has_query && "btn-circle",
        )}
        onClick={open_modal}
      >
        <Search className="size-5" />
        {has_query && <span>{props.title_query.trim()}</span>}
        {has_query && (
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={(e) => {
              e.stopPropagation()
              set_local_query("")
              props.on_submit("")
            }}
          >
            <XIcon className="size-5" />
          </button>
        )}
      </button>

      <GlobalModal
        icon={Search}
        title={formatMessage({ id: "discover_decks_search_modal/modal_title" })}
        description={formatMessage({
          id: "discover_decks_search_modal/modal_description",
        })}
        is_open={is_open}
        on_close={close_modal}
        actions={
          <button
            type="submit"
            form={form_id}
            className="btn btn-lg btn-primary"
          >
            {formatMessage({ id: "discover_decks_search_modal/modal_submit" })}
          </button>
        }
      >
        <form id={form_id} className="space-y-6" onSubmit={on_submit}>
          <label className="form-control w-full space-y-2">
            <input
              type="text"
              className="input input-bordered input-lg w-full"
              value={local_query}
              onChange={(event) => set_local_query(event.target.value)}
              placeholder={formatMessage({
                id: "discover_decks_search_modal/modal_input_placeholder",
              })}
            />
          </label>
        </form>
      </GlobalModal>
    </>
  )
}

export const DiscoverDecksSearchModal = connector(Wrapper)
