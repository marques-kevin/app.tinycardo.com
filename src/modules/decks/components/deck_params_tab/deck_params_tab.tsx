import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

interface DeckParamsTabProps {
  deck: DeckEntity
}

export function DeckParamsTab({ deck }: DeckParamsTabProps) {
  const navigate = useNavigate()
  const [show_delete_confirmation, set_show_delete_confirmation] =
    useState(false)

  const handle_delete_deck = async () => {
    navigate("/")
  }

  return (
    <div className="space-y-6">
      {/* Deck Information */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Deck Information</h3>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Name:</span> {deck.name}
            </div>
            <div>
              <span className="font-semibold">Languages:</span>{" "}
              {deck.front_language} → {deck.back_language}
            </div>
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {deck.created_at.toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Last updated:</span>{" "}
              {deck.updated_at.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Actions</h3>
          <div className="space-y-4">
            <button
              className="btn btn-outline btn-warning"
              onClick={() => set_show_delete_confirmation(true)}
            >
              Clear Learning History
            </button>

            <button
              className="btn btn-outline btn-error"
              onClick={() => set_show_delete_confirmation(true)}
            >
              Delete Deck
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {show_delete_confirmation && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">Confirm Action</h3>
            <p className="mb-4">
              Are you sure you want to delete this deck? This action cannot be
              undone. All cards and learning history will be permanently
              removed.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => set_show_delete_confirmation(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  handle_delete_deck()
                  set_show_delete_confirmation(false)
                }}
              >
                Delete Deck
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => set_show_delete_confirmation(false)}>
              close
            </button>
          </form>
        </dialog>
      )}
    </div>
  )
}
