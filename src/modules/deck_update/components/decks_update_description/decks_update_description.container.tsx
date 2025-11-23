import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

const map_state = (state: RootState) => ({
  description: state.deck_update.deck?.description || "",
  is_updating_description_with_ai:
    state.deck_update.is_updating_description_with_ai,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (description: DeckEntity["description"]) => {
    dispatch(deck_update_actions.update_field({ description }))
  },
  on_update_description_with_ai: () => {
    dispatch(deck_update_actions.update_description_with_ai())
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
