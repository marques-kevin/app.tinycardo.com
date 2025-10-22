import {
  store_how_many_words_to_review,
  store_how_many_words_to_learn_new_words,
  store_how_many_words_to_randomized,
} from "@/modules/params/redux/params_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const map_state = (state: RootState) => ({
  how_many_words_to_review: state.params.how_many_words_to_review,
  how_many_words_to_learn_new_words:
    state.params.how_many_words_to_learn_new_words,
  how_many_words_to_randomized: state.params.how_many_words_to_randomized,
})

const map_dispatch = (dispatch: Dispatch) => ({
  on_how_many_words_to_review_change: (how_many_words_to_review: number) => {
    dispatch(store_how_many_words_to_review({ how_many_words_to_review }))
  },
  on_how_many_words_to_learn_new_words_change: (
    how_many_words_to_learn_new_words: number,
  ) => {
    dispatch(
      store_how_many_words_to_learn_new_words({
        how_many_words_to_learn_new_words,
      }),
    )
  },
  on_how_many_words_to_randomized_change: (
    how_many_words_to_randomized: number,
  ) => {
    dispatch(
      store_how_many_words_to_randomized({ how_many_words_to_randomized }),
    )
  },
})

export const connector = connect(map_state, map_dispatch)
export type ContainerProps = ConnectedProps<typeof connector>
