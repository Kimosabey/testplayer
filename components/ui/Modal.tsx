'use client'

import { PropsWithChildren, useEffect } from 'react'

import { Button } from '@/components/ui/Button'

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  danger?: boolean
}>

export function Modal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  danger,
  children
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-dark/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-cream card-edge p-6">
        <div className="font-serif text-2xl">{title}</div>
        {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
