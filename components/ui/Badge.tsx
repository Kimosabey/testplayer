import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type BadgeVariant = 'default' | 'amber' | 'dark' | 'success' | 'danger'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'border border-subtle text-muted',
  amber: 'border border-amber/30 text-amber',
  dark: 'border border-white/15 text-white/80',
  success: 'border border-emerald-600/25 text-emerald-700',
  danger: 'border border-red-600/25 text-red-700'
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  )
}
