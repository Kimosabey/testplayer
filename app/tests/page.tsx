'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockTests, type Test } from '@/lib/mock-data'
import { calculateResults } from '@/lib/scoring'
import { getLatestCompletedAttempt, useTestStore } from '@/lib/store'

type DifficultyFilter = 'All' | Test['difficulty']

function difficultyVariant(difficulty: Test['difficulty']) {
  if (difficulty === 'Easy') return 'success'
  if (difficulty === 'Hard') return 'danger'
  return 'amber'
}

export default function TestsPage() {
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All')
  const [query, setQuery] = useState('')

  const activeAttempt = useTestStore((s) => s.activeAttempt)
  const completedAttempts = useTestStore((s) => s.completedAttempts)
  const startTest = useTestStore((s) => s.startTest)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return mockTests.filter((t) => {
      const matchesDifficulty = difficulty === 'All' ? true : t.difficulty === difficulty
      const matchesQuery =
        q.length === 0
          ? true
          : t.title.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))

      return matchesDifficulty && matchesQuery
    })
  }, [difficulty, query])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.test-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [filtered.length])

  const onStartOrResume = (test: Test) => {
    startTest(test)
    router.push(`/tests/${test.id}`)
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-[clamp(40px,5vw,56px)] leading-[1.02]">
            Available Tests
          </h1>
          <p className="mt-4 max-w-xl text-[16px] font-light text-muted">
            Pick a test, stay focused, and review results with real breakdowns.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-[360px]">
          <label className="text-xs uppercase tracking-widest text-muted">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or tag…"
            className="h-12 rounded-2xl bg-cream card-edge px-4 text-sm outline-none placeholder:text-muted/70"
          />
        </div>
      </header>

      <div className="mt-10 flex flex-wrap items-center gap-2">
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => {
          const active = difficulty === d
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={
                'rounded-full px-4 py-2 text-sm card-edge transition-colors ' +
                (active ? 'bg-charcoal text-cream' : 'bg-cream text-muted hover:bg-charcoal/5')
              }
            >
              {d}
            </button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {filtered.map((test) => {
          const isActive = activeAttempt?.testId === test.id && !activeAttempt?.submittedAt
          const completed = getLatestCompletedAttempt(completedAttempts, test.id)

          const lastScore = completed ? calculateResults(completed, test).percentage : null

          return (
            <article key={test.id} className="test-card rounded-3xl bg-cream card-edge p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl leading-tight">{test.title}</div>
                  <p className="mt-2 line-clamp-2 text-[15px] font-light text-muted">
                    {test.description}
                  </p>
                </div>

                <Badge variant={difficultyVariant(test.difficulty)}>{test.difficulty}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {test.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
                {lastScore !== null ? (
                  <Badge variant="amber">Last score {lastScore.toFixed(0)}%</Badge>
                ) : null}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted sm:grid-cols-3">
                <div className="rounded-2xl bg-charcoal/5 px-4 py-3">
                  <div className="text-charcoal">Questions</div>
                  <div className="mt-1 text-sm text-charcoal">{test.questions.length}</div>
                </div>
                <div className="rounded-2xl bg-charcoal/5 px-4 py-3">
                  <div className="text-charcoal">Duration</div>
                  <div className="mt-1 text-sm text-charcoal">{Math.round(test.duration / 60)}m</div>
                </div>
                <div className="rounded-2xl bg-charcoal/5 px-4 py-3">
                  <div className="text-charcoal">Total marks</div>
                  <div className="mt-1 text-sm text-charcoal">{test.totalMarks}</div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => onStartOrResume(test)}
                >
                  {isActive ? 'Resume Test' : 'Start Test'}
                </Button>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl bg-cream card-edge p-10 text-center text-muted">
          No tests match your filters.
        </div>
      ) : null}
    </div>
  )
}
