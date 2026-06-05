'use client'

import { motion, useInView, useSpring, useMotionValue, animate, AnimatePresence, Variants } from 'framer-motion'
import { useRef, useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { MOTION_DURATION, MOTION_EASE } from '@/lib/motion-config'

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.35, 
      ease: [0.25, 0.1, 0.25, 1]
    } 
  }
}

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.1, 0.25, 1]
    } 
  }
}

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.25, ease: 'easeOut' }
  },
  tap: { scale: 0.98 }
}

export const slideInFromBottom: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  pulse: { 
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
}

// ============================================================================
// ANIMATED NUMBER COUNTER
// ============================================================================

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedNumber({ 
  value, 
  duration = 1.5, 
  decimals = 0, 
  suffix = '', 
  prefix = '',
  className = ''
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { 
    damping: 30, 
    stiffness: 100,
    duration: duration * 1000
  })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let isMounted = true
      const controls = animate(motionValue, value, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          if (isMounted) {
            setDisplayValue(latest)
          }
        }
      })
      return () => {
        isMounted = false
        controls.stop()
      }
    }
  }, [isInView, value, duration, motionValue])

  return (
    <motion.span 
      ref={ref} 
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </motion.span>
  )
}

// ============================================================================
// ANIMATED PERCENTAGE
// ============================================================================

interface AnimatedPercentageProps {
  value: number
  duration?: number
  className?: string
  showSymbol?: boolean
}

export function AnimatedPercentage({ 
  value, 
  duration = 1.2, 
  className = '',
  showSymbol = true
}: AnimatedPercentageProps) {
  return (
    <AnimatedNumber 
      value={value} 
      duration={duration} 
      decimals={0} 
      suffix={showSymbol ? '%' : ''} 
      className={className}
    />
  )
}

// ============================================================================
// ANIMATED PROGRESS RING
// ============================================================================

interface AnimatedProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
  trackColor?: string
  children?: ReactNode
}

export function AnimatedProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  color = 'currentColor',
  trackColor = 'currentColor',
  children
}: AnimatedProgressRingProps) {
  const ref = useRef<SVGCircleElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="opacity-20"
        />
        {/* Animated progress */}
        <motion.circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={isInView ? {
            strokeDashoffset: circumference - (clampedProgress / 100) * circumference
          } : {
            strokeDashoffset: circumference
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ANIMATED PROGRESS BAR
// ============================================================================

interface AnimatedProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
  height?: number
}

export function AnimatedProgressBar({
  value,
  max = 100,
  className = '',
  barClassName = 'bg-primary',
  showLabel = false,
  height = 8
}: AnimatedProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div 
        className="w-full bg-muted rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className={`h-full rounded-full ${barClassName}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {showLabel && (
        <motion.span 
          className="absolute right-0 -top-6 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {percentage.toFixed(0)}%
        </motion.span>
      )}
    </div>
  )
}

// ============================================================================
// ANIMATED CARD
// ============================================================================

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hoverScale?: number
  onClick?: () => void
}

export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  hoverScale = 1.02,
  onClick
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ scale: hoverScale, transition: { duration: 0.2 } }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED TEXT
// ============================================================================

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  type?: 'words' | 'characters' | 'lines'
}

export function AnimatedText({ 
  text, 
  className = '', 
  delay = 0,
  staggerDelay = 0.03,
  type = 'words'
}: AnimatedTextProps) {
  const elements = type === 'characters' 
    ? text.split('') 
    : type === 'lines'
    ? text.split('\n')
    : text.split(' ')

  return (
    <motion.span 
      className={`inline-flex flex-wrap ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } }
      }}
    >
      {elements.map((element, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
          }}
        >
          {element}{type === 'words' && i < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ============================================================================
// ANIMATED LIST
// ============================================================================

interface AnimatedListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedList({ children, className = '', staggerDelay = 0.1 }: AnimatedListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay, delayChildren: 0.1 }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED CHART BAR
// ============================================================================

interface AnimatedChartBarProps {
  height: number
  maxHeight: number
  color?: string
  className?: string
  delay?: number
  label?: string
}

export function AnimatedChartBar({
  height,
  maxHeight,
  color = 'bg-primary',
  className = '',
  delay = 0,
  label
}: AnimatedChartBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  const percentage = (height / maxHeight) * 100

  return (
    <div ref={ref} className={`flex flex-col items-center ${className}`}>
      <div className="relative h-40 w-8 bg-muted rounded-t-sm overflow-hidden flex items-end">
        <motion.div
          className={`w-full rounded-t-sm ${color}`}
          initial={{ height: 0 }}
          animate={isInView ? { height: `${percentage}%` } : { height: 0 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
      {label && (
        <motion.span 
          className="text-xs text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}

// ============================================================================
// ANIMATED KPI CARD
// ============================================================================

interface AnimatedKPICardProps {
  title: string
  value: number | string
  suffix?: string
  prefix?: string
  subtitle?: string
  icon?: ReactNode
  trend?: { value: number; positive: boolean }
  delay?: number
  className?: string
  onClick?: () => void
}

export function AnimatedKPICard({
  title,
  value,
  suffix = '',
  prefix = '',
  subtitle,
  icon,
  trend,
  delay = 0,
  className = '',
  onClick
}: AnimatedKPICardProps) {
  return (
    <motion.div
      className={`p-5 sm:p-6 rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        {typeof value === 'number' ? (
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} className="text-2xl md:text-3xl font-bold" />
        ) : (
          <motion.span 
            className="text-2xl md:text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {prefix}{value}{suffix}
          </motion.span>
        )}
      </div>
      {(subtitle || trend) && (
        <motion.div 
          className="flex items-center gap-2 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {trend && (
            <span className={`text-sm font-medium ${trend.positive ? 'text-success' : 'text-destructive'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
          {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================================================
// ANIMATED TABLE ROW
// ============================================================================

interface AnimatedTableRowProps extends ComponentProps<'tr'> {
  children: ReactNode
  index?: number
}

export function AnimatedTableRow({
  children,
  index = 0,
  className = '',
  ...props
}: AnimatedTableRowProps) {
  return (
    <motion.tr
      className={className}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'var(--muted)' }}
      {...props}
    >
      {children}
    </motion.tr>
  )
}

// ============================================================================
// PAGE / ROUTE TRANSITION WRAPPERS
// ============================================================================

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: MOTION_DURATION.fast }}
    >
      {children}
    </motion.div>
  )
}

interface RouteTransitionProps {
  children: ReactNode
  routeKey: string
  className?: string
}

/**
 * Wraps AppShell main content — animates on every in-app navigation.
 * Keyed by pathname so AnimatePresence can run exit + enter transitions.
 */
export function RouteTransition({ children, routeKey, className = '' }: RouteTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        className={className}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE.out }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// SKELETON SHIMMER (for loading states)
// ============================================================================

export function SkeletonShimmer({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-muted rounded ${className}`}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        backgroundSize: '200% 100%'
      }}
    />
  )
}

// ============================================================================
// NOTIFICATION BADGE ANIMATION
// ============================================================================

interface AnimatedBadgeProps {
  count: number
  className?: string
}

export function AnimatedBadge({ count, className = '' }: AnimatedBadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      key={count}
    >
      <motion.span
        key={count}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {count}
      </motion.span>
    </motion.span>
  )
}

// ============================================================================
// HOVER CARD EFFECT
// ============================================================================

interface HoverCardEffectProps {
  children: ReactNode
  className?: string
}

export function HoverCardEffect({ children, className = '' }: HoverCardEffectProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        y: -4, 
        boxShadow: 'var(--card-shadow-hover)',
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}
