import type { Question } from '@/lib/mock-data'

import { InputQuestion } from '@/components/questions/InputQuestion'
import { MCQQuestion } from '@/components/questions/MCQQuestion'
import { MRQQuestion } from '@/components/questions/MRQQuestion'

type QuestionRendererProps = {
  question: Question
  value: string | string[] | null
  onChange: (next: string | string[] | null) => void
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  if (question.type === 'MCQ') {
    return (
      <MCQQuestion
        question={question}
        value={typeof value === 'string' ? value : null}
        onChange={(next) => onChange(next)}
      />
    )
  }

  if (question.type === 'MRQ') {
    return (
      <MRQQuestion
        question={question}
        value={Array.isArray(value) ? value : []}
        onChange={(next) => onChange(next)}
      />
    )
  }

  return (
    <InputQuestion
      question={question}
      value={typeof value === 'string' ? value : ''}
      onChange={(next) => onChange(next)}
      autoFocus
    />
  )
}
