import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Portfolio Intelligence card shell.
 *
 * Padding is applied on the Card root (all 4 sides) so Header / Content / Footer
 * stay aligned without duplicating px/py on each sub-component.
 *
 * - default  → p-5 sm:p-6 (20px / 24px)
 * - compact  → p-4 (16px) for dense KPI tiles
 * - flush    → p-0 for edge-to-edge tables inside a card frame
 */
const cardVariants = cva(
  [
    'bg-card text-card-foreground flex flex-col rounded-xl border border-border',
    'shadow-[var(--shadow-xs)]',
    'transition-all duration-200 ease-out',
    'hover:shadow-[var(--shadow-sm)] hover:border-border/80',
  ].join(' '),
  {
    variants: {
      padding: {
        default: 'gap-4 p-5 sm:p-6',
        compact: 'gap-3 p-4',
        flush: 'gap-0 p-0 overflow-hidden',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  },
)

function Card({
  className,
  padding,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ padding }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        '[.border-b]:pb-4 [.border-b]:border-b [.border-b]:border-border',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('card-title-text', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('flex-1 min-h-0', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center gap-2 border-t border-border pt-4 mt-auto',
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
