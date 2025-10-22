import {
  connector,
  type ContainerProps,
} from "@/modules/sessions/components/session_progress_bar/session_progress_bar.container"

export function Wrapper(props: ContainerProps) {
  return (
    <div className="flex items-center justify-between">
      <progress
        className="progress w-full"
        value={props.current_index}
        max={props.total_words}
      ></progress>
    </div>
  )
}

export const SessionProgressBar = connector(Wrapper)
