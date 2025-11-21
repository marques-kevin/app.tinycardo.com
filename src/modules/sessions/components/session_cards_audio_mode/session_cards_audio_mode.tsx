import {
  connector,
  type ContainerProps,
} from "./session_cards_audio_mode.container"
import { Volume2Icon } from "lucide-react"
import React from "react"

const Front: React.FC<ContainerProps> = (props) => {
  return (
    <>
      <div className="flex items-end -space-x-4">
        <button
          className="bg-base-100 border-base-300 hover:bg-base-200 cursor-pointer rounded-full border p-6 active:scale-95"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            props.on_tts()
          }}
        >
          <Volume2Icon className="size-10" />
        </button>
      </div>
    </>
  )
}

const Back: React.FC<ContainerProps> = (props) => {
  return (
    <>
      <p
        className="px-4 text-center text-3xl font-bold text-balance"
        style={{
          wordBreak: "keep-all",
        }}
      >
        {props.back}
      </p>
      <p
        className="text-base-content/60 mt-2 px-4 text-center text-2xl font-medium text-balance"
        style={{
          wordBreak: "keep-all",
        }}
      >
        {props.front}
      </p>
    </>
  )
}

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div className="stack relative h-[300px] w-full cursor-pointer select-none">
      <div
        className="border-base-300 card bg-base-100 flex items-center justify-center border"
        onClick={() => props.on_flip()}
      >
        {props.is_flipped ? <Back {...props} /> : <Front {...props} />}
      </div>

      {Array.from({ length: 3 }).map((c, i) => (
        <div key={i} className="border-base-300 card bg-base-100 border" />
      ))}
    </div>
  )
}

export const SessionsCardsAudioMode = connector(Wrapper)
