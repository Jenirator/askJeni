import { cn } from '@/lib/utils'

interface ChipProps {
  label: string
  variant?: 'learning' | 'confident' | 'verified' | 'neutral'
  className?: string
}

const VARIANT_STYLES = {
  learning: 'bg-yellow/20 text-yellow-700 border-yellow/40',
  confident: 'bg-blue/10 text-blue border-blue/20',
  verified: 'bg-blue text-white border-blue',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function Chip({ label, variant = 'neutral', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
