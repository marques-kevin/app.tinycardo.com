import { create_store_for_tests } from "@/tests/create_store_for_tests"
import { describe, expect, it } from "vitest"
import {
  open,
  close,
  open_crash,
  close_crash,
} from "@/modules/dialog/redux/dialog_actions"

describe("dialog actions", () => {
  it(`should be able to open and close a dialog`, async () => {
    const { store } = await create_store_for_tests()

    expect(store.getState().dialog.is_open).toBe(false)

    await store.dispatch(
      open({
        type: "error",
        title: "Error",
        description: "Something went wrong",
      }),
    )

    expect(store.getState().dialog.is_open).toBe(true)
    expect(store.getState().dialog.content).toEqual({
      type: "error",
      title: "Error",
      description: "Something went wrong",
    })

    await store.dispatch(close())

    expect(store.getState().dialog.is_open).toBe(false)
  })

  it(`should be able to open and close a crash dialog`, async () => {
    const { store } = await create_store_for_tests()

    expect(store.getState().dialog.crash.is_open).toBe(false)

    await store.dispatch(
      open_crash({
        message: "message",
        stack: "stack",
      }),
    )

    expect(store.getState().dialog.crash).toEqual({
      is_open: true,
      message: "message",
      stack: "stack",
    })

    await store.dispatch(close_crash())

    expect(store.getState().dialog.crash.is_open).toBe(false)
  })
})
