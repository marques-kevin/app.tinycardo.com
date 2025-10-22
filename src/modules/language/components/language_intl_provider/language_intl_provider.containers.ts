import * as actions from "@/modules/language/redux/language_actions"
import { type Dispatch, type RootState } from "@/redux/store"
import { connect, type ConnectedProps } from "react-redux"

const mapState = (
  state: RootState,
  props: { langKey?: string; children: React.ReactNode },
) => ({
  langKey: props.langKey || state.language.lang,
  children: props.children,
})

const mapDispatch = (dispatch: Dispatch) => ({
  onMount: (lang: string) => {
    dispatch(actions.store({ lang }))
  },
})

export const connector = connect(mapState, mapDispatch)
export type ContainerProps = ConnectedProps<typeof connector>
