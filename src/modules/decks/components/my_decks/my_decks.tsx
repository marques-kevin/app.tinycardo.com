import { CheckIcon, EyeIcon, GalleryHorizontalEndIcon } from "lucide-react"
import { DeckActionsDialog } from "@/modules/decks/components/deck_actions_dialog/deck_actions_dialog"
import { connector, type ContainerProps } from "./my_decks.container"
import { DecksProgressRadialChart } from "../decks_progress_radial_chart/decks_progress_radial_chart"

function Deck(props: {
  name: string
  deck_id: string
  back_language: string
  front_language: string
  number_of_cards: number
  number_of_cards_ready_to_be_reviewed: number
  number_of_cards_not_ready_to_be_reviewed: number
  on_click: () => void
}) {
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

          <div>
            <DecksProgressRadialChart
              total={props.number_of_cards}
              mastered={props.number_of_cards_ready_to_be_reviewed}
              size={20}
              thickness={4}
            />
          </div>
        </header>

        <main className="flex h-full items-center justify-center px-4 text-center text-lg font-medium tracking-wider text-balance">
          {props.name}
        </main>

        <footer className="mt-auto grid grid-cols-3 px-4 font-medium">
          <div className="flex items-center justify-start gap-2">
            <div
              className="tooltip tooltip-right flex items-center justify-end gap-2"
              data-tip="Total cards in the deck"
            >
              <div className="flex items-center justify-end gap-2">
                <GalleryHorizontalEndIcon className="size-4" />{" "}
                {props.number_of_cards}
              </div>
            </div>
          </div>

          <div className="text-success flex items-center justify-center gap-2">
            <div
              className="tooltip tooltip-top flex items-center justify-end gap-2"
              data-tip="Cards you do not need to review today"
            >
              <div className="flex items-center justify-end gap-2">
                <CheckIcon className="size-4" />{" "}
                {props.number_of_cards_not_ready_to_be_reviewed}
              </div>
            </div>
          </div>

          <div className="text-info flex items-center justify-end">
            <div
              className="tooltip tooltip-left flex items-center justify-end gap-2"
              data-tip="Total cards need to be reviewed today"
            >
              <EyeIcon className="size-4" />{" "}
              {props.number_of_cards_ready_to_be_reviewed}
            </div>
          </div>
        </footer>
      </div>

      {Array.from({ length: 3 }).map((c, i) => (
        <div key={i} className="border-base-300 card bg-base-100 border-2" />
      ))}
    </div>
  )
}

export function Wrapper(props: ContainerProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {props.decks.map((deck) => (
          <Deck
            key={deck.id}
            name={deck.name}
            deck_id={deck.id}
            back_language={deck.back_language}
            front_language={deck.front_language}
            number_of_cards={props.stats[deck.id]?.number_of_cards || 0}
            number_of_cards_ready_to_be_reviewed={
              props.stats[deck.id]?.number_of_cards_ready_to_be_reviewed || 0
            }
            number_of_cards_not_ready_to_be_reviewed={
              props.stats[deck.id]?.number_of_cards_not_ready_to_be_reviewed ||
              0
            }
            on_click={() => props.on_click(deck.id)}
          />
        ))}
      </div>

      <DeckActionsDialog />
    </>
  )
}

export const MyDecks = connector(Wrapper)
