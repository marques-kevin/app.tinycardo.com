import { DiscoverDecksListItem } from "../discover_decks_list_item/discover_decks_list_item"
import { connector, type ContainerProps } from "./discover_decks_list.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {props.decks.map((deck) => (
        <DiscoverDecksListItem key={deck.id} {...deck} />
      ))}
    </div>
  )
}

export const DiscoverDecksList = connector(Wrapper)
