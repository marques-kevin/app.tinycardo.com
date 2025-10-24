import { describe, it, expect } from "vitest"
import { remove_hash } from "@/modules/drawer/utils/remove_hash"

describe("remove_hash", () => {
  it("returns empty string if current hash is undefined", () => {
    expect(remove_hash({ path: "hello", current_hash: undefined })).toBe("")
  })

  it("removes an existing fragment without leading '#' in path", () => {
    expect(remove_hash({ path: "hi", current_hash: "#hi&hello" })).toBe(
      "#hello",
    )
  })

  it("removes an existing fragment when path includes leading '#'", () => {
    expect(remove_hash({ path: "#hi", current_hash: "#hi&hello" })).toBe(
      "#hello",
    )
  })

  it("returns '#' when the last fragment is removed", () => {
    expect(remove_hash({ path: "hello", current_hash: "#hello" })).toBe("#")
  })

  it("returns original hash when fragment is not present", () => {
    expect(remove_hash({ path: "nope", current_hash: "#hello&hi" })).toBe(
      "#hello&hi",
    )
  })
})
