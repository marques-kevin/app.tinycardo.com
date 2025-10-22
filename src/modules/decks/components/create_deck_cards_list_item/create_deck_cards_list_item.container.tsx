import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch, type RootState } from "@/redux/store"
import * as actions from "@/modules/decks/redux/decks_actions"

const mapState = (state: RootState, props: { card_id: string }) => {
  const card = state.decks.create_deck.cards_map[props.card_id]

  return {
    front: card?.front || "",
    back: card?.back || "",
  }
}

const mapDispatch = (dispatch: Dispatch, props: { card_id: string }) => ({
  on_remove: () =>
    dispatch(actions.create_deck_remove_card({ id: props.card_id })),
  on_update: (field: "front" | "back", value: string) =>
    dispatch(
      actions.create_deck_update_card({ id: props.card_id, field, value }),
    ),
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
