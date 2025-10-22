import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@/redux/store"
import { GlobalNavbar } from "@/modules/global/components/global_navbar/global_navbar"
import { emoji_flags } from "@/modules/decks/utils/emoji_flags"
import { DeckCardsTab } from "@/modules/decks/components/deck_cards_tab/deck_cards_tab"
import { DeckParamsTab } from "@/modules/decks/components/deck_params_tab/deck_params_tab"

export function DeckDetailsPage() {
  const { deck_id } = useParams<{ deck_id: string }>()
  const navigate = useNavigate()
  const [active_tab, set_active_tab] = useState<"cards" | "params">("cards")

  const { decks, stats } = useAppSelector((state) => state.decks)
  const deck = decks.find((d) => d.id === deck_id)
  const deck_stats = deck ? stats[deck.id] : null

  if (!deck) {
    return (
      <>
        <GlobalNavbar />
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <button className="btn btn-ghost" onClick={() => navigate("/")}>
              ← Back to decks
            </button>
          </div>
          <div className="py-10 text-center">
            <h1 className="mb-2 text-2xl font-bold">Deck not found</h1>
            <p className="text-base-content/60">
              The deck you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <GlobalNavbar />
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <button className="btn btn-ghost" onClick={() => navigate("/")}>
            ← Back to decks
          </button>
        </div>

        {/* Deck Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-2xl">{emoji_flags[deck.front_language]}</span>
            <h1 className="text-2xl font-bold">{deck.name}</h1>
            <span className="text-2xl">{emoji_flags[deck.back_language]}</span>
          </div>

          {deck_stats && (
            <div className="text-base-content/60 text-sm">
              <div className="flex gap-4">
                <span>Total cards: {deck_stats.number_of_cards}</span>
                <span>
                  Ready to review:{" "}
                  {deck_stats.number_of_cards_ready_to_be_reviewed}
                </span>
                <span>
                  Not ready:{" "}
                  {deck_stats.number_of_cards_not_ready_to_be_reviewed}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${active_tab === "cards" ? "tab-active" : ""}`}
            onClick={() => set_active_tab("cards")}
          >
            Cards
          </button>
          <button
            className={`tab ${active_tab === "params" ? "tab-active" : ""}`}
            onClick={() => set_active_tab("params")}
          >
            Parameters
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {active_tab === "cards" && <DeckCardsTab deck_id={deck_id!} />}
          {active_tab === "params" && <DeckParamsTab deck={deck} />}
        </div>
      </div>
    </>
  )
}

