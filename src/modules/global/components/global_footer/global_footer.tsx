import { Link } from "react-router-dom"

export function GlobalFooter() {
  return (
    <footer className="text-base-content container mx-auto">
      <div className="divider my-8" />
      <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 text-xs">
          <img src="https://github.com/marques-kevin/app.tinycardo.com/actions/workflows/deploy.yml/badge.svg" />

          <a
            href="https://github.com/kevinmarques/pump.it"
            target="_blank"
            rel="noreferrer"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🐙</span>
            <span>GitHub</span>
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🐦</span>
            <span>Twitter</span>
          </a>
          <Link
            to="/terms"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">📄</span>
            <span>Terms</span>
          </Link>
          <Link
            to="/privacy"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🔒</span>
            <span>Privacy</span>
          </Link>
          <Link
            to="/security"
            className="link link-hover inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">🛡️</span>
            <span>Security Policy</span>
          </Link>
        </div>

        {/* <div className="flex items-center gap-2">
          <label htmlFor="theme-picker" className="text-sm">
            Theme
          </label>
          <select
            id="theme-picker"
            className="select select-bordered select-sm"
            value={theme}
            onChange={(e) => set_theme(e.target.value)}
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </footer>
  )
}
