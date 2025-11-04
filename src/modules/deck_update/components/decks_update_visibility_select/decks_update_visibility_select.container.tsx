import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"
import * as deck_update_actions from "@/modules/deck_update/redux/deck_update_actions"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"

const map_state = (state: RootState) => ({
  visibility: state.deck_update.deck?.visibility || "private",
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_change: (visibility: DeckEntity["visibility"]) => {
    dispatch(
      deck_update_actions.update_field({
        visibility,
      }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
