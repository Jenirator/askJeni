interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
}

export default function ProgressRing({
  value,
  size = 80,
  strokeWidth = 7,
  label,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const cx = size / 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--color-blue)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-lg font-bold text-navy">{value}</span>
        {label && <span className="text-[9px] text-gray-400 mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
