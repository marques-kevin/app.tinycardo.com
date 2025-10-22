import { XIcon } from "lucide-react"
import { useIntl } from "react-intl"
import { Link } from "react-router-dom"

export function SessionReturnBackButton() {
  const { formatMessage } = useIntl()
  return (
    <nav className="absolute top-4 right-4">
      <Link to="/" className="btn btn-ghost btn-circle tooltip tooltip-left">
        <XIcon className="size-6" />
        <div className="tooltip-content">
          {formatMessage({
            id: "session_return_back_button/return_back_button/tooltip",
          })}
        </div>
      </Link>
    </nav>
  )
}
