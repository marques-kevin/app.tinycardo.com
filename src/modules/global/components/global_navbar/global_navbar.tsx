import { useIntl } from "react-intl"
import { Link, NavLink } from "react-router-dom"
import { Cog, Plus } from "lucide-react"
import { GlobalLogo } from "../global_logo/global_logo"

export function GlobalNavbar() {
  const { formatMessage } = useIntl()

  return (
    <nav className="text-base-content container mx-auto">
      <div className="flex items-center justify-between gap-4 py-8">
        <Link to="/" className="flex items-center gap-2">
          <GlobalLogo className="size-10" />

          <span
            className="text-primary text-lg font-semibold tracking-wider"
            style={{
              textDecoration: "underline",
              textDecorationThickness: "2px",
              textDecorationColor: "var(--color-primary-content)",
              textUnderlineOffset: "2px",
            }}
          >
            tinycardo
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
