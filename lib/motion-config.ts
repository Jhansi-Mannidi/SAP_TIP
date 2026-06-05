/**
 * Portfolio Intelligence — shared motion tokens.
 * Import these instead of hardcoding durations/easing across the app.
 */

export const MOTION_DURATION = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.35,
  slow: 0.5,
  counter: 1.2,
} as const

export const MOTION_EASE = {
  out: [0.25, 0.1, 0.25, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: 'spring' as const, stiffness: 400, damping: 30 },
  gentleSpring: { type: 'spring' as const, stiffness: 260, damping: 28 },
}

export const MOTION_STAGGER = {
  children: 0.08,
  childrenFast: 0.05,
  delayChildren: 0.05,
} as const
