import { type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState, props: { lesson_id: string }) => {
  const lesson = state.decks_details.lessons.find(
    (lesson) => lesson.id === props.lesson_id,
  )!
  return {
    name: lesson.name,
    number_of_cards: state.decks_details.cards.filter((card) =>
      lesson.cards.includes(card.id),
    ).length,
    number_of_cards_ready_to_be_reviewed: state.decks_details.history.filter(
      (history) => history.card_id === props.lesson_id,
    ).length,
    number_of_cards_not_ready_to_be_reviewed:
      state.decks_details.history.filter(
        (history) => history.card_id === props.lesson_id,
      ).length,
  }
}

const map_dispatch = () => ({})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
