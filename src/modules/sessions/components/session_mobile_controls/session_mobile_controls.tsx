import { CheckIcon, XIcon } from "lucide-react"
import { useAppDispatch } from "@/redux/store"
import { set_review_word } from "@/modules/sessions/redux/sessions_actions"

export function SessionMobileControls() {
  const dispatch = useAppDispatch()

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        className="btn btn-lg btn-error"
        onClick={() => dispatch(set_review_word({ status: "unknown" }))}
      >
        <XIcon className="size-5" />
      </button>
      <button
        className="btn btn-lg btn-success"
        onClick={() => dispatch(set_review_word({ status: "known" }))}
      >
        <CheckIcon className="size-5" />
      </button>
    </div>
  )
}
