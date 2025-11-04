import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const mapState = (state: RootState, props: { card_id: string }) => {
  const card = state.deck_update.cards_map[props.card_id]
  const is_selected = state.deck_update.selected_cards.includes(props.card_id)

  return {
    front: card?.front || "",
    back: card?.back || "",
    card_id: props.card_id,
    is_selected,
  }
}

const mapDispatch = (dispatch: Dispatch, props: { card_id: string }) => ({
  on_update(field: "front" | "back", value: string) {
    dispatch(
      deck_update_actions._draft_update_card({
        id: props.card_id,
        field,
        value,
      }),
    )
  },
  on_toggle_select() {
    dispatch(
      deck_update_actions.toggle_select_card({
        card_id: props.card_id,
      }),
    )
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
