import { describe, it, expect } from "vitest"
import { create_store_for_tests } from "@/tests/create_store_for_tests"
import * as streak_actions from "@/modules/streak/redux/streak_actions"
import type { UsersRepositoryInMemory } from "@/modules/authentication/repositories/users_repository_in_memory"
import { delay } from "@/modules/global/utils/delay"
import * as global_actions from "@/modules/global/redux/global_actions"

describe("streak actions", () => {
  it("should open and close the streak modal", async () => {
    const { store } = await create_store_for_tests()

    expect(store.getState().streak.is_open).toEqual(false)

    await store.dispatch(streak_actions.open_streak_modal())
    expect(store.getState().streak.is_open).toEqual(true)

    await store.dispatch(streak_actions.close_streak_modal())
    expect(store.getState().streak.is_open).toEqual(false)
  })

  it("should navigate months with next and previous actions", async () => {
    const { store } = await create_store_for_tests()

    const initialMonth = store.getState().streak.month
    const initialYear = store.getState().streak.year

    await store.dispatch(streak_actions.next_month())

    let state = store.getState().streak
    expect(state.month).toEqual((initialMonth + 1) % 12)
    expect(state.year).toEqual(
      (initialMonth + 1) % 12 === 0 ? initialYear + 1 : initialYear,
    )

    await store.dispatch(streak_actions.previous_month())

    state = store.getState().streak
    expect(state.month).toEqual(initialMonth)
    expect(state.year).toEqual(initialYear)
  })

  it("should add a streak and refresh the list when authenticated", async () => {
    const { store, dependencies } = await create_store_for_tests()

    const users_repository =
      dependencies.users_repository as UsersRepositoryInMemory

    await users_repository.set_authenticated_user({
      id: "user-1",
      email: "test@test.com",
    })

    await store.dispatch(global_actions.global_app_initialized())
    await store.dispatch(streak_actions.add_streak())

    await delay()

    const state = store.getState().streak
    expect(state.streaks.length).toBeGreaterThanOrEqual(1)
    expect(state.current_streak).toBeGreaterThanOrEqual(1)
  })

  it("should show crash dialog when adding a streak without authentication", async () => {
    const { store } = await create_store_for_tests()

    await store.dispatch(streak_actions.add_streak())
    await delay()

    const state = store.getState().dialog
    expect(state.crash.is_open).toEqual(true)
    expect(state.crash.message).toBeTruthy()
  })
})
