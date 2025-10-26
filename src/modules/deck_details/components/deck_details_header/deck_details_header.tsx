import { big_number_formatter } from "@/modules/global/utils/big_number_formatter"
import { connector, type ContainerProps } from "./deck_details_header.container"
import {
  GalleryHorizontalEndIcon,
  UsersIcon,
  UserIcon,
  PlayIcon,
  CalendarIcon,
  EllipsisIcon,
  TrashIcon,
  ShuffleIcon,
  PencilIcon,
  CopyIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/shadcn/dropdown-menu"
import { useIntl } from "react-intl"
import { dayjs } from "@/lib/date"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()
  return (
    <header className="space-y-4 py-8">
      <div>
        <h1 className="text-4xl font-bold">{props.name}</h1>
        <p className="text-base-content/80 max-w-prose text-xl text-balance">
          {props.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="badge badge-xl badge-accent badge-soft">
          <GalleryHorizontalEndIcon className="size-4" />
          <span>{props.number_of_cards}</span>
        </div>
        <div className="badge badge-lg badge-accent badge-soft">
          <UsersIcon className="size-4" />
          <span>
            {big_number_formatter({
              value: 357098,
              digits: 0,
            })}
          </span>
        </div>
        <div className="badge badge-lg badge-accent badge-soft">
          <UserIcon className="size-4" />
          <span>@michel876</span>
        </div>
        <div className="badge badge-lg badge-accent badge-soft">
          <CalendarIcon className="size-4" />
          <span>
            {formatMessage(
              { id: "deck_details_header/updated_at" },
              {
                updated_at: dayjs(props.updated_at).fromNow(),
              },
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 md:justify-start">
        <button
          className="btn btn-lg btn-primary"
          onClick={() =>
            props.on_start_session({ deck_id: props.deck_id!, mode: "review" })
          }
        >
          <PlayIcon className="size-4" />
          <span>
            {formatMessage({ id: "deck_details_header/start_session" })}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="btn btn-lg btn-ghost btn-circle">
            <EllipsisIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-base-100 rounded-box border-base-300 border p-2 shadow-sm">
            <DropdownMenuItem
              className="text-lg"
              onClick={() => {
                props.on_start_session({
                  deck_id: props.deck_id!,
                  mode: "learn_new_words",
                })
              }}
            >
              <PlayIcon />
              <span>
                {formatMessage({ id: "deck_details_header/learn_new_cards" })}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-lg"
              onClick={() => {
                props.on_start_session({
                  deck_id: props.deck_id!,
                  mode: "randomized",
                })
              }}
            >
              <ShuffleIcon />
              <span>
                {formatMessage({ id: "deck_details_header/random_session" })}
              </span>
            </DropdownMenuItem>
            <hr className="border-base-300 my-2" />

            <DropdownMenuItem
              className="text-lg"
              onClick={() => {
                props.on_duplicate(props.deck_id!)
              }}
            >
              <CopyIcon className="size-4" />
              <span>
                {formatMessage({ id: "deck_details_header/duplicate" })}
              </span>
            </DropdownMenuItem>

            {props.is_user_owner && (
              <>
                <DropdownMenuItem
                  className="text-lg"
                  onClick={() => {
                    props.on_edit(props.deck_id!)
                  }}
                >
                  <PencilIcon className="size-4" />
                  <span>
                    {formatMessage({ id: "deck_details_header/edit" })}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-lg"
                  onClick={() => {
                    props.on_delete(props.deck_id!)
                  }}
                >
                  <TrashIcon className="size-4" />
                  <span>
                    {formatMessage({ id: "deck_details_header/delete" })}
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export const DeckDetailsHeader = connector(Wrapper)
