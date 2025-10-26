import type { AsyncThunkConfig } from "@/redux/store"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"

export const _store_decks_stats = createAction<
  Record<
    string,
    {
      deck_id: string
      number_of_cards: number
      number_of_cards_ready_to_be_reviewed: number
      number_of_cards_not_ready_to_be_reviewed: number
    }
  >
>("decks/_store_decks_stats")

export const _store_decks = createAction<DeckEntity[]>("decks/_store_decks")

export const go_on_deck_details_page = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/go_on_deck_details_page", async ({ deck_id }, { extra }) => {
  extra.location_service.navigate(`/decks/${deck_id}/`)
})

export const go_on_update_deck_page = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/go_on_update_deck_page", async ({ deck_id }, { extra }) => {
  extra.location_service.navigate(`/decks/${deck_id}/update`)
})

export const create_deck = createAsyncThunk<void, void, AsyncThunkConfig>(
  "decks/create_deck",
  async (_, { dispatch, extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) return

    const deck = await extra.decks_repository.create_deck({
      name: "New Deck",
      back_language: "en",
      front_language: "fr",
      user_id: authentication.user.id,
    })

    dispatch(go_on_update_deck_page({ deck_id: deck.id }))

    extra.toast_service.toast({
      title: "decks_actions/toast/deck_created_successfully_title",
      type: "success",
    })
  },
)

export const fetch_decks = createAsyncThunk<void, void, AsyncThunkConfig>(
  "decks/fetch_decks",
  async (params, { dispatch, extra }) => {
    const decks_response = await extra.decks_repository.fetch_decks()

    dispatch(_store_decks(decks_response))

    const decks_history = await Promise.all(
      decks_response.map(async (deck) => {
        const [cards, history] = await Promise.all([
          extra.decks_repository.fetch_cards({ deck_id: deck.id }),
          extra.sessions_repository.fetch_history({
            deck_id: deck.id,
          }),
        ])

        const cards_ready_to_be_reviewed = history.filter(
          (h) => h.next_due_at < new Date(),
        )

        const cards_not_ready_to_be_reviewed = history.filter(
          (h) => h.next_due_at > new Date(),
        )

        return {
          deck_id: deck.id,
          number_of_cards: cards.length,
          number_of_cards_ready_to_be_reviewed:
            cards_ready_to_be_reviewed.length,
          number_of_cards_not_ready_to_be_reviewed:
            cards_not_ready_to_be_reviewed.length,
        }
      }),
    )

    dispatch(
      _store_decks_stats(
        decks_history.reduce(
          (acc, curr) => {
            acc[curr.deck_id] = curr
            return acc
          },
          {} as Record<
            string,
            {
              deck_id: string
              number_of_cards: number
              number_of_cards_ready_to_be_reviewed: number
              number_of_cards_not_ready_to_be_reviewed: number
            }
          >,
        ),
      ),
    )
  },
)

export const _create_deck_add_new_card = createAction<void>(
  "decks/_create_deck_add_new_card",
)

export const create_deck_add_new_card = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "decks/create_deck_add_new_card",
  async (_, { dispatch, extra, getState }) => {
    dispatch(_create_deck_add_new_card())
  },
)

export const create_deck_remove_card = createAction<{ id: string }>(
  "decks/create_deck_remove_card",
)

export const create_deck_update_card = createAction<{
  id: string
  field: "front" | "back"
  value: string
}>("decks/create_deck_update_card")

export const fetch_cards = createAsyncThunk<
  CardEntity[],
  { deck_id: string },
  AsyncThunkConfig
>("decks/fetch_cards", async ({ deck_id }, { extra }) => {
  return await extra.decks_repository.fetch_cards({ deck_id })
})

export const delete_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/delete_deck", async ({ deck_id }, { extra }) => {
  await extra.decks_repository.delete_deck({ id: deck_id })

  extra.location_service.navigate("/")
  extra.toast_service.toast({
    title: "decks_actions/toast/deck_deleted_successfully_title",
    type: "success",
  })
})

/**
 *
 *
 *
 *
 *
 * GLOBAL EVENT HANDLERS
 *
 *
 *
 *
 */

export const global_app_initialized = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/global_app_initialized", async (params, { dispatch }) => {})

export const global_route_changed = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>("decks/global_route_changed", async (_, { dispatch, extra }) => {
  dispatch(when_user_is_on_home_page())
})

export const when_user_is_on_home_page = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(
  "decks/when_user_is_on_home_page",
  async (_, { dispatch, extra, getState }) => {
    const { authentication } = getState()

    if (!authentication.user) return

    const location = extra.location_service.get_current_url()
    const { pathname } = new URL(location)
    const is_on_home_page = UrlMatcherService.exact_match({
      url: pathname,
      pattern: "/",
    })

    if (!is_on_home_page) return

    dispatch(fetch_decks())
  },
)

export const duplicate_deck = createAsyncThunk<
  void,
  { deck_id: string },
  AsyncThunkConfig
>("decks/duplicate_deck", async ({ deck_id }, { extra, getState }) => {
  const { authentication } = getState()

  if (!authentication.user) return

  const copied_deck = await extra.decks_repository.duplicate_deck({
    deck_id: deck_id,
    user_id: authentication.user.id,
  })

  extra.location_service.navigate(`/decks/${copied_deck.id}/update`)
  extra.toast_service.toast({
    title: "decks_actions/toast/deck_duplicated_successfully_title",
    description: "decks_actions/toast/deck_duplicated_successfully_description",
    type: "success",
  })
})
