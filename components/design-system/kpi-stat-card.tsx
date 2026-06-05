'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedNumber, staggerItem } from '@/lib/animations'

export type KpiStatTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const toneStyles: Record<
  KpiStatTone,
  { card: string; icon: string; value?: string; glow: string }
> = {
  brand: {
    card: 'border-l-brand bg-gradient-to-br from-card via-card to-brand/[0.07]',
    icon: 'bg-brand/12 text-brand ring-brand/25 shadow-[0_2px_8px_rgba(184,134,46,0.15)]',
    value: 'kpi-value-accent',
    glow: 'bg-brand',
  },
  success: {
    card: 'border-l-emerald-500 bg-gradient-to-br from-card via-card to-emerald-500/[0.07]',
    icon: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 ring-emerald-500/25 shadow-[0_2px_8px_rgba(5,150,105,0.12)]',
    glow: 'bg-emerald-500',
  },
  warning: {
    card: 'border-l-amber-500 bg-gradient-to-br from-card via-card to-amber-500/[0.07]',
    icon: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 ring-amber-500/25 shadow-[0_2px_8px_rgba(245,158,11,0.12)]',
    glow: 'bg-amber-500',
  },
  danger: {
    card: 'border-l-red-500 bg-gradient-to-br from-card via-card to-red-500/[0.07]',
    icon: 'bg-red-500/12 text-red-600 dark:text-red-400 ring-red-500/25 shadow-[0_2px_8px_rgba(220,38,38,0.12)]',
    glow: 'bg-red-500',
  },
  info: {
    card: 'border-l-blue-500 bg-gradient-to-br from-card via-card to-blue-500/[0.07]',
    icon: 'bg-blue-500/12 text-blue-600 dark:text-blue-400 ring-blue-500/25 shadow-[0_2px_8px_rgba(37,99,235,0.12)]',
    glow: 'bg-blue-500',
  },
  neutral: {
    card: 'border-l-slate-300 dark:border-l-border bg-gradient-to-br from-card via-card to-muted/60',
    icon: 'bg-muted text-muted-foreground ring-border/60',
    glow: 'bg-muted-foreground',
  },
}

function LocaleAnimatedNumber({ value, duration = 0.85 }: { value: number; duration?: number }) {
  const [display, setDisplay] = React.useState('0')

  React.useEffect(() => {
    let frame: number
    const start = performance.now()
    const ms = duration * 1000

    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased).toLocaleString())
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return (
    <motion.span
      className="inline"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {display}
    </motion.span>
  )
}

export interface KpiStatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone?: KpiStatTone
  format?: 'number' | 'locale'
  suffix?: string
  className?: string
  hint?: string
}

export function KpiStatCard({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
  format = 'number',
  suffix = '',
  className,
  hint,
}: KpiStatCardProps) {
  const styles = toneStyles[tone]

  return (
    <motion.div
      className={cn(
        'kpi-card kpi-stat-card group relative h-full min-h-[7.25rem] border-l-[3px] overflow-hidden',
        styles.card,
        className,
      )}
      variants={staggerItem}
      whileHover={{
        y: -4,
        boxShadow: 'var(--card-shadow-hover)',
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="relative z-[1] flex items-start justify-between gap-3">
        <span className="micro-label leading-snug pt-0.5">{label}</span>
        <div
          className={cn(
            'kpi-stat-card__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-110',
            styles.icon,
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </div>
      </div>

      <div className="relative z-[1] mt-auto pt-4">
        <p className={cn('kpi-value leading-none', styles.value)}>
          {format === 'locale' ? (
            <LocaleAnimatedNumber value={value} />
          ) : (
            <AnimatedNumber value={value} duration={0.85} suffix={suffix} className="inline" />
          )}
        </p>
        {hint && (
          <p className="text-[11px] text-muted-foreground/80 mt-2 leading-snug">{hint}</p>
        )}
      </div>

      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]',
          styles.glow,
        )}
      />
    </motion.div>
  )
}
