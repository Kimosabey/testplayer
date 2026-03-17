import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`
}

type TimerProps = {
  secondsRemaining: number
  durationSeconds: number
  className?: string
}

export function Timer({ secondsRemaining, durationSeconds, className }: TimerProps) {
  const ratio = durationSeconds > 0 ? secondsRemaining / durationSeconds : 0

  const tone =
    ratio <= 0.1 ? 'text-red-500' : ratio <= 0.2 ? 'text-amber' : 'text-amber'

  return (
    <div
      className={twMerge(
        clsx('font-sans text-3xl tabular-nums tracking-tight', tone, className)
      )}
    >
      {formatTime(secondsRemaining)}
    </div>
  )
}
