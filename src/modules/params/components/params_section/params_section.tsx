export function ParamsSection(props: {
  title?: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-base-300 bg-base-100 rounded-lg border">
      {(props.title || props.description) && (
        <header className="border-base-300 border-b p-4">
          {props.title && (
            <h2 className="text-base-content text-xl font-semibold">
              {props.title}
            </h2>
          )}
          {props.description && (
            <p className="text-base-content/70">{props.description}</p>
          )}
        </header>
      )}
      <div className="p-4">{props.children}</div>
    </section>
  )
}
