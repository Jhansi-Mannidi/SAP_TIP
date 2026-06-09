'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AnimatedNumber, staggerContainerFast, staggerItem } from '@/lib/animations'

export interface KPI {
  id: string
  label: string
  value: string | number
  previousValue?: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  sparklineData?: number[]
  format?: 'number' | 'percent' | 'currency' | 'duration'
}

interface KPIStripProps {
  kpis: KPI[]
  className?: string
  animated?: boolean
  variant?: 'card' | 'flat'
}

export function KPIStrip({ kpis, className, animated = true, variant = 'card' }: KPIStripProps) {
  const Wrapper = animated ? motion.div : 'div'
  const wrapperProps = animated
    ? {
        variants: staggerContainerFast,
        initial: 'hidden' as const,
        animate: 'visible' as const,
      }
    : {}

  return (
    <Wrapper
      className={cn(
        'flex items-stretch gap-4 overflow-x-auto',
        variant === 'card' && 'p-5 sm:p-6 bg-card border border-border rounded-xl shadow-[var(--shadow-xs)]',
        variant === 'flat' && 'gap-0 divide-x divide-border/60',
        className,
      )}
      {...wrapperProps}
    >
      {kpis.map((kpi, index) => (
        <KPITile
          key={kpi.id}
          kpi={kpi}
          animated={animated}
          flat={variant === 'flat'}
          isFirst={index === 0}
        />
      ))}
    </Wrapper>
  )
}

function KPITile({
  kpi,
  animated,
  flat = false,
  isFirst = false,
}: {
  kpi: KPI
  animated: boolean
  flat?: boolean
  isFirst?: boolean
}) {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus

  const trendColor = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  }[kpi.trend || 'neutral']

  const content = (
    <>
      <span className="micro-label">{kpi.label}</span>

      <div className="flex items-baseline gap-2">
        <span className="kpi-value">
          {typeof kpi.value === 'number' &&
          (kpi.format === undefined || kpi.format === 'number' || kpi.format === 'percent') ? (
            <AnimatedNumber
              value={kpi.value}
              duration={1}
              suffix={kpi.format === 'percent' ? '%' : ''}
              className="inline"
            />
          ) : typeof kpi.value === 'number' ? (
            formatValue(kpi.value, kpi.format)
          ) : (
            kpi.value
          )}
        </span>
        {kpi.unit && (
          <span className="text-sm text-muted-foreground">{kpi.unit}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {kpi.trend && (
          <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
            <TrendIcon className="h-3 w-3" />
            {kpi.trendValue && <span>{kpi.trendValue}</span>}
          </div>
        )}

        {kpi.sparklineData && kpi.sparklineData.length > 0 && (
          <MiniSparkline data={kpi.sparklineData} trend={kpi.trend} />
        )}
      </div>
    </>
  )

  const tileClass = cn(
    'flex flex-col gap-1.5 min-w-[120px] sm:min-w-[140px] flex-1 flex-shrink-0',
    flat && 'px-4 sm:px-5 py-1',
    flat && !isFirst && 'pl-4 sm:pl-5',
  )

  if (!animated) {
    return <div className={tileClass}>{content}</div>
  }

  return (
    <motion.div
      className={tileClass}
      variants={staggerItem}
      whileHover={flat ? undefined : { y: -1, transition: { duration: 0.15 } }}
    >
      {content}
    </motion.div>
  )
}

function MiniSparkline({ data, trend }: { data: number[]; trend?: 'up' | 'down' | 'neutral' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const width = 48
  const height = 16
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const strokeColor = {
    up: 'var(--success)',
    down: 'var(--destructive)',
    neutral: 'var(--muted-foreground)',
  }[trend || 'neutral']

  return (
    <svg
      width={width}
      height={height}
      className="flex-shrink-0"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatValue(value: number, format?: KPI['format']): string {
  switch (format) {
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value)
    case 'duration':
      if (value < 60) return `${value}s`
      if (value < 3600) return `${Math.floor(value / 60)}m`
      return `${Math.floor(value / 3600)}h`
    case 'number':
    default:
      return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
  }
}
