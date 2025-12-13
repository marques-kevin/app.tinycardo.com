/**
 *
 * @todo Seems dangerous because UUID should be unique and this is not guaranteed.
 *
 */
export function create_uuid_for_cards(params: {
  front: string
  back: string
}): string {
  const str = `${params.front}-${params.back}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16)
}
