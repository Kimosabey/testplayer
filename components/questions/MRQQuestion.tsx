import type { Question } from '@/lib/mock-data'

type MRQQuestionProps = {
  question: Question
  value: string[]
  onChange: (next: string[]) => void
}

export function MRQQuestion({ question, value, onChange }: MRQQuestionProps) {
  if (!question.options) return null

  const set = new Set(value)

  const toggle = (id: string) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(Array.from(next))
  }

  return (
    <div className="grid gap-3">
      <div className="text-sm text-muted">Select all that apply.</div>
      {question.options.map((opt) => {
        const active = set.has(opt.id)
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={
              'group flex w-full items-start gap-4 rounded-2xl card-edge px-4 py-4 text-left transition-colors ' +
              (active ? 'bg-amber/10 border-amber/30' : 'bg-transparent hover:bg-charcoal/5')
            }
          >
            <span
              className={
                'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ' +
                (active ? 'border-amber bg-amber text-dark' : 'border-subtle bg-transparent')
              }
              aria-hidden="true"
            >
              {active ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
            <span className="text-[15px] leading-relaxed text-charcoal">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
