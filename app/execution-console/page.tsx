'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Server,
  Layers,
  Activity,
  Gauge,
  MoreHorizontal,
  Eye,
  Radio,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { RunNowWizard } from '@/components/run-now-wizard'
import { AnimatedNumber, staggerItem } from '@/lib/animations'

import {
  MOCK_ACTIVE_RUNS,
  MOCK_EXECUTION_KPIS,
  type ActiveRun,
} from '@/lib/execution-mock-data'

function formatTime(mins: number): string {
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const hours = Math.floor(diffMins / 60)
  return `${hours}h ${diffMins % 60}m ago`
}

function RunStatChip({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ElementType
  value: number
  label: string
  tone: 'success' | 'warning' | 'danger' | 'neutral'
}) {
  const tones = {
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  }
  const iconTones = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    neutral: 'text-muted-foreground',
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/20 py-2 px-2 min-h-[3rem]">
      <div className="flex items-center gap-1.5">
        <Icon className={cn('h-3.5 w-3.5', iconTones[tone])} />
        <span className={cn('text-sm font-bold tabular-nums', tones[tone])}>{value}</span>
      </div>
      <span className="caption-text mt-0.5">{label}</span>
    </div>
  )
}

function SegmentedProgressBar({ run }: { run: ActiveRun }) {
  const total = run.progress.total
  const segments = [
    { key: 'pass', width: (run.counts.pass / total) * 100, className: 'bg-emerald-500' },
    { key: 'healed', width: (run.counts.healed / total) * 100, className: 'bg-amber-500' },
    { key: 'fail', width: (run.counts.fail / total) * 100, className: 'bg-red-500' },
    { key: 'active', width: (run.progress.in_progress / total) * 100, className: 'bg-blue-500 animate-pulse' },
  ].filter((s) => s.width > 0)

  return (
    <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden flex">
      {segments.map((seg, i) => (
        <motion.div
          key={seg.key}
          className={cn('h-full first:rounded-l-full last:rounded-r-full', seg.className)}
          initial={{ width: 0 }}
          animate={{ width: `${seg.width}%` }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

function ActiveRunCard({ run }: { run: ActiveRun }) {
  const progressPct = Math.round((run.progress.done / run.progress.total) * 100)
  const unitLabel = run.type === 'suite' ? 'scenarios' : 'cases'
  const isProd = run.target_system.type === 'PROD'

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: 'var(--card-shadow-hover)' }}
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-border bg-card overflow-hidden',
        'shadow-[var(--shadow-xs)] transition-colors duration-200',
        'hover:border-border/80',
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                href={`/execution-console/runs/${run.id}`}
                className="card-title-text hover:text-brand transition-colors line-clamp-2"
              >
                {run.name}
              </Link>
              <Badge variant="outline" className="font-mono text-[11px] h-5 shrink-0">
                {run.code}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  'font-mono text-[11px] h-5',
                  isProd && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
                )}
              >
                {run.target_system.sid}:{run.target_system.client}
              </Badge>
              <Link
                href="/system-admin/runners"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Server className="h-3 w-3" />
                {run.runner_pool.name}
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                In progress
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/execution-console/runs/${run.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Open Run Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pause className="h-4 w-4 mr-2" />
                Pause Run
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Square className="h-4 w-4 mr-2" />
                Abort Run
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="stat-value text-3xl leading-none">
                <AnimatedNumber value={progressPct} duration={0.6} suffix="%" />
              </p>
              <p className="caption-text mt-1">complete</p>
            </div>
            <p className="text-sm text-muted-foreground tabular-nums text-right">
              <span className="font-semibold text-foreground">{run.progress.done}</span>
              <span className="mx-1">/</span>
              <span>{run.progress.total}</span>
              <span className="ml-1">{unitLabel}</span>
            </p>
          </div>
          <SegmentedProgressBar run={run} />
          <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Pass
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Healed
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Fail
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Running
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <RunStatChip icon={CheckCircle2} value={run.counts.pass} label="Pass" tone="success" />
          <RunStatChip icon={Sparkles} value={run.counts.healed} label="Healed" tone="warning" />
          <RunStatChip icon={XCircle} value={run.counts.fail} label="Fail" tone="danger" />
          <RunStatChip icon={Clock} value={run.counts.todo} label="ToDo" tone="neutral" />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(run.elapsed_mins)} elapsed
            </span>
            <span>ETA ~{formatTime(run.eta_remaining_mins)}</span>
          </div>
          <div className="flex items-center gap-2">
            {run.healing_events > 0 && (
              <Badge variant="secondary" className="h-5 text-[10px] gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0">
                <Sparkles className="h-3 w-3" />
                {run.healing_events} healings
              </Badge>
            )}
            <span>
              {formatTimeAgo(run.started_at)} · {run.triggered_by}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function ActiveRunsPage() {
  const [autoRefresh, setAutoRefresh] = React.useState(true)
  const [lastRefresh, setLastRefresh] = React.useState(new Date())
  const [isRunWizardOpen, setIsRunWizardOpen] = React.useState(false)
  const kpis = MOCK_EXECUTION_KPIS
  const activeRuns = MOCK_ACTIVE_RUNS

  React.useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => setLastRefresh(new Date()), 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <AppShell currentApp="execution-console">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title="Active Runs"
              description="Currently executing Test Suites and Scenarios across runner pools."
              badge={
                autoRefresh ? (
                  <Badge className="pill pill-success h-6 gap-1.5">
                    <Radio className="h-3 w-3" />
                    Live
                  </Badge>
                ) : undefined
              }
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5">
                    <Switch
                      id="auto-refresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                    <Label htmlFor="auto-refresh" className="text-xs text-muted-foreground cursor-pointer">
                      Auto-refresh (5s)
                    </Label>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLastRefresh(new Date())} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsRunWizardOpen(true)}
                    className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <Play className="h-4 w-4" />
                    Run Now
                  </Button>
                </div>
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 bg-muted/20">
          <div className="w-full space-y-4">
            <StaggerGrid
              columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
              className="gap-3 w-full items-stretch"
              fast
            >
              <KpiStatCard
                label="Active Suites"
                value={kpis.active_suites}
                icon={Layers}
                tone="brand"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Active Scenarios"
                value={kpis.active_scenarios}
                icon={Play}
                tone="info"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Cases In Progress"
                value={kpis.cases_in_progress}
                icon={Activity}
                tone="success"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Healings (1h)"
                value={kpis.healing_events_last_hour}
                icon={Sparkles}
                tone="warning"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Pool Utilization"
                value={kpis.runner_pool_utilization}
                icon={Gauge}
                tone="neutral"
                suffix="%"
                className="min-h-[6.5rem] col-span-2 sm:col-span-1"
              />
            </StaggerGrid>

            {autoRefresh && (
              <p className="caption-text -mt-1 text-right">
                Last updated {lastRefresh.toLocaleTimeString()}
              </p>
            )}

          {activeRuns.length > 0 ? (
            <motion.div
              className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="visible"
            >
              {activeRuns.map((run) => (
                <ActiveRunCard key={run.id} run={run} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border mb-5">
                <Play className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="section-title">No active runs</h3>
              <p className="section-description mt-2">
                Schedule a Suite or run one ad hoc to start execution.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/execution-console/schedule">
                    <Clock className="h-4 w-4" />
                    View Schedule
                  </Link>
                </Button>
                <Button onClick={() => setIsRunWizardOpen(true)} className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                  <Play className="h-4 w-4" />
                  Run Now
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      <RunNowWizard open={isRunWizardOpen} onOpenChange={setIsRunWizardOpen} />
    </AppShell>
  )
}
