'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  Layers,
  Monitor,
  Pause,
  Server,
  Settings,
  Tag,
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
  MOCK_ACTIVE_RUNNERS,
  MOCK_SAP_SYSTEMS,
  RUNNER_KIND_LABELS,
  type RunnerKind,
  type RunnerPool,
} from '@/lib/config-mock-data'

export const RUNNER_KIND_COLORS: Record<RunnerKind, string> = {
  sap_gui_windows: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
  fiori_browser: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
  api_runner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  hybrid: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
}

function getSystemSid(systemId: string) {
  return MOCK_SAP_SYSTEMS.find((s) => s.id === systemId)?.sid ?? systemId
}

export function RunnerPoolDetailSheet({
  pool,
  open,
  onOpenChange,
  onViewRunners,
}: {
  pool: RunnerPool | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewRunners?: () => void
}) {
  if (!pool) return null

  const activeInPool = MOCK_ACTIVE_RUNNERS.filter((r) => r.pool_id === pool.id)
  const executing = activeInPool.filter((r) => r.state === 'executing').length
  const idle = activeInPool.filter((r) => r.state === 'idle').length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Runner Pool Details</SheetTitle>
          <SheetDescription>Capacity, scaling, and utilization for this pool</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col min-h-0">
          <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.08] via-background to-background px-5 sm:px-6 pt-5 pb-4">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
                <Layers className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base leading-tight">{pool.name}</h3>
                <Badge
                  variant="outline"
                  className={cn('mt-2 h-6 text-[10px] border', RUNNER_KIND_COLORS[pool.kind])}
                >
                  {RUNNER_KIND_LABELS[pool.kind]}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Capacity', value: pool.capacity },
                { label: 'Executing', value: executing },
                { label: 'Idle', value: idle },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-center"
                >
                  <p className="text-lg font-semibold tabular-nums leading-none">{stat.value}</p>
                  <p className="caption-text mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Utilization</span>
                <span className="font-mono font-medium tabular-nums">{pool.current_utilization}%</span>
              </div>
              <Progress value={pool.current_utilization} className="h-2" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-brand" />
                Auto-Scale
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]">
                  <p className="caption-text">Min scale</p>
                  <p className="font-mono font-semibold text-lg tabular-nums mt-1">{pool.min_scale}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]">
                  <p className="caption-text">Max scale</p>
                  <p className="font-mono font-semibold text-lg tabular-nums mt-1">{pool.max_scale}</p>
                </div>
              </div>
            </section>

            {pool.os_image && (
              <section className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                  OS Image
                </h4>
                <p className="text-sm rounded-xl border border-border bg-muted/20 p-3 leading-relaxed">
                  {pool.os_image}
                </p>
              </section>
            )}

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {pool.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] font-mono">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-muted-foreground" />
                Restricted To
              </h4>
              {pool.restricted_systems.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {pool.restricted_systems.map((sysId) => (
                    <Badge key={sysId} variant="secondary" className="font-mono text-[10px]">
                      {getSystemSid(sysId)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">All registered SAP systems</p>
              )}
            </section>
          </div>

          <div className="shrink-0 border-t bg-background/95 backdrop-blur px-5 sm:px-6 py-4 flex flex-col gap-2">
            <Button className="w-full gap-2" onClick={onViewRunners}>
              <Activity className="h-4 w-4" />
              View Active Runners
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Settings className="h-4 w-4" />
              Configure Pool
            </Button>
            <Button variant="outline" className="w-full gap-2 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/5">
              <Pause className="h-4 w-4" />
              Drain Pool
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
