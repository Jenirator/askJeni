import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-btn transition-colors disabled:opacity-50',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-10 px-4 text-sm',
        variant === 'primary' && 'bg-blue text-white hover:opacity-90',
        variant === 'secondary' && 'border border-blue text-blue hover:bg-blue/5',
        variant === 'ghost' && 'text-gray-500 hover:text-navy hover:bg-gray-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
