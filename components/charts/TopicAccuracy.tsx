'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

type TopicRow = {
  topic: string
  accuracy: number
}

type TopicAccuracyProps = {
  data: TopicRow[]
}

export function TopicAccuracy({ data }: TopicAccuracyProps) {
  return (
    <div className="h-72 w-full rounded-2xl bg-cream card-edge p-4">
      <div className="mb-3 text-sm font-medium text-charcoal">Topic accuracy</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid stroke="rgba(26,26,26,0.08)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="topic"
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            formatter={(v) => [`${Number(v).toFixed(0)}%`, 'Accuracy']}
            contentStyle={{
              background: '#FAF6EF',
              border: '1px solid rgba(26,26,26,0.08)',
              borderRadius: 12
            }}
          />
          <Bar dataKey="accuracy" fill="#E07B39" radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
