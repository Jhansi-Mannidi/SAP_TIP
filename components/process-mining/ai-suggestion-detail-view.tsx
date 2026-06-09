'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bot,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitBranch,
  Lightbulb,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { AI_SUGGESTIONS, type AISuggestion } from '@/lib/process-mining-mock-data'
import {
  SUGGESTION_PRIORITY_CONFIG,
  SUGGESTION_STATUS_CONFIG,
  SUGGESTION_TYPE_CONFIG,
} from '@/components/process-mining/suggestion-config'

const EVIDENCE_TONES = [
  'border-l-brand bg-brand/[0.04]',
  'border-l-amber-500 bg-amber-500/[0.04]',
  'border-l-red-500 bg-red-500/[0.04]',
  'border-l-blue-500 bg-blue-500/[0.04]',
] as const

function SectionHeader({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ElementType
  title: string
  description?: string
  accent?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
          accent
            ? 'bg-brand/12 text-brand ring-brand/25'
            : 'bg-muted/60 text-muted-foreground ring-border/60',
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </div>
      <div className="min-w-0 pt-0.5">
        <h2 className={cn('text-sm font-semibold tracking-tight', accent && 'text-brand')}>
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}

function ConfidenceRing({ value }: { value: number }) {
  return (
    <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted/60" strokeWidth="2.5" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          className="stroke-brand"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${value} 100`}
        />
      </svg>
      <div className="text-center">
        <p className="text-lg font-bold tabular-nums leading-none text-brand">{value}%</p>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
          Score
        </p>
      </div>
    </div>
  )
}

export function AiSuggestionDetailView({ suggestion }: { suggestion: AISuggestion }) {
  const router = useRouter()
  const [status, setStatus] = React.useState(suggestion.status)

  const typeConfig = SUGGESTION_TYPE_CONFIG[suggestion.type]
  const TypeIcon = typeConfig.icon
  const statusConfig = SUGGESTION_STATUS_CONFIG[status]

  const currentIndex = AI_SUGGESTIONS.findIndex((s) => s.id === suggestion.id)
  const prevSuggestion = currentIndex > 0 ? AI_SUGGESTIONS[currentIndex - 1] : null
  const nextSuggestion =
    currentIndex >= 0 && currentIndex < AI_SUGGESTIONS.length - 1
      ? AI_SUGGESTIONS[currentIndex + 1]
      : null

  const uncoveredVariants = suggestion.affectedVariants.filter((v) => v.testCoverage === 0).length
  const avgConformance = Math.round(
    suggestion.affectedVariants.reduce((sum, v) => sum + v.conformance, 0) /
      suggestion.affectedVariants.length,
  )

  const handleAccept = async () => {
    setStatus('accepted')
    const { toast } = await import('sonner')
    toast.success('Suggestion accepted', {
      description: 'Test generation tasks have been queued.',
    })
  }

  const handleReject = async () => {
    setStatus('rejected')
    const { toast } = await import('sonner')
    toast.message('Suggestion rejected', { description: 'Logged for audit review.' })
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const metaItems = [
    { label: 'Impact', value: suggestion.impact, icon: TrendingUp },
    { label: 'Effort', value: suggestion.estimatedEffort, icon: Clock },
    { label: 'Agent', value: suggestion.agent, icon: Bot },
    { label: 'Created', value: formatDate(suggestion.createdAt), icon: Calendar },
  ] as const

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-5 pb-28"
      variants={staggerItem}
      initial="hidden"
      animate="visible"
    >
      {/* Top nav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav className="page-breadcrumb" aria-label="Breadcrumb">
          <ol className="page-breadcrumb-list">
            <li className="page-breadcrumb-item">
              <Link href="/process-mining/suggestions" className="page-breadcrumb-link">
                AI Suggestions
              </Link>
            </li>
            <ChevronRight className="page-breadcrumb-sep" aria-hidden />
            <li className="page-breadcrumb-item page-breadcrumb-item--truncate">
              <span className="page-breadcrumb-current font-mono">{suggestion.id}</span>
            </li>
          </ol>
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          {prevSuggestion ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/process-mining/suggestions/${prevSuggestion.id}`} aria-label="Previous suggestion">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-xs text-muted-foreground tabular-nums px-1">
            {currentIndex + 1} / {AI_SUGGESTIONS.length}
          </span>
          {nextSuggestion ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/process-mining/suggestions/${nextSuggestion.id}`} aria-label="Next suggestion">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="relative border-b border-border/60 bg-gradient-to-br from-brand/[0.10] via-brand/[0.03] to-card px-5 sm:px-7 py-6 sm:py-7">
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4 min-w-0">
              <div
                className={cn(
                  'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset shadow-[var(--shadow-xs)]',
                  typeConfig.bg,
                  typeConfig.color,
                )}
              >
                <TypeIcon className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand/80 mb-1.5">
                    {typeConfig.label}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-foreground">
                    {suggestion.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-foreground/80">{suggestion.process}</span>
                    <span className="text-border hidden sm:inline">·</span>
                    <span className="font-mono text-xs">{suggestion.id}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={cn('h-6 text-[10px] border-0 capitalize', SUGGESTION_PRIORITY_CONFIG[suggestion.priority])}>
                    {suggestion.priority} priority
                  </Badge>
                  <Badge className={cn('h-6 text-[10px] border-0', statusConfig.pill)}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm px-5 py-4 shadow-[var(--shadow-xs)]">
              <div className="hidden sm:block text-right">
                <p className="micro-label">AI Confidence</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[8rem] leading-snug">
                  Based on production event frequency &amp; conformance gaps
                </p>
              </div>
              <ConfidenceRing value={suggestion.confidence} />
            </div>
          </div>

          <p className="relative text-sm text-muted-foreground mt-6 leading-relaxed max-w-3xl border-t border-brand/15 pt-5">
            {suggestion.summary}
          </p>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/50">
          {metaItems.map((meta) => {
            const MetaIcon = meta.icon
            return (
              <div
                key={meta.label}
                className="flex items-start gap-3 bg-card px-4 py-4 sm:px-5 sm:py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                  <MetaIcon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="micro-label text-[10px]">{meta.label}</p>
                  <p className="text-sm font-medium mt-1 leading-snug">{meta.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Rationale */}
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[var(--shadow-xs)]">
            <SectionHeader
              icon={Lightbulb}
              title="AI Rationale"
              description="Why the model flagged this recommendation"
              accent
            />
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 pl-12 sm:pl-[3.25rem]">
              {suggestion.rationale}
            </p>
          </section>

          {/* Evidence */}
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[var(--shadow-xs)]">
            <SectionHeader
              icon={Zap}
              title="Evidence Signals"
              description="Production data points supporting this suggestion"
            />
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              {suggestion.evidenceSignals.map((signal, i) => (
                <div
                  key={signal.label}
                  className={cn(
                    'rounded-xl border border-border/50 border-l-[3px] px-3.5 py-3 transition-colors hover:bg-muted/20',
                    EVIDENCE_TONES[i % EVIDENCE_TONES.length],
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="text-base font-bold tabular-nums mt-1.5 tracking-tight">{signal.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-[var(--shadow-xs)]">
            <div className="p-5 sm:p-6 border-b border-border/50">
              <SectionHeader
                icon={GitBranch}
                title="Affected Process Variants"
                description={`${suggestion.affectedVariants.length} variants · ${uncoveredVariants} with coverage gaps`}
              />
            </div>
            <div className="divide-y divide-border/50">
              {suggestion.affectedVariants.map((variant) => {
                const isGap = variant.testCoverage === 0
                return (
                  <div
                    key={variant.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-6 py-4 transition-colors hover:bg-muted/15',
                      isGap && 'bg-red-500/[0.02] border-l-[3px] border-l-red-500/60',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-[10px] font-mono font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">
                          {variant.id}
                        </code>
                        <span className="text-sm font-semibold">{variant.name}</span>
                        {isGap && (
                          <Badge className="h-5 text-[9px] border-0 pill pill-danger">Gap</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {variant.frequency.toLocaleString()} occurrences / month
                      </p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 sm:w-56">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Conformance</span>
                          <span className="font-mono tabular-nums font-medium">{variant.conformance}%</span>
                        </div>
                        <Progress value={variant.conformance} className="h-1.5" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Coverage</span>
                          <span
                            className={cn(
                              'font-mono tabular-nums font-medium',
                              isGap && 'text-red-600 dark:text-red-400',
                            )}
                          >
                            {variant.testCoverage}%
                          </span>
                        </div>
                        <Progress
                          value={variant.testCoverage}
                          className={cn('h-1.5', isGap && '[&>div]:bg-red-500')}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Actions timeline */}
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[var(--shadow-xs)]">
            <SectionHeader
              icon={Sparkles}
              title="Recommended Actions"
              description="Steps to implement this suggestion"
              accent
            />
            <ol className="relative mt-5 space-y-0 pl-1">
              {suggestion.recommendedActions.map((action, index) => (
                <li key={action.step} className="relative flex gap-4 pb-5 last:pb-0">
                  {index < suggestion.recommendedActions.length - 1 && (
                    <div
                      className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-brand/40 to-border/40"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-bold shadow-[0_2px_8px_rgba(184,134,46,0.35)]">
                    {action.step}
                  </span>
                  <div className="min-w-0 pt-0.5 pb-1">
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-xs)]">
            <h3 className="micro-label mb-4">Coverage snapshot</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Variants affected</span>
                <span className="text-lg font-bold tabular-nums">{suggestion.affectedVariants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uncovered paths</span>
                <span className="text-lg font-bold tabular-nums text-red-600 dark:text-red-400">
                  {uncoveredVariants}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg conformance</span>
                <span className="text-lg font-bold tabular-nums">{avgConformance}%</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="rounded-xl bg-brand/[0.06] border border-brand/20 px-3.5 py-3">
                <p className="text-xs font-medium text-brand">Expected impact</p>
                <p className="text-sm text-foreground mt-1 leading-snug">{suggestion.impact}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-xs)]">
            <SectionHeader icon={Target} title="Related T-codes" />
            <div className="flex flex-wrap gap-1.5 mt-4">
              {suggestion.relatedTcCodes.map((tcode) => (
                <Badge
                  key={tcode}
                  variant="outline"
                  className="font-mono text-[11px] bg-muted/30 hover:bg-brand/10 hover:border-brand/30 hover:text-brand transition-colors cursor-default"
                >
                  {tcode}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-muted/30 to-card p-5 shadow-[var(--shadow-xs)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Source agent
                </p>
                <p className="text-sm font-semibold mt-0.5">{suggestion.agent}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Generated from production event logs, conformance analysis, and test repository cross-reference.
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/80 bg-background/90 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.06)] px-4 py-3.5 sm:px-6 lg:pl-[var(--sidebar-width,16rem)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="outline" size="sm" onClick={() => router.push('/process-mining/suggestions')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <p className="hidden md:block text-sm text-muted-foreground truncate max-w-xs lg:max-w-md">
              <span className="font-mono text-xs mr-2">{suggestion.id}</span>
              {suggestion.title}
            </p>
          </div>

          {status === 'pending' ? (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleReject}>
                <ThumbsDown className="h-4 w-4" />
                <span className="hidden sm:inline">Reject</span>
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 shadow-[var(--shadow-xs)]"
                onClick={handleAccept}
              >
                <ThumbsUp className="h-4 w-4" />
                Accept &amp; queue tasks
              </Button>
            </div>
          ) : (
            <Badge className={cn('h-7 px-3 text-xs border-0 shrink-0', statusConfig.pill)}>
              Reviewed — {statusConfig.label}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  )
}
