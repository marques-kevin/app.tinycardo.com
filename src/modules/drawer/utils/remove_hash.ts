/**
 * Removes a hash fragment from the current URL hash
 * @example
 * // if window.location.hash = "#hi&hello"
 * removeHash("hi") // "#hello"
 * @param path The hash fragment to remove
 * @returns The remaining hash string
 */
export const remove_hash = (params: {
  path: string
  current_hash?: string
}) => {
  if (!params.current_hash) return ""

  const fragments = params.current_hash.slice(1).split("&")
  const pathToRemove = params.path.startsWith("#")
    ? params.path.slice(1)
    : params.path
  const remaining_fragments = fragments.filter((f) => !f.includes(pathToRemove))

  if (remaining_fragments.length === 0) return "#"

  return "#" + remaining_fragments.join("&")
}
