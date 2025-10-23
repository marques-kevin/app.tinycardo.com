/**
 * Service for URL matching and parameter extraction.
 *
 * This service provides utilities for:
 * - Exact URL matching with trailing slash normalization
 * - Pattern-based URL matching
 * - Parameter extraction from URLs using placeholder syntax
 *
 * @example
 * ```typescript
 * // Exact matching
 * UrlMatcherService.exact_match({ url: "/dashboard/keywords/", pattern: "/dashboard/keywords/" }) // true
 *
 * // Pattern matching
 * UrlMatcherService.match({ url: "/dashboard/keywords/123/", pattern: "/dashboard/keywords/" }) // true
 *
 * // Parameter extraction
 * UrlMatcherService.extract({ pattern: "/dashboard/keywords/:id/", url: "/dashboard/keywords/123/" })
 * // Returns: { id: "123" }
 * ```
 */
export class UrlMatcherService {
  /**
   * Performs exact URL matching with trailing slash normalization and parameter support.
   *
   * This method compares two URLs exactly, treating URLs with and without
   * trailing slashes as equivalent. It also handles special cases for
   * root paths and empty strings. When the pattern contains parameter placeholders
   * (denoted by `:paramName`), it performs parameter-aware matching.
   *
   * @returns `true` if the URLs match exactly (ignoring trailing slashes and parameters), `false` otherwise
   *
   * @example
   * ```typescript
   * UrlMatcherService.exact_match({ url: "/dashboard/keywords/", pattern: "/dashboard/keywords/" }) // true
   * UrlMatcherService.exact_match({ url: "/dashboard/keywords", pattern: "/dashboard/keywords/" }) // true
   * UrlMatcherService.exact_match({ url: "/dashboard/keywords/123/", pattern: "/dashboard/keywords/" }) // false
   * UrlMatcherService.exact_match({ url: "/dashboard/keywords/123/", pattern: "/dashboard/keywords/:id/" }) // true
   * UrlMatcherService.exact_match({ url: "/", pattern: "/" }) // true
   * UrlMatcherService.exact_match({ url: "", pattern: "" }) // true
   * ```
   */
  static exact_match(params: { url: string; pattern: string }): boolean {
    // Handle root path specially
    if (params.url === "/" && params.pattern === "/") return true
    if (params.url === "/" && params.pattern === "") return false
    if (params.url === "" && params.pattern === "/") return false

    // Remove trailing slashes for comparison
    const normalized_url = params.url.replace(/\/$/, "")
    const normalized_pattern = params.pattern.replace(/\/$/, "")

    // If pattern contains parameters (starts with ':'), use parameter matching
    if (normalized_pattern.includes(":")) {
      const pattern_parts = normalized_pattern.split("/")
      const url_parts = normalized_url.split("/")

      // Check if the pattern and URL have the same number of parts
      if (pattern_parts.length !== url_parts.length) {
        return false
      }

      for (let i = 0; i < pattern_parts.length; i++) {
        const pattern_part = pattern_parts[i]
        const url_part = url_parts[i]

        // If the pattern part starts with ':', it's a parameter - skip comparison
        if (pattern_part.startsWith(":")) {
          continue
        } else if (pattern_part !== url_part) {
          // If it's not a parameter and doesn't match, return false
          return false
        }
      }
      return true
    }

    // Otherwise, do exact string comparison
    return normalized_url === normalized_pattern
  }

