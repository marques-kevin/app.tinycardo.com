import { DeckActionsDialog } from "@/modules/decks/components/deck_actions_dialog/deck_actions_dialog"
import { connector, type ContainerProps } from "./my_decks.container"
import { DecksDeck } from "@/modules/decks/components/decks_deck/decks_deck"

export function Wrapper(props: ContainerProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {props.decks.map((deck) => (
          <DecksDeck
            key={deck.id}
            name={deck.name}
            deck_id={deck.id}
            back_language={deck.back_language}
            front_language={deck.front_language}
            number_of_cards={props.stats[deck.id]?.number_of_cards ?? 0}
            number_of_cards_ready_to_be_reviewed={
              props.stats[deck.id]?.number_of_cards_ready_to_be_reviewed
            }
            number_of_cards_not_ready_to_be_reviewed={
              props.stats[deck.id]?.number_of_cards_not_ready_to_be_reviewed
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
