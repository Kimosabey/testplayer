import type { AttemptAnswer, Question, QuestionType, Test, TestAttempt } from '@/lib/mock-data'

export type TypeStats = {
  total: number
  attempted: number
  correct: number
  partiallyCorrect: number
  accuracy: number
  score: number
  maxScore: number
  avgTime: number
}

export type QuestionResult = {
  questionId: string
  isCorrect: boolean
  isPartiallyCorrect: boolean
  marksAwarded: number
  userAnswer: string | string[] | null
  correctAnswer: string | string[]
}

export type Results = {
  totalScore: number
  maxScore: number
  percentage: number
  passed: boolean
  timeTaken: number
  perQuestion: QuestionResult[]
  byType: Record<QuestionType, TypeStats>
  timeDistribution: { questionId: string; seconds: number }[]
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function normalizeText(s: string) {
  return s.trim().toLowerCase()
}

function isNumericString(s: string) {
  const n = Number(s)
  return Number.isFinite(n) && s.trim() !== ''
}

function answersByQuestionId(answers: AttemptAnswer[]) {
  const map = new Map<string, AttemptAnswer>()
  for (const a of answers) map.set(a.questionId, a)
  return map
}

function scoreMCQOrInput({
  user,
  correct,
  marks,
  negativeMarks,
  allowNumericFuzzy
}: {
  user: string | null
  correct: string
  marks: number
  negativeMarks?: number
  allowNumericFuzzy: boolean
}) {
  if (user === null) {
    return { isCorrect: false, marksAwarded: 0 }
  }

  const u = normalizeText(user)
  const c = normalizeText(correct)

  let ok: boolean

  if (allowNumericFuzzy && isNumericString(u) && isNumericString(c)) {
    const uv = Number(u)
    const cv = Number(c)
    const tol = Math.max(Math.abs(cv) * 0.05, cv === 0 ? 0.05 : 0)
    ok = Math.abs(uv - cv) <= tol
  } else {
    ok = u === c
  }

  if (ok) return { isCorrect: true, marksAwarded: marks }
  return { isCorrect: false, marksAwarded: negativeMarks ? -negativeMarks : 0 }
}

function scoreMRQ({
  user,
  correct,
  marks,
  negativeMarks,
  totalOptions
}: {
  user: string[] | null
  correct: string[]
  marks: number
  negativeMarks?: number
  totalOptions: number
}) {
  if (!user || user.length === 0) {
    return { isCorrect: false, isPartiallyCorrect: false, marksAwarded: 0 }
  }

  const correctSet = new Set(correct)
  const userSet = new Set(user)

  let correctSelected = 0
  let wrongSelected = 0

  for (const v of userSet) {
    if (correctSet.has(v)) correctSelected += 1
    else wrongSelected += 1
  }

  const correctCount = correctSet.size
  const wrongPool = Math.max(1, totalOptions - correctCount)

  const positive = marks * (correctSelected / correctCount)
  const maxPenalty = negativeMarks ?? 0
  const penalty = maxPenalty > 0 ? maxPenalty * (wrongSelected / wrongPool) : 0

  const raw = positive - penalty
  const marksAwarded = clamp(raw, -maxPenalty, marks)

  const isCorrect = correctSelected === correctCount && wrongSelected === 0
  const isPartiallyCorrect = !isCorrect && correctSelected > 0

  return { isCorrect, isPartiallyCorrect, marksAwarded }
}

export function calculateResults(attempt: TestAttempt, test: Test): Results {
  const byId = answersByQuestionId(attempt.answers)

  const perQuestion: QuestionResult[] = []
  const timeDistribution: { questionId: string; seconds: number }[] = []

  const maxScore = test.questions.reduce((sum, q) => sum + q.marks, 0)

  const byType: Record<QuestionType, Omit<TypeStats, 'accuracy'>> = {
    MCQ: {
      total: 0,
      attempted: 0,
      correct: 0,
      partiallyCorrect: 0,
      score: 0,
      maxScore: 0,
      avgTime: 0
    },
    MRQ: {
      total: 0,
      attempted: 0,
      correct: 0,
      partiallyCorrect: 0,
      score: 0,
      maxScore: 0,
      avgTime: 0
    },
    INPUT: {
      total: 0,
      attempted: 0,
      correct: 0,
      partiallyCorrect: 0,
      score: 0,
      maxScore: 0,
      avgTime: 0
    }
  }

  const timeByType: Record<QuestionType, number> = { MCQ: 0, MRQ: 0, INPUT: 0 }

  let totalScore = 0

  for (const q of test.questions) {
    const a = byId.get(q.id)
    const userAnswer = a?.answer ?? null
    const seconds = a?.timeTaken ?? 0

    timeDistribution.push({ questionId: q.id, seconds })

    const bucket = byType[q.type]
    bucket.total += 1
    bucket.maxScore += q.marks
    if (userAnswer !== null) bucket.attempted += 1
    timeByType[q.type] += seconds

    const result = scoreQuestion(q, userAnswer)

    totalScore += result.marksAwarded
    bucket.score += result.marksAwarded
    if (result.isCorrect) bucket.correct += 1
    if (result.isPartiallyCorrect) bucket.partiallyCorrect += 1

    perQuestion.push({
      questionId: q.id,
      isCorrect: result.isCorrect,
      isPartiallyCorrect: result.isPartiallyCorrect,
      marksAwarded: result.marksAwarded,
      userAnswer,
      correctAnswer: q.correctAnswer
    })
  }

  const byTypeFinal: Record<QuestionType, TypeStats> = {
    MCQ: finalizeTypeStats('MCQ', byType, timeByType),
    MRQ: finalizeTypeStats('MRQ', byType, timeByType),
    INPUT: finalizeTypeStats('INPUT', byType, timeByType)
  }

  const timeTaken =
    attempt.submittedAt && attempt.submittedAt >= attempt.startedAt
      ? Math.round((attempt.submittedAt - attempt.startedAt) / 1000)
      : Math.round(timeDistribution.reduce((s, t) => s + t.seconds, 0))

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

  return {
    totalScore,
    maxScore,
    percentage,
    passed: totalScore >= test.passingMarks,
    timeTaken,
    perQuestion,
    byType: byTypeFinal,
    timeDistribution
  }
}

function finalizeTypeStats(
  type: QuestionType,
  raw: Record<QuestionType, Omit<TypeStats, 'accuracy'>>,
  timeByType: Record<QuestionType, number>
): TypeStats {
  const r = raw[type]
  const accuracy = r.total > 0 ? (r.correct + r.partiallyCorrect * 0.5) / r.total : 0
  const avgTime = r.total > 0 ? timeByType[type] / r.total : 0

  return {
    ...r,
    accuracy,
    avgTime
  }
}

function scoreQuestion(q: Question, userAnswer: string | string[] | null) {
  if (q.type === 'MRQ') {
    const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]
    const user = Array.isArray(userAnswer) ? userAnswer : null
    const totalOptions = q.options?.length ?? correct.length
    return scoreMRQ({
      user,
      correct,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      totalOptions
    })
  }

  if (q.type === 'MCQ') {
    const correct = typeof q.correctAnswer === 'string' ? q.correctAnswer : q.correctAnswer[0]
    const user = typeof userAnswer === 'string' ? userAnswer : null
    return {
      ...scoreMCQOrInput({
        user,
        correct,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        allowNumericFuzzy: false
      }),
      isPartiallyCorrect: false
    }
  }

  const correct = typeof q.correctAnswer === 'string' ? q.correctAnswer : q.correctAnswer[0]
  const user = typeof userAnswer === 'string' ? userAnswer : null
  return {
    ...scoreMCQOrInput({
      user,
      correct,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      allowNumericFuzzy: true
    }),
    isPartiallyCorrect: false
  }
}
