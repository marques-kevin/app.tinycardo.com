import { CheckIcon, EyeIcon, GalleryHorizontalEndIcon } from "lucide-react"
import { DecksProgressRadialChart } from "@/modules/decks/components/decks_progress_radial_chart/decks_progress_radial_chart"
import {
  connector,
  type ContainerProps,
} from "./deck_details_lessons_list_item.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="stack relative">
      <div className="deck flex aspect-[3/4] cursor-pointer flex-col p-4">
        <div className="flex items-end justify-end">
          <DecksProgressRadialChart
            total={props.number_of_cards}
            mastered={props.number_of_cards_ready_to_be_reviewed}
            size={20}
            thickness={4}
          />
        </div>

        <h3 className="flex h-full w-full items-center justify-center text-center text-lg font-medium tracking-wider">
          {props.name}
        </h3>

        <footer className="mt-auto flex items-center justify-between gap-2 text-sm font-medium">
          <div className="flex items-center gap-1">
            <GalleryHorizontalEndIcon className="size-4" />
            <span>{props.number_of_cards}</span>
          </div>

          <div className="text-success flex items-center justify-center gap-2">
            <div className="flex items-center justify-end gap-1">
              <CheckIcon className="size-4" />
              <span>{props.number_of_cards_ready_to_be_reviewed}</span>
            </div>
          </div>

          <div className="text-info flex items-center justify-end gap-1">
            <EyeIcon className="size-4" />
            <span>{props.number_of_cards_not_ready_to_be_reviewed}</span>
          </div>
        </footer>
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="border-base-300 card bg-base-100 border-2" />
      ))}
    </div>
  )
}

export const DeckDetailsLessonsListItem = connector(Wrapper)
