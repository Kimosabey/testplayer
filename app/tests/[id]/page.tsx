'use client'

import { gsap } from 'gsap'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { QuestionRenderer } from '@/components/questions/QuestionRenderer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Timer } from '@/components/ui/Timer'
import { useLenisManager } from '@/lib/lenis'
import { getMockTestById } from '@/lib/mock-data'
import { useTestStore } from '@/lib/store'

type Props = {
  params: { id: string }
}

function isAnswered(answer: string | string[] | null) {
  if (answer === null) return false
  if (Array.isArray(answer)) return answer.length > 0
  return answer.trim().length > 0
}

export default function TestTakingPage({ params }: Props) {
  const router = useRouter()
  const manager = useLenisManager()

  const test = getMockTestById(params.id)

  const activeAttempt = useTestStore((s) => s.activeAttempt)
  const flaggedQuestionIds = useTestStore((s) => s.flaggedQuestionIds)
  const currentQuestionIndex = useTestStore((s) => s.currentQuestionIndex)

  const startTest = useTestStore((s) => s.startTest)
  const answerQuestion = useTestStore((s) => s.answerQuestion)
  const toggleFlag = useTestStore((s) => s.toggleFlag)
  const navigateToQuestion = useTestStore((s) => s.navigateToQuestion)
  const submitTest = useTestStore((s) => s.submitTest)

  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
  const [submitOpen, setSubmitOpen] = useState(false)

  const contentRef = useRef<HTMLDivElement | null>(null)
  const questionEnteredAtRef = useRef<number>(Date.now())
  const lastQuestionIdRef = useRef<string | null>(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (!manager) return

    manager.destroy()
    return () => manager.recreate()
  }, [manager])

  useEffect(() => {
    if (!test) return

    if (!activeAttempt || activeAttempt.testId !== test.id || activeAttempt.submittedAt) {
      startTest(test)
    }
  }, [activeAttempt, startTest, test])

  const attempt = activeAttempt && test && activeAttempt.testId === test.id ? activeAttempt : null

  const currentIndex = test
    ? Math.max(0, Math.min(currentQuestionIndex, test.questions.length - 1))
    : 0

  const question = test ? test.questions[currentIndex] : null

  const questionId = question?.id ?? null
  const attemptStartedAt = attempt?.startedAt ?? null


  const currentAnswer = useMemo(() => {
    if (!attempt || !question) return null
    return attempt.answers.find((a) => a.questionId === question.id)?.answer ?? null
  }, [attempt, question])

  const unansweredCount = useMemo(() => {
    if (!attempt) return 0
    return attempt.answers.filter((a) => !isAnswered(a.answer)).length
  }, [attempt])

  const hasAnyAnswer = useMemo(() => {
    if (!attempt) return false
    return attempt.answers.some((a) => isAnswered(a.answer))
  }, [attempt])

  const commitTimeForQuestion = useCallback((questionId: string) => {
    if (!questionId) return

    const startedAt = questionEnteredAtRef.current
    const elapsed = Math.round((Date.now() - startedAt) / 1000)
    if (elapsed <= 0) return

    const state = useTestStore.getState()
    const liveAttempt = state.activeAttempt
    if (!liveAttempt || liveAttempt.submittedAt) return

    const existing = liveAttempt.answers.find((a) => a.questionId === questionId)
    if (!existing) return

    state.answerQuestion({
      questionId,
      answer: existing.answer,
      timeTaken: existing.timeTaken + elapsed
    })

    questionEnteredAtRef.current = Date.now()
  }, [])

  useEffect(() => {
    if (!questionId) return

    const prevId = lastQuestionIdRef.current
    if (prevId) commitTimeForQuestion(prevId)

    lastQuestionIdRef.current = questionId
    questionEnteredAtRef.current = Date.now()

    if (!contentRef.current) return
    const tween = gsap.fromTo(
      contentRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out' }
    )
    return () => {
      tween.kill()
    }
  }, [commitTimeForQuestion, questionId])

  useEffect(() => {
    if (!attemptStartedAt || !test) return

    const endAt = attemptStartedAt + test.duration * 1000

    const tick = () => {
      const next = Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
      setSecondsRemaining(next)

      if (next <= 0 && !submittingRef.current) {
        submittingRef.current = true
        commitTimeForQuestion(test.questions[currentIndex]?.id ?? '')
        submitTest()
        router.replace(`/tests/${test.id}/results`)
      }
    }

    tick()
    const id = window.setInterval(tick, 500)
    return () => window.clearInterval(id)
  }, [attemptStartedAt, commitTimeForQuestion, currentIndex, router, submitTest, test])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!test || !question) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateToQuestion(Math.max(0, currentIndex - 1))
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateToQuestion(Math.min(test.questions.length - 1, currentIndex + 1))
      }

      if (question.type === 'MCQ' && question.options && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1
        const opt = question.options[idx]
        if (!opt) return
        answerQuestion({
          questionId: question.id,
          answer: opt.id,
          timeTaken: attempt?.answers.find((a) => a.questionId === question.id)?.timeTaken ?? 0
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [answerQuestion, currentIndex, navigateToQuestion, question, test, attempt])

  if (!test) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <div className="rounded-3xl bg-cream card-edge p-8">
          <div className="font-serif text-3xl">Test not found</div>
          <p className="mt-3 text-muted">This test ID does not exist in the mock data.</p>
          <div className="mt-6">
            <Button href="/tests" variant="primary">
              Back to tests
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!attempt || !question) {
    return null
  }

  const handleAnswerChange = (next: string | string[] | null) => {
    const existing = attempt.answers.find((a) => a.questionId === question.id)
    answerQuestion({
      questionId: question.id,
      answer: next,
      timeTaken: existing?.timeTaken ?? 0
    })
  }

  const confirmSubmit = () => {
    if (submittingRef.current) return
    submittingRef.current = true

    commitTimeForQuestion(question.id)
    submitTest()
    router.replace(`/tests/${test.id}/results`)
  }

  return (
    <div className="h-screen overflow-hidden">
      <Modal
        isOpen={submitOpen}
        title="Submit test?"
        description={
          unansweredCount > 0
            ? `${unansweredCount} question(s) unanswered. Are you sure you want to submit?`
            : 'Ready to submit your attempt?'
        }
        confirmLabel="Submit"
        cancelLabel="Keep working"
        onConfirm={confirmSubmit}
        onClose={() => setSubmitOpen(false)}
        danger
      />

      <div className="flex h-full flex-col md:flex-row">
        <aside className="bg-dark bg-dark-glow text-white md:w-[30%]">
          <div className="flex h-full flex-col p-6">
            <div>
              <div className="font-serif text-2xl leading-tight text-white">{test.title}</div>
              <div className="mt-4">
                <div className="text-xs uppercase tracking-widest text-white/60">Time left</div>
                <Timer
                  secondsRemaining={secondsRemaining}
                  durationSeconds={test.duration}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 text-xs uppercase tracking-widest text-white/60">Questions</div>
              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((q, idx) => {
                  const ans = attempt.answers.find((a) => a.questionId === q.id)?.answer ?? null
                  const answered = isAnswered(ans)
                  const flagged = flaggedQuestionIds.includes(q.id)
                  const current = idx === currentIndex

                  const base =
                    'relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold transition-colors'

                  let cls = 'border border-white/15 text-white/70 hover:bg-white/5'
                  if (answered) cls = 'border border-amber/40 bg-amber text-dark'
                  if (flagged) cls = 'border border-amber/40 text-amber hover:bg-amber/10'
                  if (current) cls = 'bg-charcoal text-cream'

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={`${base} ${cls}`}
                      onClick={() => navigateToQuestion(idx)}
                      aria-label={`Go to question ${idx + 1}`}
                    >
                      {idx + 1}
                      {flagged ? (
                        <span className="absolute -right-1 -top-1 rounded-full bg-amber px-1.5 py-0.5 text-[10px] font-bold text-dark">
                          !
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Button
                variant={hasAnyAnswer ? 'danger' : 'secondary'}
                className="w-full"
                disabled={!hasAnyAnswer}
                onClick={() => setSubmitOpen(true)}
              >
                Submit Test
              </Button>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-cream">
          <div className="flex h-full flex-col px-5 py-6 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="amber">
                  Q{currentIndex + 1} / {test.questions.length}
                </Badge>
                <Badge>{question.type}</Badge>
              </div>

              <div className="text-sm text-muted">
                +{question.marks} {question.negativeMarks ? `| -${question.negativeMarks}` : null}
              </div>
            </div>

            <div ref={contentRef} className="mt-8">
              <div className="font-serif text-3xl leading-snug text-charcoal">{question.prompt}</div>

              <div className="mt-6">
                <QuestionRenderer question={question} value={currentAnswer} onChange={handleAnswerChange} />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-10">
              <Button
                variant="secondary"
                onClick={() => navigateToQuestion(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                ← Prev
              </Button>

              <button
                type="button"
                onClick={() => toggleFlag(question.id)}
                className={
                  'rounded-full px-5 py-3 text-sm card-edge transition-colors ' +
                  (flaggedQuestionIds.includes(question.id)
                    ? 'bg-amber/10 text-amber'
                    : 'bg-cream text-muted hover:bg-charcoal/5')
                }
              >
                Flag Question
              </button>

              <Button
                variant="secondary"
                onClick={() => navigateToQuestion(Math.min(test.questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === test.questions.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
