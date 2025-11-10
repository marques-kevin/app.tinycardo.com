import { SessionEndedSplashScreen } from "@/modules/sessions/components/session_ended_splash_screen/session_ended_splash_screen"
import { SessionNoMoreReview } from "@/modules/sessions/components/session_no_more_review/session_no_more_review"
import type { ReactNode } from "react"
import {
  connector,
  type ContainerProps,
} from "./session_conditional_view.container"

interface WrapperProps extends ContainerProps {
  children?: ReactNode
}

export function Wrapper(props: WrapperProps) {
  if (props.is_loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    )
  }

  if (props.no_cards_to_review) {
    return <SessionNoMoreReview />
  }

  if (props.is_ended) {
    return <SessionEndedSplashScreen />
  }

  return <>{props.children}</>
}

Wrapper.displayName = "SessionConditionalView"

export const SessionConditionalView = connector(Wrapper)
