export function ParamsSection(props: {
  title?: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-base-200 bg-base-100">
      {(props.title || props.description) && (
        <header className="px-4 py-3 border-b border-base-200">
          {props.title && (
            <h2 className="text-lg font-semibold text-base-content">
              {props.title}
            </h2>
          )}
          {props.description && (
            <p className="mt-1 text-sm text-base-content/70">
              {props.description}
            </p>
          )}
        </header>
      )}
      <div className="p-4">{props.children}</div>
    </section>
  )
}
