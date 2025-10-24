import type { ReactNode } from "react"
import { GlobalNavbar } from "../global_navbar/global_navbar"
import { GlobalFooter } from "../global_footer/global_footer"

export function GlobalLayout(props: { children: ReactNode }) {
  return (
    <div>
      <GlobalNavbar />
      <div className="px-4 py-4">{props.children}</div>
      <GlobalFooter />
    </div>
  )
}
