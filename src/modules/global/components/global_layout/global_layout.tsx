import type { ReactNode } from "react"

export function GlobalLayout(props: { children: ReactNode }) {
  return <div className="container mx-auto px-4">{props.children}</div>
}
