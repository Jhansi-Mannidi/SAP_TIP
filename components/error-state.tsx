'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fadeInUp, scaleIn } from '@/lib/animations'

export interface ErrorStateProps {
  /** Visual variant — slightly different copy + icon */
  variant?: 'not-found' | 'error' | 'forbidden' | 'offline'
  /** Optional override for the headline */
  title?: string
  /** Optional override for the supporting copy */
  description?: string
  /** Optional digest/code shown to the user (e.g. Next.js error.digest) */
  digest?: string
  /** Called when the user clicks "Try again". When omitted, falls back to router.refresh(). */
  onRetry?: () => void
  /** Hide the back button entirely */
  hideBack?: boolean
  /** Override the home href */
  homeHref?: string
  className?: string
}

const VARIANT_DEFAULTS: Record<
  NonNullable<ErrorStateProps['variant']>,
  { title: string; description: string; status: string }
> = {
  'not-found': {
    title: 'Page not found',
    description:
      "We couldn't find the page you're looking for. It may have been moved, renamed, or never existed.",
    status: '404',
  },
  error: {
    title: 'Something went wrong',
    description:
      'An unexpected error occurred while loading this page. Try reloading — if the problem persists, please contact support.',
    status: '500',
  },
  forbidden: {
    title: 'Access restricted',
    description:
      "You don't have permission to view this page. Check with your administrator if you believe this is a mistake.",
    status: '403',
  },
  offline: {
    title: "You're offline",
    description:
      "We can't reach the server right now. Check your connection and try again.",
    status: 'OFFLINE',
  },
}

export function ErrorState({
  variant = 'error',
  title,
  description,
  digest,
  onRetry,
  hideBack = false,
  homeHref = '/',
  className,
}: ErrorStateProps) {
  const router = useRouter()
  const defaults = VARIANT_DEFAULTS[variant]
  const displayTitle = title ?? defaults.title
  const displayDescription = description ?? defaults.description

  const handleRetry = React.useCallback(() => {
    if (onRetry) onRetry()
    else router.refresh()
  }, [onRetry, router])

  const handleBack = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(homeHref)
    }
  }, [router, homeHref])

  return (
    <motion.div
      className={cn(
        'min-h-[60vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8',
        className
      )}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-md">
        {/* Decorative background card */}
        <div className="relative">
          {/* Soft glow behind icon (theme-aware via tokens) */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 -top-6 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(closest-side, var(--brand-soft), transparent)',
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative section-card text-center"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            {/* Status code */}
            <div className="micro-label-accent mb-4">{defaults.status}</div>

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-soft-foreground ring-1 ring-border">
              {variant === 'not-found' ? (
                <Search className="h-7 w-7" aria-hidden />
              ) : (
                <AlertTriangle className="h-7 w-7" aria-hidden />
              )}
            </div>

            {/* Title */}
            <h1 className="page-title text-balance">
              {displayTitle}
            </h1>
            <p className="page-description mt-2 text-pretty">
              {displayDescription}
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
              <Button
                onClick={handleRetry}
                className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Try again
              </Button>
              {!hideBack && (
                <Button variant="outline" onClick={handleBack} className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Go back
                </Button>
              )}
              <Button variant="ghost" asChild className="gap-1.5">
                <Link href={homeHref}>
                  <Home className="h-4 w-4" aria-hidden />
                  Home
                </Link>
              </Button>
            </div>

            {/* Digest */}
            {digest && (
              <p className="page-description mt-6 text-[11px] /70 break-all">
                Ref: {digest}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
