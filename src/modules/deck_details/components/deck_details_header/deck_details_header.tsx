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

export function Wrapper(props: ContainerProps) {
  return (
    <header className="space-y-4 py-8">
      <div>
        <h1 className="text-4xl font-bold">{props.name}</h1>
        <p className="text-base-content/80 max-w-prose text-xl text-balance">
          Ce paquet de cartes est destiné à apprendre les bases du coréen. Il
          est divisé en plusieurs leçons, allant de facile à difficile.
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
          <span>2 days ago</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="btn btn-lg btn-primary"
          onClick={() =>
            props.on_start_session({ deck_id: props.deck_id!, mode: "review" })
          }
        >
          <PlayIcon className="size-4" />
          Faire une session
        </button>

        <div className="dropdown">
          <button role="button" className="btn btn-lg btn-ghost btn-circle">
            <EllipsisIcon />
          </button>

          <ul className="menu menu-lg dropdown-content bg-base-100 rounded-box border-base-300 z-1 w-96 border p-2 shadow-sm">
            <li>
              <button
                onClick={() => {
                  props.on_start_session({
                    deck_id: props.deck_id!,
                    mode: "learn_new_words",
                  })
                }}
              >
                <PlayIcon className="size-4" /> Apprendre de nouvelles cartes
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  props.on_start_session({
                    deck_id: props.deck_id!,
                    mode: "randomized",
                  })
                }
              >
                <ShuffleIcon className="size-4" /> Session aléatoire
              </button>
            </li>
            <hr className="border-base-300 my-2" />
            <li>
              <a>
                <CopyIcon className="size-4" /> Dupliquer
              </a>
              {props.is_user_owner && (
                <>
                  <a onClick={() => props.on_edit(props.deck_id!)}>
                    <PencilIcon className="size-4" /> Modifier
                  </a>
                  <a onClick={() => props.on_delete(props.deck_id!)}>
                    <TrashIcon className="size-4" /> Supprimer
                  </a>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export const DeckDetailsHeader = connector(Wrapper)
