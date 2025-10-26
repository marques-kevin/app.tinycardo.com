export type DeckEntity = {
  id: string
  name: string
  description: string | null
  front_language: string
  back_language: string
  user_id: string
  updated_at: Date
  created_at: Date
  visibility: "public" | "private" | "unlisted"
  number_of_cards: number
}
