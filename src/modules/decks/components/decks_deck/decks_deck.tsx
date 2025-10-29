import {
  GalleryHorizontalEndIcon,
  CheckIcon,
  EyeIcon,
  UsersIcon,
} from "lucide-react"
import { DecksProgressRadialChart } from "@/modules/decks/components/decks_progress_radial_chart/decks_progress_radial_chart"
import { cn } from "@/lib/utils"
import { big_number_formatter } from "@/modules/global/utils/big_number_formatter"
import { useIntl } from "react-intl"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

export function DecksDeck(
  props: DeckEntity & {
    on_click: () => void
    number_of_users_using_this_deck?: number
  },
) {
  const { locale } = useIntl()
  const should_show_progress =
    props.number_of_cards_ready_to_be_reviewed !== undefined

  const should_show_number_of_users_using_this_deck =
    props.number_of_users_using_this_deck !== undefined

  return (
    <div className="stack">
      <div
        onClick={props.on_click}
        className="deck flex aspect-[3/4] cursor-pointer flex-col py-4"
      >
        <header className="flex items-center justify-between px-4">
          <div className="avatar-group -space-x-2">
            <div className="avatar">
              <div className="w-6">
                <img src={`/flags/${props.front_language}.svg`} />
              </div>
            </div>

            <div className="avatar">
              <div className="w-6">
                <img src={`/flags/${props.back_language}.svg`} />
              </div>
            </div>
          </div>

          {should_show_progress && (
            <div>
              <DecksProgressRadialChart
                total={props.number_of_cards}
                mastered={props.number_of_cards_not_ready_to_be_reviewed ?? 0}
                size={20}
                thickness={4}
              />
            </div>
          )}
        </header>

        <main className="flex h-full items-center justify-center px-4 text-center text-lg font-medium tracking-wider text-balance">
          {props.name}
        </main>

        <footer
          className={cn(
            "mt-auto grid grid-cols-3 px-4 font-medium",
            should_show_progress && "grid-cols-3",
            should_show_number_of_users_using_this_deck && "grid-cols-2",
          )}
        >
          <div className="flex items-center justify-start gap-1">
            <GalleryHorizontalEndIcon className="size-4" />
            <span>{props.number_of_cards}</span>
          </div>

          {should_show_progress && (
            <div className="text-success flex items-center justify-center gap-1">
              <CheckIcon className="size-4" />
              <span>{props.number_of_cards_not_ready_to_be_reviewed}</span>
            </div>
          )}

          {should_show_progress && (
            <div className="text-info flex items-center justify-end gap-1">
              <EyeIcon className="size-4" />
              <span>{props.number_of_cards_ready_to_be_reviewed}</span>
            </div>
          )}

          {should_show_number_of_users_using_this_deck && (
            <div className="flex items-center justify-end gap-1">
              <UsersIcon className="size-4" />
              <span>
                {big_number_formatter({
                  value: props.number_of_users_using_this_deck ?? 0,
                  digits: 0,
                  locale,
                })}
              </span>
            </div>
          )}
        </footer>
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-base-300 card bg-base-100 border-2" />
      ))}
    </div>
  )
}
