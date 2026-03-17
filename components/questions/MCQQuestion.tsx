import type { Question } from '@/lib/mock-data'

type MCQQuestionProps = {
  question: Question
  value: string | null
  onChange: (next: string) => void
}

export function MCQQuestion({ question, value, onChange }: MCQQuestionProps) {
  if (!question.options) return null

  return (
    <div className="grid gap-3">
      {question.options.map((opt, idx) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={
              'group flex w-full items-start gap-4 rounded-2xl card-edge px-4 py-4 text-left transition-colors ' +
              (active ? 'bg-amber/10 border-amber/30' : 'bg-transparent hover:bg-charcoal/5')
            }
          >
            <span
              className={
                'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ' +
                (active ? 'border-amber bg-amber text-dark' : 'border-subtle text-muted')
              }
              aria-hidden="true"
            >
              {idx + 1}
            </span>
            <span className="text-[15px] leading-relaxed text-charcoal">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
