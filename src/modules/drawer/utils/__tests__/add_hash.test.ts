import { describe, it, expect } from "vitest"
import { add_hash } from "@/modules/drawer/utils/add_hash"

describe("add_hash", () => {
  it("adds a fragment when no current hash is provided", () => {
    expect(add_hash({ path: "hello" })).toBe("#hello")
  })

  it("adds a fragment with value when no current hash is provided", () => {
    expect(add_hash({ path: "hello", value: "world" })).toBe("#hello=world")
  })

  it("appends to an existing hash", () => {
    expect(add_hash({ path: "hello", current_hash: "#hi" })).toBe("#hi&hello")
  })

  it("does not duplicate an existing fragment", () => {
    expect(add_hash({ path: "hello", current_hash: "#hi&hello" })).toBe(
      "#hi&hello",
    )
  })

  it("appends with value to an existing hash", () => {
    expect(
      add_hash({ path: "hello", current_hash: "#hi", value: "world" }),
    ).toBe("#hi&hello=world")
  })

  it("treats a lone '#' as empty and appends correctly", () => {
    expect(add_hash({ path: "hello", current_hash: "#" })).toBe("#hello")
  })

  it("accepts a path with leading '#' and appends value", () => {
    expect(
      add_hash({ path: "#hello", current_hash: "#hi", value: "world" }),
    ).toBe("#hi&hello=world")
  })
})
