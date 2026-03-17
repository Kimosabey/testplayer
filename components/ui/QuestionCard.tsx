import { PropsWithChildren } from 'react'

type QuestionCardProps = PropsWithChildren<{
  title?: string
  className?: string
}>

export function QuestionCard({ title, className, children }: QuestionCardProps) {
  return (
    <section className={['rounded-2xl bg-cream card-edge p-6', className].filter(Boolean).join(' ')}>
      {title ? <div className="font-serif text-xl">{title}</div> : null}
      <div className={title ? 'mt-4' : undefined}>{children}</div>
    </section>
  )
}
