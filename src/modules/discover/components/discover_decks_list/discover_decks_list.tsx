import { DecksDeck } from "@/modules/decks/components/decks_deck/decks_deck"
import { connector, type ContainerProps } from "./discover_decks_list.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.decks.map((deck) => (
        <DecksDeck
          key={deck.id}
          name={deck.name}
          deck_id={deck.id}
          back_language={deck.back_language}
          front_language={deck.front_language}
          number_of_cards={deck.number_of_cards_in_the_deck}
          number_of_users_using_this_deck={deck.number_of_users_using_this_deck}
          on_click={() => props.on_view_deck(deck.id)}
        />
      ))}
    </div>
  )
}

export const DiscoverDecksList = connector(Wrapper)
