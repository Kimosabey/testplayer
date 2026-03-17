'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AttemptAnswer, Test, TestAttempt } from '@/lib/mock-data'

type StoreState = {
  activeAttempt: TestAttempt | null
  currentQuestionIndex: number
  completedAttempts: TestAttempt[]
  flaggedQuestionIds: string[]

  startTest: (test: Test) => void
  answerQuestion: (input: {
    questionId: string
    answer: AttemptAnswer['answer']
    timeTaken: number
  }) => void
  toggleFlag: (questionId: string) => void
  navigateToQuestion: (index: number) => void
  submitTest: () => void
  abandonActiveAttempt: () => void
}

function upsertAnswer(
  answers: AttemptAnswer[],
  next: Pick<AttemptAnswer, 'questionId' | 'answer' | 'timeTaken'>
) {
  const idx = answers.findIndex((a) => a.questionId === next.questionId)
  if (idx === -1) return [...answers, { ...next }]

  const copy = answers.slice()
  copy[idx] = { ...copy[idx], ...next }
  return copy
}

export const useTestStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activeAttempt: null,
      currentQuestionIndex: 0,
      completedAttempts: [],
      flaggedQuestionIds: [],

      startTest: (test) => {
        const existing = get().activeAttempt
        if (existing && existing.testId === test.id && !existing.submittedAt) {
          return
        }

        set({
          activeAttempt: {
            testId: test.id,
            answers: test.questions.map((q) => ({
              questionId: q.id,
              answer: null,
              timeTaken: 0
            })),
            startedAt: Date.now()
          },
          flaggedQuestionIds: [],
          currentQuestionIndex: 0
        })
      },

      answerQuestion: ({ questionId, answer, timeTaken }) => {
        const attempt = get().activeAttempt
        if (!attempt || attempt.submittedAt) return

        set({
          activeAttempt: {
            ...attempt,
            answers: upsertAnswer(attempt.answers, { questionId, answer, timeTaken })
          }
        })
      },

      toggleFlag: (questionId) => {
        const attempt = get().activeAttempt
        if (!attempt || attempt.submittedAt) return

        set((state) => {
          const setIds = new Set(state.flaggedQuestionIds)
          if (setIds.has(questionId)) setIds.delete(questionId)
          else setIds.add(questionId)

          return { flaggedQuestionIds: Array.from(setIds) }
        })
      },

      navigateToQuestion: (index) => {
        set({ currentQuestionIndex: Math.max(0, index) })
      },

      submitTest: () => {
        const attempt = get().activeAttempt
        if (!attempt || attempt.submittedAt) return

        const submitted: TestAttempt = {
          ...attempt,
          submittedAt: Date.now()
        }

        set((state) => ({
          activeAttempt: null,
          currentQuestionIndex: 0,
          flaggedQuestionIds: [],
          completedAttempts: [submitted, ...state.completedAttempts]
        }))
      },

      abandonActiveAttempt: () => {
        set({ activeAttempt: null, currentQuestionIndex: 0, flaggedQuestionIds: [] })
      }
    }),
    {
      name: 'testplayer-store',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export function getLatestCompletedAttempt(
  attempts: TestAttempt[],
  testId: string
): TestAttempt | undefined {
  return attempts.find((a) => a.testId === testId && Boolean(a.submittedAt))
}
