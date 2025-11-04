import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

const map_state = (state: RootState) => ({
  title: state.deck_update.deck?.name || "",
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (name: DeckEntity["name"]) => {
    dispatch(deck_update_actions.update_field({ name }))
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
