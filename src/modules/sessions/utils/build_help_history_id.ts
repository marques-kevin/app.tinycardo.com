export function build_help_history_id(params: {
  is_front: boolean
  card_id: string
}) {
  if (params.is_front) return `front-${params.card_id}`
  return `back-${params.card_id}`
}
