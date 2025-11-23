import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"

const mapState = (state: RootState, props: { card_id: string }) => {
  const card = state.deck_update.cards_map[props.card_id]
  const is_selected = state.deck_update.selected_cards.includes(props.card_id)
  const is_translating =
    state.deck_update.ai.cards_that_are_being_generated_by_ai.includes(
      props.card_id,
    )

  return {
    front: card?.front || "",
    back: card?.back || "",
    card_id: props.card_id,
    is_selected,
    is_translating,
  }
}

const mapDispatch = (dispatch: Dispatch, props: { card_id: string }) => ({
  on_update(field: "front" | "back", value: string) {
    dispatch(
      deck_update_actions.update_card({
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
  on_translate_card() {
    dispatch(
      deck_update_actions.translate_card_with_ai({
        card_id: props.card_id,
      }),
    )
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
