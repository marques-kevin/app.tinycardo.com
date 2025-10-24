import { big_number_formatter } from "@/modules/global/utils/big_number_formatter"
import { connector, type ContainerProps } from "./deck_details_header.container"
import {
  GalleryHorizontalEndIcon,
  UsersIcon,
  UserIcon,
  PlayIcon,
  CalendarIcon,
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
        <button className="btn btn-lg btn-primary">
          <PlayIcon className="size-4" />
          Commencer à apprendre
        </button>

        <button className="btn btn-lg btn-ghost">Modifier</button>
      </div>
    </header>
  )
}

export const DeckDetailsHeader = connector(Wrapper)
