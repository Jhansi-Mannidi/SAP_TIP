'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Radio,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Users,
  Bot,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Timer,
  Milestone,
  Target,
  ListChecks,
  Gavel,
  CalendarDays,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { AnimatedNumber, staggerItem } from '@/lib/animations'

import {
  MOCK_ACTIVE_WINDOW,
  MOCK_DECISIONS,
  type CutoverTask,
  type CutoverTaskStatus,
} from '@/lib/cutover-mock-data'

const statusConfig: Record<
  CutoverTaskStatus,
  { icon: React.ElementType; color: string; bg: string; badge: string }
> = {
  Completed: {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    badge: 'pill pill-success',
  },
  'In Progress': {
    icon: Play,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    badge: 'pill pill-info',
  },
  Failed: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10',
    badge: 'pill pill-danger',
  },
  Blocked: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    badge: 'pill pill-warning',
  },
  'Not Started': {
    icon: Clock,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    badge: 'pill pill-neutral',
  },
  Skipped: {
    icon: Pause,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    badge: 'pill pill-neutral',
  },
}

function CutoverProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-brand to-[#d4a04a]"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
      />
    </div>
  )
}

function AlertPill({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href?: string
  icon: React.ElementType
  label: string
  tone: 'danger' | 'warning' | 'info'
}) {
  const tones = {
    danger: 'pill pill-danger',
    warning: 'pill pill-warning',
    info: 'pill pill-danger',
  }

  const content = (
    <Badge className={cn('h-7 gap-1.5 text-xs px-3 border-0', tones[tone])}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        {content}
      </Link>
    )
  }

  return content
}

