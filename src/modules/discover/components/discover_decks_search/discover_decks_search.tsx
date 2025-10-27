import { connector } from "./discover_decks_search.container"

export function Wrapper() {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Rechercher un deck"
        className="input input-lg w-full"
      />
      <button className="btn btn-lg btn-secondary">Search</button>
    </div>
  )
}

export const DiscoverDecksSearch = connector(Wrapper)
