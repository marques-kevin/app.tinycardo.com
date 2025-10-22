import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import { useAppSelector, useAppDispatch } from "@/redux/store"
import { CheckIcon, EyeIcon, GalleryHorizontalEndIcon } from "lucide-react"
import { _open_deck_actions_dialog } from "@/modules/decks/redux/decks_actions"
import { DeckActionsDialog } from "@/modules/decks/components/deck_actions_dialog/deck_actions_dialog"

function Deck(props: {
  name: string
  deck_id: string
  back_language: string
  front_language: string
  number_of_cards: number
  number_of_cards_ready_to_be_reviewed: number
  number_of_cards_not_ready_to_be_reviewed: number
}) {
  const dispatch = useAppDispatch()

  const handleCardClick = () => {
    dispatch(
      _open_deck_actions_dialog({
        deck: {
          id: props.deck_id,
          name: props.name,
          front_language: props.front_language,
          back_language: props.back_language,
          number_of_cards: props.number_of_cards,
          number_of_cards_ready_to_be_reviewed:
            props.number_of_cards_ready_to_be_reviewed,
          number_of_cards_not_ready_to_be_reviewed:
            props.number_of_cards_not_ready_to_be_reviewed,
        },
      }),
    )
  }

  return (
    <div className="stack">
      <div
        onClick={handleCardClick}
        className="border-base-300 card bg-base-100 flex h-[300px] cursor-pointer flex-col border py-4"
      >
        <header className="flex justify-between px-4">
          <span className="text-lg font-bold">
            {emoji_flags[props.front_language]}
          </span>
          <span className="text-lg font-bold">
            {emoji_flags[props.back_language]}
          </span>
        </header>

        <main className="flex h-full items-center justify-center text-center text-lg font-bold">
          {props.name}
        </main>

        <footer className="grid grid-cols-3 px-4 text-sm">
          <div className="mt-auto flex items-center justify-start gap-2">
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
        <div key={i} className="border-base-300 card bg-base-100 border" />
      ))}
    </div>
  )
}

export function MyDecks() {
  const { decks: downloaded_decks, stats: downloaded_decks_stats } =
    useAppSelector((state) => state.decks)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {downloaded_decks.map((deck) => (
          <Deck
            key={deck.id}
            name={deck.name}
            deck_id={deck.id}
            back_language={deck.front_language}
            front_language={deck.back_language}
            number_of_cards={
              downloaded_decks_stats[deck.id]?.number_of_cards || 0
            }
            number_of_cards_ready_to_be_reviewed={
              downloaded_decks_stats[deck.id]
                ?.number_of_cards_ready_to_be_reviewed || 0
            }
            number_of_cards_not_ready_to_be_reviewed={
              downloaded_decks_stats[deck.id]
                ?.number_of_cards_not_ready_to_be_reviewed || 0
            }
          />
        ))}
      </div>

      <DeckActionsDialog />
    </>
  )
}
