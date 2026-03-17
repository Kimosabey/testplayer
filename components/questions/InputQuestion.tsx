'use client'

import { useEffect, useRef } from 'react'

import type { Question } from '@/lib/mock-data'

type InputQuestionProps = {
  question: Question
  value: string
  onChange: (next: string) => void
  autoFocus?: boolean
}

export function InputQuestion({ question, value, onChange, autoFocus }: InputQuestionProps) {
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!autoFocus) return
    ref.current?.focus()
  }, [autoFocus])

  return (
    <div className="rounded-2xl bg-cream card-edge px-5 py-4">
      <label className="block text-xs uppercase tracking-widest text-muted">Your answer</label>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer…"
        className="mt-3 w-full bg-transparent text-[16px] text-charcoal outline-none placeholder:text-muted/70"
        aria-label={question.prompt}
      />
      <div className="mt-3 h-px w-full bg-subtle" />
    </div>
  )
}