  /**
   * Performs pattern-based URL matching with parameter support.
   *
   * This method checks if a URL starts with the given pattern, treating
   * URLs with and without trailing slashes as equivalent. It's useful
   * for checking if a URL belongs to a specific section or route.
   * When the pattern contains parameter placeholders (denoted by `:paramName`),
   * it performs parameter-aware matching.
   *
   * @returns `true` if the URL starts with the pattern, `false` otherwise
   *
   * @example
   * ```typescript
   * UrlMatcherService.match({ url: "/dashboard/keywords/123/", pattern: "/dashboard/keywords/" }) // true
   * UrlMatcherService.match({ url: "/dashboard/keywords/edit/", pattern: "/dashboard/keywords/" }) // true
   * UrlMatcherService.match({ url: "/dashboard/users/", pattern: "/dashboard/keywords/" }) // false
   * UrlMatcherService.match({ url: "/dashboard/keywords", pattern: "/dashboard/keywords/" }) // true
   * UrlMatcherService.match({ url: "/dashboard/keywords/123/", pattern: "/dashboard/keywords/:id/" }) // true
   * UrlMatcherService.match({ url: "/dashboard/keywords/123/edit/", pattern: "/dashboard/keywords/:id/" }) // true
   * ```
   */
  static match(params: { url: string; pattern: string }): boolean {
    // Remove trailing slashes for comparison
    const normalized_url = params.url.replace(/\/$/, "")
    const normalized_pattern = params.pattern.replace(/\/$/, "")

    // If pattern contains parameters (starts with ':'), use parameter-aware matching
    if (normalized_pattern.includes(":")) {
      const pattern_parts = normalized_pattern.split("/")
      const url_parts = normalized_url.split("/")

      // For match, we check if the URL starts with the pattern structure
      // We need at least as many parts in the URL as in the pattern
      if (url_parts.length < pattern_parts.length) {
        return false
      }

      // Check each pattern part against the corresponding URL part
      for (let i = 0; i < pattern_parts.length; i++) {
        const pattern_part = pattern_parts[i]
        const url_part = url_parts[i]

        // If the pattern part starts with ':', it's a parameter - skip comparison
        if (pattern_part.startsWith(":")) {
          continue
        } else if (pattern_part !== url_part) {
          // If it's not a parameter and doesn't match, return false
          return false
        }
      }
      return true
    }

    // Otherwise, do simple startsWith comparison
    return normalized_url.startsWith(normalized_pattern)
  }

  /**
   * Extracts parameters from a URL based on a pattern with placeholders.
   *
   * This method parses a URL against a pattern that contains parameter placeholders
   * (denoted by `:paramName`) and returns an object with the extracted values.
   * The pattern and URL must have the same structure (same number of path segments).
   *
   * @param pattern - The pattern with parameter placeholders (e.g., "/dashboard/keywords/:id/")
   * @param url - The actual URL to extract parameters from (e.g., "/dashboard/keywords/123/")
   * @returns An object containing the extracted parameters, or an empty object if no match
   *
   * @example
   * ```typescript
   * // Single parameter
   * UrlMatcherService.extract({ pattern: "/dashboard/keywords/:id/", url: "/dashboard/keywords/123/" })
   * // Returns: { id: "123" }
   *
   * // Multiple parameters
   * UrlMatcherService.extract({ pattern: "/dashboard/:section/:id/", url: "/dashboard/keywords/123/" })
   * // Returns: { section: "keywords", id: "123" }
   *
   * // Parameters with special characters
   * UrlMatcherService.extract({ pattern: "/users/:username/", url: "/users/john.doe@example.com/" })
   * // Returns: { username: "john.doe@example.com" }
   *
   * // No match (different structure)
   * UrlMatcherService.extract({ pattern: "/dashboard/keywords/:id/", url: "/dashboard/keywords/" })
   * // Returns: {}
   * ```
   */
  static extract(params: {
    pattern: string
    url: string
  }): Record<string, string | undefined> {
    // Remove trailing slashes for comparison
    const normalized_url = params.url.replace(/\/$/, "")
    const normalized_pattern = params.pattern.replace(/\/$/, "")

    const pattern_parts = normalized_pattern.split("/")
    const url_parts = normalized_url.split("/")

    const extracted_params: Record<string, string | undefined> = {}

    // Check if the pattern and URL have the same number of parts
    if (pattern_parts.length !== url_parts.length) {
      return extracted_params
    }

    for (let i = 0; i < pattern_parts.length; i++) {
      const pattern_part = pattern_parts[i]
      const url_part = url_parts[i]

      // If the pattern part starts with ':', it's a parameter
      if (pattern_part.startsWith(":")) {
        const param_name = pattern_part.slice(1) // Remove the ':' prefix
        extracted_params[param_name] = url_part
      } else if (pattern_part !== url_part) {
        // If it's not a parameter and doesn't match, return empty object
        return {}
      }
    }

    return extracted_params
  }
}
