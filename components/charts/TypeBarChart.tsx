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

type Row = {
  type: string
  scorePct: number
}

type TypeBarChartProps = {
  byType: {
    MCQ: { score: number; maxScore: number }
    MRQ: { score: number; maxScore: number }
    INPUT: { score: number; maxScore: number }
  }
}

export function TypeBarChart({ byType }: TypeBarChartProps) {
  const data: Row[] = [
    {
      type: 'MCQ',
      scorePct: byType.MCQ.maxScore ? (byType.MCQ.score / byType.MCQ.maxScore) * 100 : 0
    },
    {
      type: 'MRQ',
      scorePct: byType.MRQ.maxScore ? (byType.MRQ.score / byType.MRQ.maxScore) * 100 : 0
    },
    {
      type: 'INPUT',
      scorePct: byType.INPUT.maxScore
        ? (byType.INPUT.score / byType.INPUT.maxScore) * 100
        : 0
    }
  ]

  return (
    <div className="h-64 w-full rounded-2xl bg-cream card-edge p-4">
      <div className="mb-3 text-sm font-medium text-charcoal">Score by type</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={18} margin={{ left: 0, right: 0 }}>
          <CartesianGrid stroke="rgba(26,26,26,0.08)" vertical={false} />
          <XAxis dataKey="type" tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            width={36}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(0)}%`, 'Score']}
            contentStyle={{
              background: '#FAF6EF',
              border: '1px solid rgba(26,26,26,0.08)',
              borderRadius: 12
            }}
          />
          <Bar dataKey="scorePct" fill="#E07B39" radius={[12, 12, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
