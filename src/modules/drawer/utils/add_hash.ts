import { remove_hash } from "./remove_hash"

/**
 * Adds a hash fragment to the current URL hash, preserving any existing hash fragments
 * @example
 * // if window.location.hash = "#hi"
 * addHash("hello") // "#hi&hello"
 * @param params.path The hash fragment to add
 * @param params.current_hash The existing hash to append to
 * @returns The combined hash string
 */
export const add_hash = (params: {
  path: string
  current_hash?: string
  value?: string
}) => {
  const current_hash = remove_hash({
    path: params.path,
    current_hash: params.current_hash,
  })

  if (!current_hash) {
    // No current hash: normalize path and include value if provided
    if (params.path.startsWith("#")) {
      const normalized = params.path.slice(1)
      return `#${normalized}` + (params.value ? `=${params.value}` : "")
    }
    return `#${params.path}` + (params.value ? `=${params.value}` : "")
  }

  const base_path = params.path.startsWith("#")
    ? params.path.slice(1)
    : params.path
  const new_path = base_path + (params.value ? `=${params.value}` : "")
  const fragments = current_hash.slice(1).split("&")

  // Check if path already exists in fragments
  if (fragments.includes(new_path)) {
    return current_hash
  }

  // Treat a lone '#' as empty
  if (current_hash === "#") {
    return `#${new_path}`
  }

  return `${current_hash}&${new_path}`
}
