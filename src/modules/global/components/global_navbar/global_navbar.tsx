import { useIntl } from "react-intl"
import { Link, NavLink } from "react-router-dom"
import { Cog, Plus } from "lucide-react"

export function GlobalNavbar() {
  const { formatMessage } = useIntl()

  return (
    <nav className="text-base-content container mx-auto">
      <div className="flex items-center justify-between gap-4 py-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Tinycardo
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/decks/new"
            className={({ isActive }: { isActive: boolean }) =>
              `btn btn-ghost ${isActive ? "btn-active" : ""}`
            }
            title={formatMessage({
              id: "global_navbar/create_deck",
            })}
          >
            <Plus size={18} />
          </NavLink>

          <NavLink
            to="/params"
            className={({ isActive }: { isActive: boolean }) =>
              `btn btn-ghost ${isActive ? "btn-active" : ""}`
            }
            title={formatMessage({ id: "global_navbar/params" })}
          >
            <Cog size={18} />
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
