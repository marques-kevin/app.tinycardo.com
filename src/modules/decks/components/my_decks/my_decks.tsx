import { connector, type ContainerProps } from "./my_decks.container"
import { DecksDeck } from "@/modules/decks/components/decks_deck/decks_deck"

export function Wrapper(props: ContainerProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {props.decks.map((deck) => (
          <DecksDeck
            key={deck.id}
            {...deck}
            on_click={() => props.on_click(deck.id)}
          />
        ))}
      </div>
    </>
  )
}

export const MyDecks = connector(Wrapper)
