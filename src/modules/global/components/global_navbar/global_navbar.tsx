import { Link, NavLink } from "react-router-dom"
import { CogIcon, FlameIcon, PlusIcon, SearchIcon } from "lucide-react"
import { GlobalLogo } from "@/modules/global/components/global_logo/global_logo"
import { useIntl } from "react-intl"
import { connector, type ContainerProps } from "./global_navbar.container"
import { StreakIcon } from "@/modules/streak/components/streak_icon/streak_icon"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="mt-2 px-4">
      <nav className="bg-accent text-accent-content border-accent-content/20 rounded-box w-full border-2 px-2 py-2 pl-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <GlobalLogo className="size-10" />

            <span
              className="text-lg font-semibold tracking-wider"
              style={{
                textDecoration: "underline",
                textDecorationThickness: "2px",
                textUnderlineOffset: "2px",
              }}
            >
              tinycardo
            </span>
          </Link>

          <div className="hidden items-center font-medium lg:flex">
            <button
              onClick={props.on_open_streak_modal}
              className="btn btn-accent btn-ghost gap-2 uppercase"
            >
              <StreakIcon className="size-5" />
              <span>
                {formatMessage(
                  { id: "global_navbar/streak" },
                  {
                    streak: props.current_streak,
                  },
                )}
              </span>
            </button>

            <NavLink
              to="/discover/"
              className={({ isActive }: { isActive: boolean }) =>
                `btn btn-accent btn-ghost gap-2 uppercase ${isActive ? "btn-active" : ""}`
              }
            >
              <SearchIcon className="size-5" />
              <span>{formatMessage({ id: "global_navbar/discover" })}</span>
            </NavLink>

            <button
              onClick={props.on_create_new_deck}
              role="button"
              className="btn btn-accent btn-ghost gap-2 uppercase"
            >
              <PlusIcon className="size-5" />
              <span>{formatMessage({ id: "global_navbar/create_deck" })}</span>
            </button>

            <NavLink
              to="/params/"
              className={({ isActive }: { isActive: boolean }) =>
                `btn btn-accent btn-ghost gap-2 uppercase ${isActive ? "btn-active" : ""}`
              }
            >
              <CogIcon className="size-5" />
              <span>{formatMessage({ id: "global_navbar/params" })}</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  )
}

export const GlobalNavbar = connector(Wrapper)
