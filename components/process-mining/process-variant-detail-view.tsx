'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitBranch,
  Layers,
  Lightbulb,
  Sparkles,
  Target,
  TestTube2,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  PROCESS_VARIANTS,
  type VariantDetail,
} from '@/lib/process-mining-mock-data'
import {
  STEP_COVERAGE_CONFIG,
  TEST_STATE_CONFIG,
  VARIANT_STATUS_CONFIG,
} from '@/components/process-mining/variant-config'

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

function MetricRing({ value, label }: { value: number; label: string }) {
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
          {label}
        </p>
      </div>
    </div>
  )
}

export function ProcessVariantDetailView({ variant }: { variant: VariantDetail }) {
  const router = useRouter()
  const statusConfig = VARIANT_STATUS_CONFIG[variant.status]

  const currentIndex = PROCESS_VARIANTS.findIndex((v) => v.id === variant.id)
  const prevVariant = currentIndex > 0 ? PROCESS_VARIANTS[currentIndex - 1] : null
  const nextVariant =
    currentIndex >= 0 && currentIndex < PROCESS_VARIANTS.length - 1
      ? PROCESS_VARIANTS[currentIndex + 1]
      : null

  const gapSteps = variant.processSteps.filter((s) => s.coverageState === 'gap').length
  const coveredSteps = variant.processSteps.filter((s) => s.coverageState === 'covered').length

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-5 pb-28"
      variants={staggerItem}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav className="page-breadcrumb" aria-label="Breadcrumb">
          <ol className="page-breadcrumb-list">
            <li className="page-breadcrumb-item">
              <Link href="/process-mining/variants" className="page-breadcrumb-link">
                Process Variants
              </Link>
            </li>
            <ChevronRight className="page-breadcrumb-sep" aria-hidden />
            <li className="page-breadcrumb-item page-breadcrumb-item--truncate">
              <span className="page-breadcrumb-current font-mono">{variant.id}</span>
            </li>
          </ol>
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          {prevVariant ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/process-mining/variants/${prevVariant.id}`} aria-label="Previous variant">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-xs text-muted-foreground tabular-nums px-1">
            {currentIndex + 1} / {PROCESS_VARIANTS.length}
          </span>
          {nextVariant ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/process-mining/variants/${nextVariant.id}`} aria-label="Next variant">
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

      {/* Hero */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="relative border-b border-border/60 bg-gradient-to-br from-brand/[0.10] via-brand/[0.03] to-card px-5 sm:px-7 py-6 sm:py-7">
          <div
            className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand/15 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/12 text-brand ring-1 ring-inset ring-brand/25 shadow-[var(--shadow-xs)]">
                <GitBranch className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="font-mono text-[10px] h-6">
                      {variant.module}
                    </Badge>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {variant.process}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight">
                    {variant.name}
                  </h1>
                  <p className="font-mono text-xs text-muted-foreground mt-2">{variant.id}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={cn('h-6 text-[10px] border-0', statusConfig.pill)}>
                    {statusConfig.label}
                  </Badge>
                  <Badge variant="outline" className="h-6 text-[10px] gap-1">
                    <Layers className="h-3 w-3" />
                    {variant.steps} steps
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm px-4 py-3 shadow-[var(--shadow-xs)]">
                <MetricRing value={variant.testCoverage} label="Coverage" />
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm px-4 py-3 shadow-[var(--shadow-xs)]">
                <MetricRing value={variant.conformance} label="Conform" />
              </div>
            </div>
          </div>

          <p className="relative text-sm text-muted-foreground mt-5 leading-relaxed max-w-3xl border-t border-brand/15 pt-5">
            {variant.description}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/50">
          {[
            { label: 'Monthly runs', value: variant.frequency.toLocaleString(), icon: BarChart3 },
            { label: 'Avg duration', value: variant.avgDuration, icon: Clock },
            { label: 'Last observed', value: formatDate(variant.lastObserved), icon: TrendingUp },
            {
              label: 'Bottleneck',
              value: variant.bottleneck ?? 'None detected',
              icon: AlertTriangle,
            },
          ].map((meta) => {
            const MetaIcon = meta.icon
            return (
              <div key={meta.label} className="flex items-start gap-3 bg-card px-4 py-4 sm:px-5">
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

      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Process flow */}
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[var(--shadow-xs)]">
            <SectionHeader
              icon={GitBranch}
              title="Process Flow"
              description={`${variant.steps} steps discovered from production event logs`}
              accent
            />
            <div className="mt-5 overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex items-center gap-1 min-w-max">
                {variant.processSteps.map((step, index) => {
                  const stepStyle = STEP_COVERAGE_CONFIG[step.coverageState]
                  return (
                    <React.Fragment key={step.id}>
                      <div
                        className={cn(
                          'flex flex-col items-center min-w-[6.5rem] max-w-[7.5rem] rounded-xl border px-2.5 py-3 ring-1 ring-inset text-center transition-colors',
                          stepStyle.node,
                        )}
                      >
                        <span className="text-[9px] font-mono text-muted-foreground">{step.tcode}</span>
                        <p className="text-[11px] font-semibold mt-1 leading-tight line-clamp-2">
                          {step.name}
                        </p>
                        <Badge className={cn('h-4 text-[8px] border-0 mt-2', stepStyle.pill)}>
                          {stepStyle.label}
                        </Badge>
                      </div>
                      {index < variant.processSteps.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 mx-0.5" />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Step coverage table */}
          <section className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-[var(--shadow-xs)]">
            <div className="p-5 sm:p-6 border-b border-border/50">
              <SectionHeader
                icon={Target}
                title="Test Coverage Breakdown"
                description={`${coveredSteps} covered · ${gapSteps} gaps`}
              />
            </div>
            <div className="divide-y divide-border/50">
              {variant.processSteps.map((step) => {
                const stepStyle = STEP_COVERAGE_CONFIG[step.coverageState]
                const isGap = step.coverageState === 'gap'
                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-muted/15 transition-colors',
                      isGap && 'bg-red-500/[0.02]',
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {step.order}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{step.name}</span>
                          <code className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                            {step.tcode}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Avg {step.avgDuration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:shrink-0 pl-10 sm:pl-0">
                      <Badge className={cn('h-5 text-[10px] border-0', stepStyle.pill)}>
                        {stepStyle.label}
                      </Badge>
                      {step.linkedTest ? (
                        <span className="text-[10px] font-mono text-muted-foreground">{step.linkedTest}</span>
                      ) : (
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                          No linked test
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recommendations */}
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-[var(--shadow-xs)]">
            <SectionHeader
              icon={Sparkles}
              title="AI Recommendations"
              description="Suggested actions to improve coverage and conformance"
              accent
            />
            <ul className="mt-4 space-y-2.5">
              {variant.recommendations.map((rec) => (
                <li
                  key={rec.title}
                  className="flex gap-3 rounded-xl border border-border/60 bg-muted/10 px-4 py-3.5"
                >
                  <Lightbulb
                    className={cn(
                      'h-4 w-4 shrink-0 mt-0.5',
                      rec.priority === 'high'
                        ? 'text-red-500'
                        : rec.priority === 'medium'
                          ? 'text-amber-500'
                          : 'text-muted-foreground',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{rec.title}</p>
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-5 text-[9px] capitalize border-0',
                          rec.priority === 'high'
                            ? 'pill pill-danger'
                            : rec.priority === 'medium'
                              ? 'pill pill-warning'
                              : 'pill pill-neutral',
                        )}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.detail}</p>
                    {rec.suggestionId && (
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-brand" asChild>
                        <Link href={`/process-mining/suggestions/${rec.suggestionId}`}>
                          View AI suggestion {rec.suggestionId}
                          <ChevronRight className="h-3 w-3 ml-0.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-xs)]">
            <h3 className="micro-label mb-4">Coverage snapshot</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Test coverage</span>
                  <span className="font-bold tabular-nums">{variant.testCoverage}%</span>
                </div>
                <Progress value={variant.testCoverage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Conformance</span>
                  <span className="font-bold tabular-nums">{variant.conformance}%</span>
                </div>
                <Progress value={variant.conformance} className="h-2" />
              </div>
              <div className="h-px bg-border/60" />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 px-3 py-2.5">
                  <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {coveredSteps}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Covered</p>
                </div>
                <div className="rounded-xl bg-red-500/[0.06] border border-red-500/20 px-3 py-2.5">
                  <p className="text-lg font-bold tabular-nums text-red-600 dark:text-red-400">{gapSteps}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Gaps</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-xs)]">
            <SectionHeader icon={TestTube2} title="Linked Tests" />
            {variant.linkedTests.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {variant.linkedTests.map((test) => {
                  const testStyle = TEST_STATE_CONFIG[test.state]
                  return (
                    <li
                      key={test.id}
                      className="rounded-xl border border-border/60 bg-muted/10 px-3.5 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">{test.name}</p>
                          <code className="text-[10px] font-mono text-muted-foreground">{test.id}</code>
                        </div>
                        <Badge className={cn('h-5 text-[9px] border-0 shrink-0', testStyle.pill)}>
                          {testStyle.label}
                        </Badge>
                      </div>
                      {test.lastRun && (
                        <p className="text-[10px] text-muted-foreground mt-1.5">
                          Last run {formatDate(test.lastRun)}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                No automated tests linked to this variant yet.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/80 bg-background/90 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.06)] px-4 py-3.5 sm:px-6 lg:pl-[var(--sidebar-width,16rem)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="outline" size="sm" onClick={() => router.push('/process-mining/variants')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <p className="hidden md:block text-sm text-muted-foreground truncate max-w-xs lg:max-w-md">
              <span className="font-mono text-xs mr-2">{variant.id}</span>
              {variant.name}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {gapSteps > 0 && (
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2" asChild>
                <Link href="/process-mining/suggestions">
                  <Sparkles className="h-4 w-4" />
                  View AI suggestions
                </Link>
              </Button>
            )}
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <TestTube2 className="h-4 w-4" />
              Generate test
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
