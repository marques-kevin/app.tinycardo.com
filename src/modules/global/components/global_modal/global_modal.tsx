import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export interface ModalProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: ReactNode
  is_open: boolean
  actions?: ReactNode
  on_close: () => void
}

export function GlobalModal({
  title,
  description,
  icon: Icon,
  children,
  is_open,
  actions,
  on_close,
}: ModalProps) {
  return (
    <dialog className="modal" open={is_open} onClose={on_close}>
      <div className="modal-box w-full max-w-2xl space-y-4">
        {Icon && <Icon className="text-accent-content fill-accent size-8" />}

        <header>
          <h3 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            {title}
          </h3>

          {description && <p className="text-base-content/80">{description}</p>}
        </header>

        {children && <div>{children}</div>}

        <footer className="modal-action justify-between">
          <button className="btn btn-lg btn-ghost" onClick={on_close}>
            Close
          </button>

          {actions && actions}
        </footer>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={on_close}>
        <button>close</button>
      </form>
    </dialog>
  )
}
