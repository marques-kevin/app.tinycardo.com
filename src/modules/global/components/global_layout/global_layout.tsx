import type { ReactNode } from "react"

export function GlobalLayout(props: { children: ReactNode }) {
  return (
    <div className="bg-base-200 flex min-h-screen w-full lg:p-4">
      <div className="bg-base-100 border-base-300 w-full border lg:rounded-xl">
        <div className="container mx-auto px-4">{props.children}</div>
      </div>
    </div>
  )
}
