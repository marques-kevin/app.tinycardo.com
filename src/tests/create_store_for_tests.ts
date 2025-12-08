import type { UserEntity } from "@/modules/authentication/entities/user_entity"
import type { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import type { CardEntity } from "@/modules/decks/entities/card_entity"
import type { DeckEntity } from "@/modules/decks/entities/deck_entity"
import type { DecksRepositoryInMemory } from "@/modules/decks/repositories/decks_repository_in_memory"
import type { ToastServiceInMemory } from "@/modules/global/services/toast_service/toast_service_in_memory"
import { build_dependencies } from "@/redux/dependencies"
import { init as createStore } from "@/redux/store"
import { delay } from "@/modules/global/utils/delay"
import * as global_actions from "@/modules/global/redux/global_actions"

export const create_store_for_tests = async () => {
  const dependencies = build_dependencies("test")
  const { store } = createStore({}, dependencies)

  return {
    store,
    dependencies,
  }
}

export const prepare_tests_for_update_deck = async (params?: {
  is_user_premium?: boolean
}) => {
  const { store, dependencies } = await create_store_for_tests()

  const users_repository =
    dependencies.users_repository as UsersRepositoryInMemory
  const decks_repository =
    dependencies.decks_repository as DecksRepositoryInMemory
  const toast_service = dependencies.toast_service as ToastServiceInMemory

  const user: UserEntity = {
    id: "user-1",
    email: "test@example.com",
  }
  await users_repository.set_authenticated_user(user)
  await users_repository.set_is_user_premium(params?.is_user_premium ?? false)

  const deck: DeckEntity = {
    id: "deck-1",
    name: "Test Deck",
    description: "Test Description",
    front_language: "en",
    back_language: "fr",
    user_id: user.id,
    updated_at: new Date(),
    created_at: new Date(),
    visibility: "private",
    number_of_cards: 10,
    number_of_cards_ready_to_be_reviewed: 0,
    number_of_cards_not_ready_to_be_reviewed: 0,
    number_of_users_using_this_deck: 0,
  }

  const cards: CardEntity[] = Array.from(
    { length: deck.number_of_cards },
    (_, index) => ({
      id: `card-${index}`,
      deck_id: deck.id,
      front: `Front ${index}`,
      back: `Back ${index}`,
      front_audio_url: `https://example.com/front-${index}.mp3`,
      back_audio_url: `https://example.com/back-${index}.mp3`,
    }),
  )

  await decks_repository.sync_deck({ deck, cards })
  await dependencies.location_service.navigate(`/decks/${deck.id}/update`)
  await store.dispatch(global_actions.global_app_initialized())
  await store.dispatch(global_actions.global_route_changed())

  await delay()

  return {
    store,
    deck,
    cards,
    user,
    toast_service,
    decks_repository,
    dependencies,
  }
}
