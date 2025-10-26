import { UrlMatcherService } from "@/modules/global/services/url_matcher_service/url_matcher_service"
import { describe, expect, it } from "vitest"

describe("url_matcher_service", () => {
  describe("exact_match", () => {
    it("should return false for non-exact matches", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords/123/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(false)
    })

    it("should return true for exact matches", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle trailing slashes correctly", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle empty strings", () => {
      expect(UrlMatcherService.exact_match({ url: "", pattern: "" })).toBe(true)
      expect(UrlMatcherService.exact_match({ url: "/", pattern: "" })).toBe(
        false,
      )
      expect(UrlMatcherService.exact_match({ url: "", pattern: "/" })).toBe(
        false,
      )
    })

    it("should handle root path", () => {
      expect(UrlMatcherService.exact_match({ url: "/", pattern: "/" })).toBe(
        true,
      )
      expect(UrlMatcherService.exact_match({ url: "", pattern: "/" })).toBe(
        false,
      )
    })

    it("should handle query parameters", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords/?page=1",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(false)
    })

    it("should handle hash fragments", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords/#section",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(false)
    })

    it("should handle parameters", () => {
      expect(
        UrlMatcherService.exact_match({
          url: "/dashboard/keywords/123/",
          pattern: "/dashboard/keywords/:id/",
        }),
      ).toBe(true)
    })
  })

  describe("match", () => {
    it("should return true for matching patterns", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should return false for non-matching patterns", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/",
          pattern: "/dashboard/users/",
        }),
      ).toBe(false)
    })

    it("should handle trailing slashes correctly", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle empty pattern", () => {
      expect(
        UrlMatcherService.match({ url: "/dashboard/keywords/", pattern: "" }),
      ).toBe(true)
      expect(UrlMatcherService.match({ url: "", pattern: "" })).toBe(true)
    })

    it("should handle root path", () => {
      expect(
        UrlMatcherService.match({ url: "/dashboard/keywords/", pattern: "/" }),
      ).toBe(true)
      expect(UrlMatcherService.match({ url: "/", pattern: "/" })).toBe(true)
    })

    it("should handle case sensitivity", () => {
      expect(
        UrlMatcherService.match({
          url: "/Dashboard/Keywords/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(false)
    })

    it("should handle special characters", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/search?q=test",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle URL encoding", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/search%20term/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle nested paths", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/edit/",
          pattern: "/dashboard/keywords/",
        }),
      ).toBe(true)
    })

    it("should handle parameter placeholders", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/",
          pattern: "/dashboard/keywords/:id/",
        }),
      ).toBe(true)
    })

    it("should handle parameter placeholders with nested paths", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/edit/",
          pattern: "/dashboard/keywords/:id/",
        }),
      ).toBe(true)
    })

    it("should handle multiple parameter placeholders", () => {
      expect(
        UrlMatcherService.match({
          url: "/dashboard/keywords/123/edit/",
          pattern: "/dashboard/:section/:id/",
        }),
      ).toBe(true)
    })
  })

  describe("extract", () => {
    it("should extract single parameter", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id/",
          url: "/dashboard/keywords/123/",
        }),
      ).toEqual({
        id: "123",
      })
    })

    it("should extract multiple parameters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/:section/:id/",
          url: "/dashboard/keywords/123/",
        }),
      ).toEqual({
        section: "keywords",
        id: "123",
      })
    })

    it("should handle trailing slashes correctly", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id",
          url: "/dashboard/keywords/123/",
        }),
      ).toEqual({
        id: "123",
      })
    })

    it("should return empty object for non-matching patterns", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id/",
          url: "/dashboard/users/123/",
        }),
      ).toEqual({})
    })

    it("should return empty object for different path lengths", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id/",
          url: "/dashboard/keywords/",
        }),
      ).toEqual({})
    })

    it("should handle empty strings", () => {
      expect(UrlMatcherService.extract({ pattern: "", url: "" })).toEqual({})
      expect(UrlMatcherService.extract({ pattern: "/", url: "" })).toEqual({})
      expect(UrlMatcherService.extract({ pattern: "", url: "/" })).toEqual({})
    })

    it("should handle root path", () => {
      expect(UrlMatcherService.extract({ pattern: "/", url: "/" })).toEqual({})
    })

    it("should handle parameters with special characters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id/",
          url: "/dashboard/keywords/123-456/",
        }),
      ).toEqual({
        id: "123-456",
      })
    })

    it("should handle parameters with underscores", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:keyword_id/",
          url: "/dashboard/keywords/abc_123/",
        }),
      ).toEqual({
        keyword_id: "abc_123",
      })
    })

    it("should handle mixed static and dynamic parts", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/:section/:id/edit/",
          url: "/dashboard/keywords/123/edit/",
        }),
      ).toEqual({
        section: "keywords",
        id: "123",
      })
    })

    it("should handle parameters at the beginning", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/:lang/dashboard/keywords/",
          url: "/en/dashboard/keywords/",
        }),
      ).toEqual({
        lang: "en",
      })
    })

    it("should handle parameters at the end", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id",
          url: "/dashboard/keywords/123",
        }),
      ).toEqual({
        id: "123",
      })
    })

    it("should handle consecutive parameters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/:year/:month/:day/",
          url: "/2023/12/25/",
        }),
      ).toEqual({
        year: "2023",
        month: "12",
        day: "25",
      })
    })

    it("should handle empty parameter values", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:id/",
          url: "/dashboard/keywords//",
        }),
      ).toEqual({
        id: "",
      })
    })

    it("should handle URL encoded parameters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/keywords/:search/",
          url: "/dashboard/keywords/search%20term/",
        }),
      ).toEqual({
        search: "search%20term",
      })
    })

    it("should handle parameters with dots", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/files/:filename/",
          url: "/dashboard/files/document.pdf/",
        }),
      ).toEqual({
        filename: "document.pdf",
      })
    })

    it("should handle parameters with multiple special characters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/users/:username/",
          url: "/dashboard/users/john.doe@example.com/",
        }),
      ).toEqual({
        username: "john.doe@example.com",
      })
    })

    it("should handle numeric parameters", () => {
      expect(
        UrlMatcherService.extract({
          pattern: "/dashboard/analytics/:year/:month/",
          url: "/dashboard/analytics/2023/12/",
        }),
      ).toEqual({
        year: "2023",
        month: "12",
      })
    })
  })
})
