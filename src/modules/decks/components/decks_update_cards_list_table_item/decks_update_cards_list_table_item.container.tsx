import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "@/modules/decks/redux/decks_actions"

const mapState = (state: RootState, props: { card_id: string }) => {
  const card = state.decks.update.cards_map[props.card_id]
  const is_selected = state.decks.update.selected_cards.includes(props.card_id)

  return {
    front: card?.front || "",
    back: card?.back || "",
    card_id: props.card_id,
    is_selected,
    autofocus: props.card_id === state.decks.update.autofocus_card_id,
  }
}

const mapDispatch = (dispatch: Dispatch, props: { card_id: string }) => ({
  on_remove() {
    dispatch(actions.create_deck_remove_card({ id: props.card_id }))
  },
  on_update(field: "front" | "back", value: string) {
    dispatch(
      actions.create_deck_update_card({ id: props.card_id, field, value }),
    )
  },
  on_toggle_select() {
    dispatch(actions.update_deck_toggle_select_card({ card_id: props.card_id }))
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
