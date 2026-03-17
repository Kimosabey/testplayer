'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

type TimePoint = {
  question: number
  seconds: number
  isSlow: boolean
}

type TimeLineChartProps = {
  secondsByQuestion: number[]
}

export function TimeLineChart({ secondsByQuestion }: TimeLineChartProps) {
  const avg =
    secondsByQuestion.length > 0
      ? secondsByQuestion.reduce((s, n) => s + n, 0) / secondsByQuestion.length
      : 0

  const data: TimePoint[] = secondsByQuestion.map((seconds, i) => ({
    question: i + 1,
    seconds,
    isSlow: avg > 0 ? seconds > avg * 2 : false
  }))

  return (
    <div className="h-64 w-full rounded-2xl bg-cream card-edge p-4">
      <div className="mb-3 text-sm font-medium text-charcoal">Time per question</div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0 }}>
          <CartesianGrid stroke="rgba(26,26,26,0.08)" vertical={false} />
          <XAxis dataKey="question" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip
            formatter={(v) => [`${v}s`, 'Time']}
            contentStyle={{
              background: '#FAF6EF',
              border: '1px solid rgba(26,26,26,0.08)',
              borderRadius: 12
            }}
          />
          <Area
            dataKey="seconds"
            type="monotone"
            stroke="#1A1A1A"
            strokeWidth={2}
            fill="#E07B39"
            fillOpacity={0.18}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-muted">Avg. {avg.toFixed(1)}s (slow = &gt; 2× avg)</div>
    </div>
  )
}
