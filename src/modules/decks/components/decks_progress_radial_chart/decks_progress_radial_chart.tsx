export function DecksProgressRadialChart(props: {
  total: number
  mastered: number
  size?: number
  thickness?: number
}) {
  const total = Math.max(props.total ?? 0, 0)
  const mastered_raw = Math.max(props.mastered ?? 0, 0)

  const mastered = Math.min(mastered_raw, total)

  const size = props.size ?? 48 // px
  const thickness = props.thickness ?? 6 // px

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  const mastered_length = total === 0 ? 0 : (mastered / total) * circumference
  // remaining portion not needed as base ring covers it

  // Start from -90deg so the chart begins at the top
  const rotation = -90

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="stroke-base-content/10"
        strokeWidth={thickness}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={0}
      />
      {mastered > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-success"
          strokeWidth={thickness}
          strokeDasharray={`${mastered_length} ${circumference - mastered_length}`}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
