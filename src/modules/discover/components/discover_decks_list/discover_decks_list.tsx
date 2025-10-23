import { DiscoverDecksListItem } from "../discover_decks_list_item/discover_decks_list_item"
import { connector, type ContainerProps } from "./discover_decks_list.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.decks.map((deck) => (
        <DiscoverDecksListItem key={deck.id} {...deck} />
      ))}
    </div>
  )
}

export const DiscoverDecksList = connector(Wrapper)
