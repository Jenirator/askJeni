import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export default function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-white rounded-card border border-border p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
