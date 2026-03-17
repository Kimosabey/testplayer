import Link from 'next/link'
import { type ComponentPropsWithoutRef } from 'react'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonSize = 'sm' | 'md'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber/40 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-amber text-dark hover:bg-amber/90',
  secondary: 'border border-subtle bg-transparent text-charcoal hover:bg-charcoal/5',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-sm'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = twMerge(clsx(base, variants[variant], sizes[size], className))

  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    )
  }

  return <button className={classes} {...props} />
}
