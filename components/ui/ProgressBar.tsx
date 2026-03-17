import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type ProgressBarProps = {
  value: number // 0..1
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value))

  return (
    <div className={twMerge(clsx('h-2 w-full rounded-full bg-charcoal/10', className))}>
      <div
        className="h-2 rounded-full bg-amber"
        style={{ transform: `scaleX(${clamped})`, transformOrigin: 'left' }}
      />
    </div>
  )
}
