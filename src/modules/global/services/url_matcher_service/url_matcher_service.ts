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
 * UrlMatcherService.exact_match("/dashboard/keywords/", "/dashboard/keywords/") // true
 *
 * // Pattern matching
 * UrlMatcherService.match("/dashboard/keywords/123/", "/dashboard/keywords/") // true
 *
 * // Parameter extraction
 * UrlMatcherService.extract("/dashboard/keywords/:id/", "/dashboard/keywords/123/")
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
   * @param url - The URL to check
   * @param pattern - The exact pattern to match against (can include parameter placeholders)
   * @returns `true` if the URLs match exactly (ignoring trailing slashes and parameters), `false` otherwise
   *
   * @example
   * ```typescript
   * UrlMatcherService.exact_match("/dashboard/keywords/", "/dashboard/keywords/") // true
   * UrlMatcherService.exact_match("/dashboard/keywords", "/dashboard/keywords/") // true
   * UrlMatcherService.exact_match("/dashboard/keywords/123/", "/dashboard/keywords/") // false
   * UrlMatcherService.exact_match("/dashboard/keywords/123/", "/dashboard/keywords/:id/") // true
   * UrlMatcherService.exact_match("/", "/") // true
   * UrlMatcherService.exact_match("", "") // true
   * ```
   */
  static exact_match(url: string, pattern: string): boolean {
    // Handle root path specially
    if (url === "/" && pattern === "/") return true
    if (url === "/" && pattern === "") return false
    if (url === "" && pattern === "/") return false

    // Remove trailing slashes for comparison
    const normalizedUrl = url.replace(/\/$/, "")
    const normalizedPattern = pattern.replace(/\/$/, "")

    // If pattern contains parameters (starts with ':'), use parameter matching
    if (normalizedPattern.includes(":")) {
      const patternParts = normalizedPattern.split("/")
      const urlParts = normalizedUrl.split("/")

      // Check if the pattern and URL have the same number of parts
      if (patternParts.length !== urlParts.length) {
        return false
      }

      for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i]
        const urlPart = urlParts[i]

        // If the pattern part starts with ':', it's a parameter - skip comparison
        if (patternPart.startsWith(":")) {
          continue
        } else if (patternPart !== urlPart) {
          // If it's not a parameter and doesn't match, return false
          return false
        }
      }
      return true
    }

    // Otherwise, do exact string comparison
    return normalizedUrl === normalizedPattern
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
   * @param url - The URL to check
   * @param pattern - The pattern to match against (can include parameter placeholders)
   * @returns `true` if the URL starts with the pattern, `false` otherwise
   *
   * @example
   * ```typescript
   * UrlMatcherService.match("/dashboard/keywords/123/", "/dashboard/keywords/") // true
   * UrlMatcherService.match("/dashboard/keywords/edit/", "/dashboard/keywords/") // true
   * UrlMatcherService.match("/dashboard/users/", "/dashboard/keywords/") // false
   * UrlMatcherService.match("/dashboard/keywords", "/dashboard/keywords/") // true
   * UrlMatcherService.match("/dashboard/keywords/123/", "/dashboard/keywords/:id/") // true
   * UrlMatcherService.match("/dashboard/keywords/123/edit/", "/dashboard/keywords/:id/") // true
   * ```
   */
  static match(url: string, pattern: string): boolean {
    // Remove trailing slashes for comparison
    const normalizedUrl = url.replace(/\/$/, "")
    const normalizedPattern = pattern.replace(/\/$/, "")

    // If pattern contains parameters (starts with ':'), use parameter-aware matching
    if (normalizedPattern.includes(":")) {
      const patternParts = normalizedPattern.split("/")
      const urlParts = normalizedUrl.split("/")

      // For match, we check if the URL starts with the pattern structure
      // We need at least as many parts in the URL as in the pattern
      if (urlParts.length < patternParts.length) {
        return false
      }

      // Check each pattern part against the corresponding URL part
      for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i]
        const urlPart = urlParts[i]

        // If the pattern part starts with ':', it's a parameter - skip comparison
        if (patternPart.startsWith(":")) {
          continue
        } else if (patternPart !== urlPart) {
          // If it's not a parameter and doesn't match, return false
          return false
        }
      }
      return true
    }

    // Otherwise, do simple startsWith comparison
    return normalizedUrl.startsWith(normalizedPattern)
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
   * UrlMatcherService.extract("/dashboard/keywords/:id/", "/dashboard/keywords/123/")
   * // Returns: { id: "123" }
   *
   * // Multiple parameters
   * UrlMatcherService.extract("/dashboard/:section/:id/", "/dashboard/keywords/123/")
   * // Returns: { section: "keywords", id: "123" }
   *
   * // Parameters with special characters
   * UrlMatcherService.extract("/users/:username/", "/users/john.doe@example.com/")
   * // Returns: { username: "john.doe@example.com" }
   *
   * // No match (different structure)
   * UrlMatcherService.extract("/dashboard/keywords/:id/", "/dashboard/keywords/")
   * // Returns: {}
   * ```
   */
  static extract(
    pattern: string,
    url: string,
  ): Record<string, string | undefined> {
    // Remove trailing slashes for comparison
    const normalizedUrl = url.replace(/\/$/, "")
    const normalizedPattern = pattern.replace(/\/$/, "")

    const patternParts = normalizedPattern.split("/")
    const urlParts = normalizedUrl.split("/")

    const params: Record<string, string | undefined> = {}

    // Check if the pattern and URL have the same number of parts
    if (patternParts.length !== urlParts.length) {
      return params
    }

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const urlPart = urlParts[i]

      // If the pattern part starts with ':', it's a parameter
      if (patternPart.startsWith(":")) {
        const paramName = patternPart.slice(1) // Remove the ':' prefix
        params[paramName] = urlPart
      } else if (patternPart !== urlPart) {
        // If it's not a parameter and doesn't match, return empty object
        return {}
      }
    }

    return params
  }
}
