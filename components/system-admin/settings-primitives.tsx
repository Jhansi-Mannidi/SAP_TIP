'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SettingsNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left',
        active
          ? 'bg-brand/10 text-brand font-medium ring-1 ring-brand/20'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active && 'text-brand')} />
      {label}
    </button>
  )
}

export function SettingsPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('space-y-0', className)}>{children}</div>
}

export function SettingsSectionBlock({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('border-b border-border/60 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0', className)}>
      {children}
    </div>
  )
}

export function SettingsSection({
  icon: Icon,
  title,
  description,
  tone = 'default',
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  tone?: 'default' | 'danger'
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
            tone === 'danger'
              ? 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20'
              : 'bg-brand/10 text-brand ring-brand/20',
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2
            className={cn(
              'text-base font-semibold leading-tight',
              tone === 'danger' && 'text-red-700 dark:text-red-400',
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-xl">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-0 sm:pl-12">{children}</div>
    </section>
  )
}

export function SettingsFieldGrid({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode
  columns?: 1 | 2 | 3
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SettingsField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'space-y-2 [&_input]:h-9 [&_[data-slot=select-trigger]]:h-9',
        className,
      )}
    >
      <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  )
}

export function SettingsToggleRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-border/40 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function SettingsCallout({
  icon: Icon,
  title,
  tone = 'info',
  children,
}: {
  icon: LucideIcon
  title: string
  tone?: 'info' | 'warning'
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3.5',
        tone === 'info' &&
          'border-blue-200/80 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/25',
        tone === 'warning' &&
          'border-amber-200/80 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/25',
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 shrink-0 mt-0.5',
          tone === 'info' && 'text-blue-600 dark:text-blue-400',
          tone === 'warning' && 'text-amber-600 dark:text-amber-400',
        )}
      />
      <div>
        <p
          className={cn(
            'text-sm font-medium',
            tone === 'info' && 'text-blue-900 dark:text-blue-100',
            tone === 'warning' && 'text-amber-900 dark:text-amber-100',
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            'text-xs mt-1 leading-relaxed',
            tone === 'info' && 'text-blue-700/90 dark:text-blue-300/90',
            tone === 'warning' && 'text-amber-800/90 dark:text-amber-300/90',
          )}
        >
          {children}
        </p>
      </div>
    </div>
  )
}
