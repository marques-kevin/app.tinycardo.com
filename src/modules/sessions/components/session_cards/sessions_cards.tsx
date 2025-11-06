import { connector, type ContainerProps } from "./sessions_cards.container"
import React, { useEffect } from "react"
import { SessionsCardsTextMode } from "../session_cards_text_mode/session_cards_text_mode"
import { SessionsCardsAudioMode } from "../session_cards_audio_mode/session_cards_audio_mode"

export const Wrapper: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    function handle_keydown(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault()
        e.stopPropagation()
        props.on_flip()
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        e.stopPropagation()
        props.set_review_word("known")
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        e.stopPropagation()
        props.set_review_word("unknown")
      }
    }

    document.addEventListener("keydown", handle_keydown)

    return () => {
      document.removeEventListener("keydown", handle_keydown)
    }
  }, [])

  if (props.review_mode === "audio") return <SessionsCardsAudioMode />
  return <SessionsCardsTextMode />
}

export const SessionsCards = connector(Wrapper)
