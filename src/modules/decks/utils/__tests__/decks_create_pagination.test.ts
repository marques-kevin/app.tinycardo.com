import { decks_create_pagination } from "@/modules/decks/utils/decks_create_pagination"
import { describe, expect, it } from "vitest"

describe("decks_create_pagination", () => {
  it("should create a pagination array", () => {
    const pagination = decks_create_pagination({
      current_page: 1,
      total_pages: 10,
    })

    expect(pagination).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it("if there are more than 10 pages, and the current page is 1, should show dots on the middle and then increment by 10, and show the last", () => {
    const pagination = decks_create_pagination({
      current_page: 1,
      total_pages: 100,
    })

    expect(pagination).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    ])
  })

  it("if there are more than 10 pages and the current page is 10, should show dots on the middle and then increment by 10 until 100, and show the last", () => {
    const pagination = decks_create_pagination({
      current_page: 10,
      total_pages: 101,
    })

    expect(pagination).toEqual([
      1, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90,
      100, 101,
    ])
  })

  it("if there are 500 pages and the current page is 1, should show the first 10 pages, then increment by 10 until 100 and then implent 100 by 100", () => {
    const pagination = decks_create_pagination({
      current_page: 1,
      total_pages: 500,
    })

    expect(pagination).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200,
      300, 400, 500,
    ])
  })

  it("brute force testing", () => {
    const tests: Array<{
      params: { current_page: number; total_pages: number }
      expected: number[]
    }> = [
      {
        params: { current_page: 1, total_pages: 500 },
        expected: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          200, 300, 400, 500,
        ],
      },
      {
        params: { current_page: 56, total_pages: 100 },
        expected: [
          1, 10, 20, 30, 40, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 70, 80,
          90, 100,
        ],
      },
      {
        params: { current_page: 235, total_pages: 2001 },
        expected: [
          1, 100, 200, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
          300, 400, 500, 600, 700, 800, 900, 1000, 2000, 2001,
        ],
      },
    ]

    tests.forEach((test) => {
      const pagination = decks_create_pagination(test.params)
      expect(pagination).toEqual(test.expected)
    })
  })
})