function TaskRow({ task }: { task: CutoverTask }) {
  const config = statusConfig[task.status]
  const StatusIcon = config.icon

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ x: 2 }}
      className={cn(
        'flex items-start sm:items-center gap-3 p-3 rounded-xl border border-border bg-card',
        'shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]',
        task.status === 'In Progress' && 'ring-1 ring-blue-500/20 bg-blue-500/[0.04]',
        task.status === 'Failed' && 'ring-1 ring-red-500/20 bg-red-500/[0.04]',
        task.status === 'Blocked' && 'ring-1 ring-amber-500/20 bg-amber-500/[0.04]',
      )}
    >
      <div className={cn('p-2 rounded-xl ring-1 ring-inset ring-border/40 shrink-0', config.bg)}>
        <StatusIcon className={cn('h-4 w-4', config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-mono">#{task.order}</span>
          <span className="font-medium text-sm truncate">{task.name}</span>
          {task.is_milestone && <Milestone className="h-3.5 w-3.5 text-violet-500 shrink-0" />}
          {task.is_critical_path && (
            <Badge className="h-5 text-[10px] bg-red-500/10 text-red-700 dark:text-red-400 border-0">
              Critical Path
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {task.assignee.type === 'agent' ? (
              <Bot className="h-3 w-3 text-indigo-500" />
            ) : (
              <Users className="h-3 w-3" />
            )}
            <span>{task.assignee.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>{task.duration_mins}m</span>
          </div>
          {task.blockers && task.blockers.length > 0 && (
            <Badge className="h-5 text-[10px] pill pill-warning border-0">
              Blocked by #{task.blockers[0].replace('ct_', '')}
            </Badge>
          )}
        </div>
      </div>

      <Badge className={cn('shrink-0 h-6 text-[11px] border-0', config.badge)}>{task.status}</Badge>
    </motion.div>
  )
}

function TaskList({
  tasks,
  phases,
}: {
  tasks: CutoverTask[]
  phases?: Record<string, CutoverTask[]>
}) {
  if (phases) {
    return (
      <div className="space-y-5 pr-2">
        {Object.entries(phases).map(([phase, phaseTasks]) => (
          <div key={phase}>
            <h4 className="micro-label mb-2.5">{phase}</h4>
            <div className="space-y-2">
              {phaseTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2 pr-2">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  )
}

export default function ActiveWindowPage() {
  const window = MOCK_ACTIVE_WINDOW
  const pendingDecisions = MOCK_DECISIONS.filter((d) => d.status === 'Pending')

  const progress = Math.round((window.completed_tasks / window.total_tasks) * 100)

  const tasksByPhase = window.tasks.reduce(
    (acc, task) => {
      if (!acc[task.phase]) acc[task.phase] = []
      acc[task.phase].push(task)
      return acc
    },
    {} as Record<string, CutoverTask[]>,
  )

  const startTime = new Date(window.actual_start || window.planned_start)
  const now = new Date()
  const elapsedMs = now.getTime() - startTime.getTime()
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60))
  const elapsedMins = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))

  const currentTask = window.tasks.find((t) => t.status === 'In Progress')
  const inProgressCount = window.tasks.filter((t) => t.status === 'In Progress').length
  const remainingCount = window.tasks.filter((t) => t.status === 'Not Started').length

  const hasAlerts =
    window.failed_tasks > 0 || window.blocked_tasks > 0 || pendingDecisions.length > 0

  return (
    <AppShell currentApp="cutover-command">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        {/* Sticky command header */}
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {/* Live status — brand navy/gold, not green */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={cn(
                'relative overflow-hidden rounded-xl border border-border',
                'bg-gradient-to-br from-card via-card to-brand/[0.07]',
                'dark:to-brand/[0.12] border-l-[3px] border-l-brand',
                'shadow-[var(--shadow-xs)]',
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/[0.06] blur-2xl dark:bg-brand/[0.1]"
              />

              <div className="relative p-4 sm:p-5">
                <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6">
                  {/* Title block */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <Badge className="pill pill-success h-6 text-[11px] border-0 gap-1">
                        <Radio className="h-3 w-3" />
                        LIVE
                      </Badge>
                      <Badge variant="outline" className="h-6 text-[11px] font-medium">
                        {window.phase}
                      </Badge>
                    </div>
                    <div>
                      <h1 className="page-title leading-tight">{window.name}</h1>
                      <p className="page-description mt-0.5">{window.migration_name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground">
                        Elapsed:{' '}
                        <span className="font-mono font-semibold text-foreground tabular-nums">
                          {elapsedHours}h {elapsedMins}m
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Tasks:{' '}
                        <span className="font-semibold text-foreground tabular-nums">
                          {window.completed_tasks}/{window.total_tasks}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Progress block */}
                  <div className="w-full xl:w-56 shrink-0 space-y-2">
                    <div className="flex items-end justify-between">
                      <span className="micro-label">Overall Progress</span>
                      <span className="text-2xl font-bold tabular-nums text-brand leading-none">
                        <AnimatedNumber value={progress} suffix="%" duration={0.9} className="inline" />
                      </span>
                    </div>
                    <CutoverProgressBar value={progress} />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-stretch xl:w-44 shrink-0">
                    <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 flex-1 xl:flex-none" asChild>
                      <Link href="/cutover/war-room">
                        <Radio className="h-4 w-4" />
                        War Room
                      </Link>
                    </Button>
                    {window.war_room_url && (
                      <Button variant="outline" size="sm" className="gap-2 flex-1 xl:flex-none" asChild>
                        <a href={window.war_room_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Teams Call
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2 flex-1 xl:flex-none" asChild>
                      <Link href="/cutover/plan">
                        <CalendarDays className="h-4 w-4" />
                        Full Plan
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Alerts */}
            {hasAlerts && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="flex flex-wrap items-center gap-2"
              >
                {window.failed_tasks > 0 && (
                  <AlertPill icon={XCircle} label={`${window.failed_tasks} Failed`} tone="danger" />
                )}
                {window.blocked_tasks > 0 && (
                  <AlertPill icon={AlertTriangle} label={`${window.blocked_tasks} Blocked`} tone="warning" />
                )}
                {pendingDecisions.length > 0 && (
                  <AlertPill
                    href="/cutover/decisions"
                    icon={AlertCircle}
                    label={`${pendingDecisions.length} Decision${pendingDecisions.length > 1 ? 's' : ''} Pending`}
                    tone="info"
                  />
                )}
              </motion.div>
            )}

            {/* Compact KPI strip */}
            <StaggerGrid
              columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
              className="gap-2.5 w-full items-stretch"
              fast
            >
              <KpiStatCard label="Completed" value={window.completed_tasks} icon={CheckCircle} tone="success" className="min-h-[5.5rem]" />
              <KpiStatCard label="In Progress" value={inProgressCount} icon={Play} tone="info" className="min-h-[5.5rem]" />
              <KpiStatCard label="Failed" value={window.failed_tasks} icon={XCircle} tone="danger" className="min-h-[5.5rem]" />
              <KpiStatCard label="Blocked" value={window.blocked_tasks} icon={AlertTriangle} tone="warning" className="min-h-[5.5rem]" />
              <KpiStatCard label="Remaining" value={remainingCount} icon={Target} tone="neutral" className="min-h-[5.5rem] col-span-2 sm:col-span-1" />
            </StaggerGrid>
          </div>
        </div>

        {/* Main content — full width grid, no StaggerGrid wrapper breaking col-span */}
        <div className="flex-1 min-h-0 overflow-hidden bg-muted/20">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid h-full grid-cols-1 xl:grid-cols-4 gap-4 min-h-0">
              {/* Task list — 3/4 width on xl */}
              <Card className="xl:col-span-3 flex flex-col min-h-0 shadow-[var(--shadow-xs)] overflow-hidden">
                <CardHeader className="pb-3 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="card-title-text flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-brand" />
                        Cutover Tasks
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Live task execution across all cutover phases
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 shrink-0">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 flex flex-col pt-0">
                  <Tabs defaultValue="all" className="flex flex-col flex-1 min-h-0">
                    <TabsList className="mb-3 w-full sm:w-auto flex overflow-x-auto justify-start shrink-0">
                      <TabsTrigger value="all" className="shrink-0">
                        All ({window.tasks.length})
                      </TabsTrigger>
                      <TabsTrigger value="in-progress" className="shrink-0">
                        In Progress ({inProgressCount})
                      </TabsTrigger>
                      <TabsTrigger value="blocked" className="shrink-0">
                        Blocked/Failed ({window.failed_tasks + window.blocked_tasks})
                      </TabsTrigger>
                      <TabsTrigger value="upcoming" className="shrink-0">
                        Upcoming ({remainingCount})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
                      <ScrollArea className="h-full min-h-[320px] xl:min-h-0 xl:h-[calc(100vh-22rem)]">
                        <TaskList tasks={window.tasks} phases={tasksByPhase} />
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="in-progress" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
                      <ScrollArea className="h-full min-h-[320px] xl:min-h-0 xl:h-[calc(100vh-22rem)]">
                        <TaskList tasks={window.tasks.filter((t) => t.status === 'In Progress')} />
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="blocked" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
                      <ScrollArea className="h-full min-h-[320px] xl:min-h-0 xl:h-[calc(100vh-22rem)]">
                        <TaskList
                          tasks={window.tasks.filter(
                            (t) => t.status === 'Failed' || t.status === 'Blocked',
                          )}
                        />
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="upcoming" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden">
                      <ScrollArea className="h-full min-h-[320px] xl:min-h-0 xl:h-[calc(100vh-22rem)]">
                        <TaskList tasks={window.tasks.filter((t) => t.status === 'Not Started')} />
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right rail — 1/4 width, stacked panels */}
              <div className="xl:col-span-1 flex flex-col gap-3 min-h-0 overflow-y-auto xl:overflow-y-auto">
                {currentTask && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                  >
                    <Card className="shadow-[var(--shadow-xs)] ring-1 ring-blue-500/15 bg-blue-500/[0.03] dark:bg-blue-500/[0.06]">
                      <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                          </span>
                          Currently Running
                        </CardDescription>
                        <CardTitle className="text-base leading-snug">{currentTask.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {currentTask.description}
                        </p>
                        <div className="flex items-center justify-between text-sm gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {currentTask.assignee.type === 'agent' ? (
                              <Bot className="h-4 w-4 text-indigo-500 shrink-0" />
                            ) : (
                              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="font-medium truncate">{currentTask.assignee.name}</span>
                          </div>
                          <Badge className="pill pill-info h-5 text-[10px] border-0 shrink-0">
                            {currentTask.duration_mins}m est.
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {pendingDecisions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                  >
                    <Card className="shadow-[var(--shadow-xs)] ring-1 ring-red-500/15">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                            <Gavel className="h-4 w-4" />
                            Decisions
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                            <Link href="/cutover/decisions">View all</Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {pendingDecisions.map((decision) => (
                          <Link
                            key={decision.id}
                            href={`/cutover/decisions?id=${decision.id}`}
                            className="block p-3 rounded-xl border border-border bg-red-500/[0.04] hover:bg-red-500/[0.08] dark:hover:bg-red-500/[0.1] transition-colors"
                          >
                            <Badge className="pill pill-danger h-5 text-[10px] border-0 mb-1.5">
                              {decision.severity}
                            </Badge>
                            <p className="text-sm font-medium leading-snug line-clamp-2">{decision.title}</p>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Phase breakdown — fills remaining sidebar space */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                  className="flex-1 min-h-0"
                >
                  <Card className="shadow-[var(--shadow-xs)] h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Phase Breakdown</CardTitle>
                      <CardDescription>Task distribution by cutover phase</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(tasksByPhase).map(([phase, tasks]) => {
                        const completed = tasks.filter((t) => t.status === 'Completed').length
                        const phasePct = Math.round((completed / tasks.length) * 100)
                        return (
                          <div key={phase} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium truncate pr-2">{phase}</span>
                              <span className="text-muted-foreground tabular-nums shrink-0 text-xs">
                                {completed}/{tasks.length}
                              </span>
                            </div>
                            <CutoverProgressBar value={phasePct} />
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
