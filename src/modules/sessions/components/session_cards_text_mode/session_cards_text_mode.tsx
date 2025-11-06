import {
  connector,
  type ContainerProps,
} from "./session_cards_text_mode.container"
import { HelpCircleIcon, Volume2Icon } from "lucide-react"
import React from "react"

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div className="stack relative h-[300px] w-full cursor-pointer select-none">
      <div
        className="border-base-300 card bg-base-100 flex items-center justify-center border"
        onClick={() => props.on_flip()}
      >
        <div className="absolute top-0 right-0 p-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              props.on_tts()
            }}
          >
            <Volume2Icon className="size-5" />
          </button>
        </div>
        <div className="absolute right-0 bottom-0 p-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              props.on_help()
            }}
          >
            <HelpCircleIcon className="size-5" />
          </button>
        </div>
        <p
          className="px-4 text-center text-4xl font-bold text-balance"
          style={{
            wordBreak: "keep-all",
          }}
        >
          {props.is_flipped ? props.back : props.front}
        </p>
      </div>

      {Array.from({ length: 3 }).map((c, i) => (
        <div key={i} className="border-base-300 card bg-base-100 border" />
      ))}
    </div>
  )
}

export const SessionsCardsTextMode = connector(Wrapper)
