import { connect, type ConnectedProps } from "react-redux"
import type { Dispatch, RootState } from "@/redux/store"
import { go_on_session_page } from "@/modules/sessions/redux/sessions_actions"
import {
  go_on_update_deck_page,
  delete_deck,
  duplicate_deck,
} from "@/modules/decks/redux/decks_actions"
import type { SessionsState } from "@/modules/sessions/redux/sessions_reducers"

function map_state(state: RootState) {
  return {
    deck_id: state.decks_details.deck?.id,
    description: state.decks_details.deck?.description,
    name: state.decks_details.deck?.name,
    number_of_cards: state.decks_details.deck?.number_of_cards,
    updated_at: state.decks_details.deck?.updated_at,
    number_of_users_using_this_deck:
      state.decks_details.deck?.number_of_users_using_this_deck,
    is_user_owner:
      state.decks_details.deck?.user_id === state.authentication.user?.id,
  }
}

function map_dispatch(dispatch: Dispatch) {
  return {
    on_start_session: (params: {
      deck_id: string
      mode: SessionsState["mode"]
      review_mode?: SessionsState["review_mode"]
    }) => {
      dispatch(go_on_session_page(params))
    },
    on_edit: (deck_id: string) => {
      dispatch(go_on_update_deck_page({ deck_id }))
    },
    on_delete: (deck_id: string) => {
      dispatch(delete_deck({ deck_id }))
    },
    on_duplicate: (deck_id: string) => {
      dispatch(duplicate_deck({ deck_id }))
    },
  }
}

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
