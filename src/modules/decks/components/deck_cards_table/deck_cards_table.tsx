import {
  connector,
  type ContainerProps,
} from "@/modules/decks/components/deck_cards_table/deck_cards_table.container"

export function Wrapper(props: ContainerProps) {
  const { cards, is_fetching } = props

  if (is_fetching) {
    return <div className="text-sm text-muted-foreground">Loading cards…</div>
  }

  if (!cards || cards.length === 0) {
    return <div className="text-sm text-muted-foreground">No cards found.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Front</th>
            <th>Back</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id}>
              <td className="font-medium">{card.front}</td>
              <td>{card.back}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const DeckCardsTable = connector(Wrapper)
