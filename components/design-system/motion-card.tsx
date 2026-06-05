'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'

interface MotionCardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean
  hoverLift?: boolean
  delay?: number
}

/**
 * Animated card wrapper aligned with Portfolio Intelligence tokens.
 * Use instead of raw Card when you want consistent hover + entrance motion.
 */
export function MotionCard({
  children,
  className,
  interactive = false,
  hoverLift = true,
  delay = 0,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      data-slot="motion-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-4 rounded-xl border border-border',
        'p-5 sm:p-6 shadow-[var(--shadow-xs)] transition-colors duration-200',
        hoverLift && 'hover:shadow-[var(--shadow-sm)] hover:border-border/80',
        interactive && 'cursor-pointer',
        className,
      )}
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={
        interactive && hoverLift
          ? {
              y: -3,
              boxShadow: 'var(--card-shadow-hover)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={interactive ? { scale: 0.985 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
