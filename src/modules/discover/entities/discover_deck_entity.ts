export interface DiscoverDeckEntity {
  id: string
  name: string
  number_of_users_using_this_deck: number
  number_of_cards_in_the_deck: number
  front_language: string
  back_language: string
  created_at: Date
  updated_at: Date
}
