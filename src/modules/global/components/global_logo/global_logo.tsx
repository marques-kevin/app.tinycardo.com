export const GlobalLogo = (props: { className?: string }) => (
  <div className={props.className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="group h-full w-full"
      viewBox="0 0 260 260"
      fill="none"
    >
      <rect
        width={160}
        height={122}
        x={236.236}
        y={68.474}
        className="stroke-primary-content fill-primary transition-all ease-in-out group-hover:translate-x-4"
        strokeWidth={10}
        rx={29}
        transform="rotate(100.062 236.236 68.474)"
      />
      <rect
        width={181}
        height={141}
        x={199}
        className="stroke-secondary-content fill-secondary"
        y={34}
        strokeWidth={10}
        rx={29}
        transform="rotate(90 199 34)"
      />
    </svg>
  </div>
)
