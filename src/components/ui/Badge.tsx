import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  color?: 'blue' | 'yellow' | 'green' | 'gray'
  className?: string
}

const COLOR_STYLES = {
  blue: 'bg-blue/10 text-blue',
  yellow: 'bg-yellow/20 text-yellow-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-600',
}

export default function Badge({ label, color = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        COLOR_STYLES[color],
        className,
      )}
    >
      {label}
    </span>
  )
}
