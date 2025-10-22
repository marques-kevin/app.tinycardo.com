import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/store"
import { fetch_cards } from "@/modules/decks/redux/decks_actions"

interface DeckCardsTabProps {
  deck_id: string
}

export function DeckCardsTab({ deck_id }: DeckCardsTabProps) {
  const dispatch = useAppDispatch()
  const cards = useAppSelector((state) => state.decks.cards[deck_id] || [])
  const is_fetching = useAppSelector(
    (state) => state.decks.fetching.fetching_cards,
  )

  useEffect(() => {
    dispatch(fetch_cards({ deck_id }))
  }, [dispatch, deck_id])

  if (is_fetching) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="loading loading-spinner loading-md" />
      </div>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="mb-2 text-lg font-semibold">No cards found</h3>
        <p className="text-base-content/60">
          This deck doesn't have any cards yet.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table">
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
