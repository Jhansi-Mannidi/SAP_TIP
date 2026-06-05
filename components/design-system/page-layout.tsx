'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  staggerContainer,
  staggerContainerFast,
  staggerItem,
} from '@/lib/animations'

/* -------------------------------------------------------------------------- */
/* PageLayout — standard page wrapper (spacing + optional stagger)            */
/* -------------------------------------------------------------------------- */

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  /** Remove default padding when AppShell already provides it */
  noPadding?: boolean
  stagger?: boolean
}

function wrapStaggerChildren(children: React.ReactNode) {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    return (
      <motion.div key={child.key ?? index} variants={staggerItem}>
        {child}
      </motion.div>
    )
  })
}

export function PageLayout({
  children,
  className,
  noPadding = true,
  stagger = false,
}: PageLayoutProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col gap-6',
        !noPadding && 'p-4 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )

  if (!stagger) return content

  return (
    <motion.div
      className={cn('flex flex-col gap-6', !noPadding && 'p-4 sm:p-6', className)}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {wrapStaggerChildren(children)}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* PageHeader — consistent title / description / actions                      */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <motion.div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      variants={staggerItem}
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="page-title">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="page-description">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <motion.div
          className="flex flex-wrap items-center gap-2 shrink-0"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* PageSection — titled content block with entrance animation                 */
/* -------------------------------------------------------------------------- */

interface PageSectionProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
  delay?: number
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  delay = 0,
}: PageSectionProps) {
  return (
    <motion.section
      className={cn('space-y-4', className)}
      variants={staggerItem}
      transition={{ delay }}
    >
      {(title || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="section-title">
                {title}
              </h2>
            )}
            {description && (
              <p className="section-description mt-0.5">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </motion.section>
  )
}

/* -------------------------------------------------------------------------- */
/* StaggerGrid / StaggerItem — animated responsive grids                      */
/* -------------------------------------------------------------------------- */

interface StaggerGridProps extends React.ComponentProps<'div'> {
  fast?: boolean
  columns?: string
}

export function StaggerGrid({
  children,
  className,
  fast = false,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  ...props
}: StaggerGridProps) {
  return (
    <motion.div
      className={cn('grid gap-4', columns, className)}
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="hidden"
      animate="visible"
      {...(props as HTMLMotionProps<'div'>)}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child
        return (
          <motion.div key={child.key ?? index} variants={staggerItem} className="h-full min-h-0 w-full min-w-0">
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* SectionCard — design-system card surface with hover lift                   */
/* -------------------------------------------------------------------------- */

interface SectionCardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean
}

export function SectionCard({
  children,
  className,
  interactive = false,
  ...props
}: SectionCardProps) {
  return (
    <motion.div
      className={cn(
        'section-card rounded-xl',
        interactive && 'cursor-pointer',
        className,
      )}
      variants={staggerItem}
      whileHover={
        interactive
          ? { y: -2, boxShadow: 'var(--card-shadow-hover)', transition: { duration: 0.2 } }
          : undefined
      }
      whileTap={interactive ? { scale: 0.99 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* MetricTile — single KPI metric with animated value                         */
/* -------------------------------------------------------------------------- */

interface MetricTileProps {
  label: string
  value: React.ReactNode
  unit?: string
  icon?: React.ReactNode
  trend?: { value: string; positive?: boolean }
  accent?: boolean
  className?: string
}

export function MetricTile({
  label,
  value,
  unit,
  icon,
  trend,
  accent = false,
  className,
}: MetricTileProps) {
  return (
    <motion.div
      className={cn('kpi-card', className)}
      variants={staggerItem}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="micro-label">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={accent ? 'kpi-value-accent' : 'kpi-value'}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && (
        <p
          className={cn(
            'text-xs font-medium mt-1.5',
            trend.positive === true && 'text-success',
            trend.positive === false && 'text-destructive',
            trend.positive === undefined && 'text-muted-foreground',
          )}
        >
          {trend.value}
        </p>
      )}
    </motion.div>
  )
}
