import { Link, NavLink } from "react-router-dom"
import { CogIcon, PlusIcon, SearchIcon, MenuIcon } from "lucide-react"
import { GlobalLogo } from "@/modules/global/components/global_logo/global_logo"
import { useIntl } from "react-intl"
import { connector, type ContainerProps } from "./global_navbar.container"
import { StreakIcon } from "@/modules/streak/components/streak_icon/streak_icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/shadcn/dropdown-menu"

export function Wrapper(props: ContainerProps) {
  const { formatMessage } = useIntl()

  return (
    <div className="mt-2 px-4">
      <nav className="bg-accent text-accent-content border-accent-content/20 rounded-box w-full border-2 px-2 py-2 pl-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <GlobalLogo className="size-10" />

            <span
              className="hidden text-lg font-semibold tracking-wider lg:inline"
              style={{
                textDecoration: "underline",
                textDecorationThickness: "2px",
                textUnderlineOffset: "2px",
              }}
            >
              tinycardo
            </span>
          </Link>

          <div className="flex items-center lg:hidden">
            <button
              onClick={props.on_open_streak_modal}
              className="btn btn-accent btn-ghost gap-2 uppercase"
            >
              <StreakIcon className="size-5" />
              <span>{props.current_streak}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="btn btn-accent btn-ghost" aria-label="Menu">
                  <MenuIcon className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-accent text-accent-content border-accent-content/20 border-2"
              >
                <DropdownMenuItem asChild>
                  <Link to="/discover/" className="flex items-center gap-2">
                    <SearchIcon className="size-4" />
                    <span>
                      {formatMessage({ id: "global_navbar/discover" })}
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={props.on_create_new_deck}>
                  <PlusIcon className="size-4" />
                  <span>
                    {formatMessage({ id: "global_navbar/create_deck" })}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/params/" className="flex items-center gap-2">
                    <CogIcon className="size-4" />
                    <span>{formatMessage({ id: "global_navbar/params" })}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
