import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import { go_on_session_page } from "@/modules/sessions/redux/sessions_actions"
import {
  go_on_update_deck_page,
  delete_deck,
} from "@/modules/decks/redux/decks_actions"
import type { SessionsState } from "@/modules/sessions/redux/sessions_reducers"

function mapState(state: RootState) {
  return {
    deck_id: state.decks_details.deck?.id,
    description: state.decks_details.deck?.description,
    name: state.decks_details.deck?.name,
    number_of_cards: state.decks_details.deck?.number_of_cards,
    updated_at: state.decks_details.deck?.updated_at,
    is_user_owner:
      state.decks_details.deck?.user_id === state.authentication.user?.id,
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    on_start_session: (params: {
      deck_id: string
      mode: SessionsState["mode"]
    }) => {
      dispatch(go_on_session_page(params))
    },
    on_edit: (deck_id: string) => {
      dispatch(go_on_update_deck_page({ deck_id }))
    },
    on_delete: (deck_id: string) => {
      dispatch(delete_deck({ deck_id }))
    },
  }
}

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
