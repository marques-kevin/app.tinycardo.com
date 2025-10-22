import { connector, type ContainerProps } from "./global_footer.container"

export function Wrapper(props: ContainerProps) {
  return (
    <footer className="text-base-content container mx-auto">
      <div className="divider my-8" />
      <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://github.com/marques-kevin/app.tinycardo.com/actions/workflows/deploy.yml"
            target="_blank"
            rel="noreferrer"
          >
            <img src="https://github.com/marques-kevin/app.tinycardo.com/actions/workflows/deploy.yml/badge.svg" />
          </a>

          <a
            href="https://github.com/marques-kevin/app.tinycardo.com"
            target="_blank"
            rel="noreferrer"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🐙</span>
            <span>GitHub</span>
          </a>
          <a
            href="https://x.com/KM_Marques"
            target="_blank"
            rel="noreferrer"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🐦</span>
            <span>Twitter</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <select
            id="theme-picker"
            className="select select-bordered appearance-none"
            value={props.selected_theme}
            onChange={(e) => props.on_change_theme(e.target.value)}
          >
            {props.themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  )
}

export const GlobalFooter = connector(Wrapper)
