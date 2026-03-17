'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ScoreDonut } from '@/components/charts/ScoreDonut'
import { TimeLineChart } from '@/components/charts/TimeLineChart'
import { TopicAccuracy } from '@/components/charts/TopicAccuracy'
import { TypeBarChart } from '@/components/charts/TypeBarChart'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { QuestionCard } from '@/components/ui/QuestionCard'
import { getMockTestById } from '@/lib/mock-data'
import { calculateResults, type QuestionResult } from '@/lib/scoring'
import { getLatestCompletedAttempt, useTestStore } from '@/lib/store'

type Props = {
  params: { id: string }
}

function formatSeconds(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}m ${r}s`
}

function isUnanswered(r: QuestionResult) {
  if (r.userAnswer === null) return true
  if (Array.isArray(r.userAnswer)) return r.userAnswer.length === 0
  return r.userAnswer.trim().length === 0
}

function answerToString(a: string | string[] | null) {
  if (a === null) return '—'
  if (Array.isArray(a)) return a.length ? a.join(', ') : '—'
  return a.trim().length ? a : '—'
}

function BreakdownItem({
  index,
  prompt,
  type,
  result,
  explanation
}: {
  index: number
  prompt: string
  type: string
  result: QuestionResult
  explanation: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    if (open) {
      gsap.fromTo(
        ref.current,
        { height: 0 },
        { height: 'auto', duration: 0.28, ease: 'power2.out' }
      )
    } else {
      gsap.to(ref.current, { height: 0, duration: 0.22, ease: 'power2.out' })
    }
  }, [open])

  const border = result.isCorrect
    ? 'border-l-4 border-l-emerald-500'
    : result.isPartiallyCorrect
      ? 'border-l-4 border-l-amber'
      : 'border-l-4 border-l-red-500'

  return (
    <div className={`rounded-2xl bg-cream card-edge p-5 ${border}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted">Q{index + 1}</div>
          <div className="mt-2 line-clamp-2 font-serif text-xl leading-snug">{prompt}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>{type}</Badge>
            {result.isCorrect ? (
              <Badge variant="success">✓ Correct</Badge>
            ) : result.isPartiallyCorrect ? (
              <Badge variant="amber">~ Partial</Badge>
            ) : isUnanswered(result) ? (
              <Badge variant="default">— Unanswered</Badge>
            ) : (
              <Badge variant="danger">✗ Incorrect</Badge>
            )}
          </div>
        </div>

        <div className="text-right text-sm text-muted">
          <div className="text-xs uppercase tracking-widest">Marks</div>
          <div className="mt-1 font-medium text-charcoal">{result.marksAwarded.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-2xl bg-charcoal/5 p-4">
          <div className="text-xs uppercase tracking-widest text-muted">Your answer</div>
          <div className="mt-2 text-charcoal">{answerToString(result.userAnswer)}</div>
        </div>
        <div className="rounded-2xl bg-charcoal/5 p-4">
          <div className="text-xs uppercase tracking-widest text-muted">Correct</div>
          <div className="mt-2 text-charcoal">{answerToString(result.correctAnswer)}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={
          'mt-4 inline-flex items-center gap-2 text-sm font-medium ' +
          (open ? 'text-amber' : 'text-muted hover:text-charcoal')
        }
      >
        View Explanation
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      <div ref={ref} className="h-0 overflow-hidden">
        <div className="mt-3 rounded-2xl bg-charcoal/5 p-4 text-sm text-charcoal">
          {explanation}
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage({ params }: Props) {
  const router = useRouter()
  const test = getMockTestById(params.id)

  const completedAttempts = useTestStore((s) => s.completedAttempts)
  const startTest = useTestStore((s) => s.startTest)

  const attempt = test ? getLatestCompletedAttempt(completedAttempts, test.id) : undefined

  useEffect(() => {
    if (!test) return
    if (!attempt) router.replace('/tests')
  }, [attempt, router, test])

  const results = useMemo(() => {
    if (!test || !attempt) return null
    return calculateResults(attempt, test)
  }, [attempt, test])

  const correct = results ? results.perQuestion.filter((r) => r.isCorrect).length : 0
  const partial = results ? results.perQuestion.filter((r) => r.isPartiallyCorrect).length : 0
  const unanswered = results ? results.perQuestion.filter((r) => isUnanswered(r)).length : 0
  const incorrect = results ? results.perQuestion.length - correct - unanswered : 0

  const percentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!results || !percentRef.current) return

    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: results.percentage,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        if (!percentRef.current) return
        percentRef.current.textContent = `${Math.round(obj.v)}%`
      }
    })

    return () => {
      tween.kill()
    }
  }, [results])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.results-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%'
            }
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  if (!test || !attempt || !results) return null

  const secondsByQuestion = results.timeDistribution.map((t) => t.seconds)

  const topicRows = (() => {
    const acc: Record<string, { total: number; score: number }> = {}

    test.questions.forEach((q) => {
      const tags = q.tags ?? []
      if (tags.length === 0) return

      const r = results.perQuestion.find((pq) => pq.questionId === q.id)
      if (!r) return

      const credit = r.isCorrect ? 1 : r.isPartiallyCorrect ? 0.5 : 0

      for (const tag of tags) {
        acc[tag] ??= { total: 0, score: 0 }
        acc[tag].total += 1
        acc[tag].score += credit
      }
    })

    return Object.entries(acc)
      .map(([topic, v]) => ({ topic, accuracy: v.total ? (v.score / v.total) * 100 : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy)
  })()

  const totalTime = results.timeDistribution.reduce((s, t) => s + t.seconds, 0)
  const incorrectTime = results.timeDistribution.reduce((s, t) => {
    const r = results.perQuestion.find((pq) => pq.questionId === t.questionId)
    if (!r) return s
    if (r.isCorrect || r.isPartiallyCorrect || isUnanswered(r)) return s
    return s + t.seconds
  }, 0)

  const avg = secondsByQuestion.length ? totalTime / secondsByQuestion.length : 0
  const ranked = results.timeDistribution
    .map((t, idx) => ({ idx, ...t }))
    .sort((a, b) => b.seconds - a.seconds)

  const slowest = ranked.slice(0, 3).map((r) => r.idx + 1)
  const fastest = ranked.slice(-3).map((r) => r.idx + 1)

  const lowestTopic = topicRows.length ? topicRows[0] : null

  return (
    <div>
      <section className="bg-dark bg-dark-glow text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr,340px] md:items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60">Results</div>
              <h1 className="mt-4 font-serif text-[clamp(44px,6vw,80px)] leading-[0.98]">{test.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge variant={results.passed ? 'success' : 'danger'}>
                  {results.passed ? 'Passed' : 'Failed'}
                </Badge>
                <Badge variant="dark">Time taken: {formatSeconds(results.timeTaken)}</Badge>
                <Badge variant="dark">
                  Score: {results.totalScore.toFixed(2)} / {results.maxScore}
                </Badge>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    startTest(test)
                    router.push(`/tests/${test.id}`)
                  }}
                >
                  Retake Test
                </Button>
                <Button variant="secondary" onClick={() => router.push('/tests')}>
                  Back to Tests
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-dark/60 border border-white/10 p-7">
              <div className="text-xs uppercase tracking-widest text-white/60">Percentage</div>
              <div ref={percentRef} className="mt-4 font-serif text-6xl tracking-tight text-white">
                0%
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-white/70">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <div className="text-white/60">Correct</div>
                  <div className="mt-1 text-sm text-white">{correct}</div>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <div className="text-white/60">Incorrect</div>
                  <div className="mt-1 text-sm text-white">{incorrect}</div>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <div className="text-white/60">Unanswered</div>
                  <div className="mt-1 text-sm text-white">{unanswered}</div>
                </div>
              </div>
              {partial > 0 ? (
                <div className="mt-3 text-xs text-amber">Partial credit: {partial}</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="results-reveal mx-auto max-w-6xl px-5 py-14 md:py-20">
        <h2 className="font-serif text-4xl">Performance Overview</h2>
        <p className="mt-3 max-w-2xl text-[16px] font-light text-muted">
          A quick read on accuracy, question types, and where time went.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <ScoreDonut correct={correct} incorrect={incorrect} unanswered={unanswered} />
          <TypeBarChart byType={results.byType} />
          <TimeLineChart secondsByQuestion={secondsByQuestion} />
        </div>
      </section>

      <section className="results-reveal mx-auto max-w-6xl px-5 pb-14 md:pb-20">
        <h2 className="font-serif text-4xl">Question Breakdown</h2>
        <div className="mt-10 grid gap-4">
          {test.questions.map((q, idx) => {
            const r = results.perQuestion.find((p) => p.questionId === q.id)
            if (!r) return null
            return (
              <BreakdownItem
                key={q.id}
                index={idx}
                prompt={q.prompt}
                type={q.type}
                result={r}
                explanation={q.explanation}
              />
            )
          })}
        </div>
      </section>

      {topicRows.length > 0 ? (
        <section className="results-reveal mx-auto max-w-6xl px-5 pb-14 md:pb-20">
          <h2 className="font-serif text-4xl">Topic Analysis</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr,380px]">
            <TopicAccuracy data={topicRows} />
            <QuestionCard title="Recommendation">
              <div className="text-sm text-muted">
                {lowestTopic && lowestTopic.accuracy < 50
                  ? `Focus on “${lowestTopic.topic}” — your accuracy is ${lowestTopic.accuracy.toFixed(0)}%.`
                  : 'No single weak topic stands out. Keep iterating with a fresh attempt.'}
              </div>
            </QuestionCard>
          </div>
        </section>
      ) : null}

      <section className="results-reveal mx-auto max-w-6xl px-5 pb-20 md:pb-24">
        <h2 className="font-serif text-4xl">Time Analysis</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <QuestionCard title="Pace">
            <div className="text-sm text-muted">Average time per question</div>
            <div className="mt-3 font-serif text-4xl">{avg.toFixed(1)}s</div>
          </QuestionCard>
          <QuestionCard title="Extremes">
            <div className="text-sm text-muted">Slowest 3: {slowest.join(', ')}</div>
            <div className="mt-2 text-sm text-muted">Fastest 3: {fastest.join(', ')}</div>
          </QuestionCard>
          <QuestionCard title="Where time went">
            <div className="text-sm text-muted">Time on incorrect answers</div>
            <div className="mt-3 font-serif text-4xl">
              {totalTime > 0 ? ((incorrectTime / totalTime) * 100).toFixed(0) : '0'}%
            </div>
          </QuestionCard>
        </div>
      </section>
    </div>
  )
}
