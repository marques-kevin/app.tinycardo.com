import { XIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function SessionReturnBackButton() {
  return (
    <nav className="absolute top-4 right-4">
      <Link to="/" className="btn btn-ghost btn-circle">
        <XIcon className="size-6" />
      </Link>
    </nav>
  )
}
