'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps
} from 'recharts'

const COLORS = {
  correct: '#E07B39',
  incorrect: '#1A1A1A',
  unanswered: '#FAF6EF'
} as const

type ScoreDonutProps = {
  correct: number
  incorrect: number
  unanswered: number
}

function DonutTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const p = payload[0]

  return (
    <div className="rounded-xl bg-cream card-edge px-3 py-2 text-xs text-charcoal">
      <div className="font-medium">{p.name}</div>
      <div className="text-muted">{p.value}</div>
    </div>
  )
}

export function ScoreDonut({ correct, incorrect, unanswered }: ScoreDonutProps) {
  const data = [
    { name: 'Correct', value: correct, key: 'correct' as const },
    { name: 'Incorrect', value: incorrect, key: 'incorrect' as const },
    { name: 'Unanswered', value: unanswered, key: 'unanswered' as const }
  ]

  return (
    <div className="h-64 w-full rounded-2xl bg-cream card-edge p-4">
      <div className="mb-3 text-sm font-medium text-charcoal">Answer split</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={55}
            outerRadius={85}
            stroke="rgba(26,26,26,0.08)"
            strokeWidth={1}
            paddingAngle={3}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.key]} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
