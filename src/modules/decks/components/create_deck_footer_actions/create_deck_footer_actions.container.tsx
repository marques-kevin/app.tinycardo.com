import { connect, type ConnectedProps } from "react-redux"
import { type Dispatch } from "@/redux/store"
import { create_deck_submit } from "@/modules/decks/redux/decks_actions"

const mapState = () => ({})
const mapDispatch = (dispatch: Dispatch) => ({
  on_save: () => {
    dispatch(create_deck_submit())
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
