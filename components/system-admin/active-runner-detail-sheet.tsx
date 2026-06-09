'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  Cpu,
  HardDrive,
  Layers,
  Play,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  MOCK_RUNNER_POOLS,
  type ActiveRunner,
  type HealthStatus,
  type RunnerState,
} from '@/lib/config-mock-data'

const STATE_STYLES: Record<RunnerState, { label: string; pill: string }> = {
  executing: {
    label: 'Executing',
    pill: 'border-blue-500/35 text-blue-700 dark:text-blue-400 bg-blue-500/[0.06]',
  },
  idle: {
    label: 'Idle',
    pill: 'border-emerald-500/35 text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.06]',
  },
  draining: {
    label: 'Draining',
    pill: 'border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/[0.06]',
  },
  failed: {
    label: 'Failed',
    pill: 'border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/[0.06]',
  },
}

const HEALTH_STYLES: Record<HealthStatus, string> = {
  healthy: 'text-emerald-600 dark:text-emerald-400',
  degraded: 'text-amber-600 dark:text-amber-400',
  unhealthy: 'text-red-600 dark:text-red-400',
}

export function ActiveRunnerDetailSheet({
  runner,
  open,
  onOpenChange,
}: {
  runner: ActiveRunner | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!runner) return null

  const pool = MOCK_RUNNER_POOLS.find((p) => p.id === runner.pool_id)
  const state = STATE_STYLES[runner.state]

  const formatLease = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Runner Instance</SheetTitle>
          <SheetDescription>Live runner metrics and lease details</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col min-h-0">
          <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-blue-500/[0.08] via-background to-background px-5 sm:px-6 pt-5 pb-4">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-mono font-semibold text-base leading-tight">{runner.id}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{runner.host_id}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className={cn('h-6 text-[10px] border', state.pill)}>
                    {state.label}
                  </Badge>
                  <Badge variant="outline" className="h-6 text-[10px] capitalize">
                    <span className={HEALTH_STYLES[runner.health]}>{runner.health}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-lg border border-border/70 bg-card/80 px-3 py-2">
                <p className="caption-text flex items-center gap-1">
                  <Cpu className="h-3 w-3" /> CPU
                </p>
                <p className="font-mono font-semibold text-lg tabular-nums mt-1">{runner.cpu_utilization}%</p>
                <Progress value={runner.cpu_utilization} className="h-1 mt-2" />
              </div>
              <div className="rounded-lg border border-border/70 bg-card/80 px-3 py-2">
                <p className="caption-text flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> Memory
                </p>
                <p className="font-mono font-semibold text-lg tabular-nums mt-1">
                  {runner.memory_utilization}%
                </p>
                <Progress value={runner.memory_utilization} className="h-1 mt-2" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Pool
              </h4>
              <p className="text-sm font-medium">{pool?.name ?? runner.pool_id}</p>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Lease Until
              </h4>
              <p className="text-sm font-mono">{formatLease(runner.lease_until)}</p>
            </section>

            {runner.current_execution ? (
              <section className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 text-brand" />
                  Current Execution
                </h4>
                <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]">
                  <p className="text-sm font-medium leading-snug">{runner.current_execution.name}</p>
                  <code className="text-[10px] font-mono text-muted-foreground mt-1 block">
                    {runner.current_execution.id}
                  </code>
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-dashed bg-muted/20 p-4 text-center">
                <p className="text-sm text-muted-foreground">No active execution on this runner</p>
              </section>
            )}
          </div>

          <div className="shrink-0 border-t bg-background/95 backdrop-blur px-5 sm:px-6 py-4 flex flex-col gap-2">
            {runner.current_execution && (
              <Button className="w-full gap-2" asChild>
                <Link href={`/execution-console/runs/${runner.current_execution.id}`}>
                  <Play className="h-4 w-4" />
                  Open Execution
                </Link>
              </Button>
            )}
            <Button variant="outline" className="w-full gap-2">
              <Zap className="h-4 w-4" />
              Force Release Lease
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
