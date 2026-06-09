'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SAPModule } from '@/lib/types'

export type CoverageState =
  | 'covered_passing'
  | 'covered_healing'
  | 'covered_failing'
  | 'not_covered'
  | 'out_of_scope'

export interface ScopeItem {
  id: string
  code: string
  name: string
  module: SAPModule
  coverageState: CoverageState
  scenarioCount: number
  scenarios?: {
    id: string
    name: string
    state: string
  }[]
}

export interface BPScope {
  id: string
  name: string
  items: ScopeItem[]
}

interface BPCoverageMatrixProps {
  scope: BPScope
  className?: string
  variant?: 'compact' | 'expanded'
}

const stateConfig: Record<
  CoverageState,
  { label: string; shortLabel: string; bg: string; border: string; text: string; dot: string; bar: string }
> = {
  covered_passing: {
    label: 'Covered & Passing',
    shortLabel: 'Passing',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  covered_healing: {
    label: 'Covered & Healing',
    shortLabel: 'Healing',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  covered_failing: {
    label: 'Covered & Failing',
    shortLabel: 'Failing',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
  },
  not_covered: {
    label: 'Not Covered',
    shortLabel: 'Gap',
    bg: 'bg-muted/40',
    border: 'border-border',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground/50',
    bar: 'bg-muted-foreground/30',
  },
  out_of_scope: {
    label: 'Out of Scope',
    shortLabel: 'N/A',
    bg: 'bg-background',
    border: 'border-dashed border-border',
    text: 'text-muted-foreground',
    dot: 'bg-border',
    bar: 'bg-border',
  },
}

const moduleGroups: SAPModule[] = ['SD', 'MM', 'FI', 'CO', 'PP', 'WM', 'HCM', 'PM', 'QM', 'PS']

function useMatrixData(scope: BPScope) {
  const itemsByModule = React.useMemo(() => {
    const grouped = new Map<SAPModule, ScopeItem[]>()
    moduleGroups.forEach((m) => grouped.set(m, []))
    scope.items.forEach((item) => {
      const moduleItems = grouped.get(item.module) || []
      moduleItems.push(item)
      grouped.set(item.module, moduleItems)
    })
    return grouped
  }, [scope.items])

  const stats = React.useMemo(() => {
    const total = scope.items.length
    const covered = scope.items.filter(
      (i) => i.coverageState !== 'not_covered' && i.coverageState !== 'out_of_scope',
    ).length
    const passing = scope.items.filter((i) => i.coverageState === 'covered_passing').length
    const failing = scope.items.filter((i) => i.coverageState === 'covered_failing').length
    const healing = scope.items.filter((i) => i.coverageState === 'covered_healing').length
    const notCovered = scope.items.filter((i) => i.coverageState === 'not_covered').length

    return {
      total,
      covered,
      passing,
      failing,
      healing,
      notCovered,
      coveragePercent: total > 0 ? Math.round((covered / total) * 100) : 0,
    }
  }, [scope.items])

  const moduleStats = React.useMemo(() => {
    const result = new Map<SAPModule, { total: number; covered: number; percent: number }>()
    moduleGroups.forEach((module) => {
      const items = itemsByModule.get(module) || []
      if (items.length === 0) return
      const covered = items.filter(
        (i) => i.coverageState !== 'not_covered' && i.coverageState !== 'out_of_scope',
      ).length
      result.set(module, {
        total: items.length,
        covered,
        percent: Math.round((covered / items.length) * 100),
      })
    })
    return result
  }, [itemsByModule])

  return { itemsByModule, stats, moduleStats }
}

export function BPCoverageMatrix({ scope, className, variant = 'compact' }: BPCoverageMatrixProps) {
  const [selectedItem, setSelectedItem] = React.useState<ScopeItem | null>(null)
  const { itemsByModule, stats, moduleStats } = useMatrixData(scope)

  return (
    <div className={cn('space-y-6', className)}>
      <MatrixHeader stats={stats} scopeName={scope.name} />

      {variant === 'expanded' ? (
        <ExpandedModuleList
          itemsByModule={itemsByModule}
          moduleStats={moduleStats}
          onSelect={setSelectedItem}
        />
      ) : (
        <CompactModuleGrid itemsByModule={itemsByModule} onSelect={setSelectedItem} />
      )}

      <ScopeItemSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}

function MatrixHeader({
  scopeName,
  stats,
}: {
  scopeName: string
  stats: ReturnType<typeof useMatrixData>['stats']
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{scopeName}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.covered} of {stats.total} scope items covered
          </p>
        </div>
        <div className="flex items-center gap-3 sm:text-right">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36" aria-hidden>
              <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-brand"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${stats.coveragePercent} 100`}
              />
            </svg>
            <span className="absolute text-sm font-semibold tabular-nums">{stats.coveragePercent}%</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-right">
            <span className="text-muted-foreground">
              Passing <span className="font-semibold text-emerald-600 tabular-nums">{stats.passing}</span>
            </span>
            <span className="text-muted-foreground">
              Healing <span className="font-semibold text-amber-600 tabular-nums">{stats.healing}</span>
            </span>
            <span className="text-muted-foreground">
              Failing <span className="font-semibold text-red-600 tabular-nums">{stats.failing}</span>
            </span>
            <span className="text-muted-foreground">
              Gaps <span className="font-semibold tabular-nums">{stats.notCovered}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 py-3 border-y border-border/60">
        {Object.entries(stateConfig).map(([state, config]) => (
          <div key={state} className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full shrink-0', config.dot)} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExpandedModuleList({
  itemsByModule,
  moduleStats,
  onSelect,
}: {
  itemsByModule: Map<SAPModule, ScopeItem[]>
  moduleStats: Map<SAPModule, { total: number; covered: number; percent: number }>
  onSelect: (item: ScopeItem) => void
}) {
  return (
    <div className="space-y-5">
      {moduleGroups.map((module) => {
        const items = itemsByModule.get(module) || []
        if (items.length === 0) return null
        const modStats = moduleStats.get(module)

        return (
          <section
            key={module}
            className="rounded-xl border border-border/70 bg-card shadow-[var(--shadow-xs)] overflow-hidden"
          >
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3.5 bg-muted/25 border-b border-border/60">
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded-md bg-brand/10 px-2 font-mono text-sm font-bold text-brand border border-brand/20">
                  {module}
                </span>
                <div>
                  <p className="text-sm font-medium leading-none">{items.length} scope items</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {modStats?.covered ?? 0} covered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:min-w-[10rem]">
                <Progress value={modStats?.percent ?? 0} className="h-1.5 flex-1 sm:w-28 sm:flex-none" />
                <span className="text-xs font-mono font-medium tabular-nums text-muted-foreground w-10 text-right shrink-0">
                  {modStats?.percent ?? 0}%
                </span>
              </div>
            </header>

            <ul className="divide-y divide-border/50">
              {items.map((item) => (
                <ScopeItemRow key={item.id} item={item} onClick={() => onSelect(item)} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function ScopeItemRow({ item, onClick }: { item: ScopeItem; onClick: () => void }) {
  const config = stateConfig[item.coverageState]

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 text-left transition-colors hover:bg-muted/30 focus:outline-none focus-visible:bg-muted/40"
      >
        <span className={cn('w-1 self-stretch rounded-full shrink-0 min-h-[2.75rem]', config.bar)} />

        <span
          className={cn(
            'flex h-9 w-11 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold',
            config.bg,
            config.border,
            config.text,
          )}
        >
          {item.code}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium leading-snug truncate">{item.name}</span>
          <span className={cn('block text-xs mt-0.5', config.text)}>{config.shortLabel}</span>
        </span>

        <span className="hidden sm:flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="font-mono text-[10px] h-6 tabular-nums">
            {item.scenarioCount} {item.scenarioCount === 1 ? 'scenario' : 'scenarios'}
          </Badge>
        </span>

        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
      </button>
    </li>
  )
}

function CompactModuleGrid({
  itemsByModule,
  onSelect,
}: {
  itemsByModule: Map<SAPModule, ScopeItem[]>
  onSelect: (item: ScopeItem) => void
}) {
  return (
    <ScrollArea className="w-full">
      <div className="space-y-4 min-w-max">
        {moduleGroups.map((module) => {
          const items = itemsByModule.get(module) || []
          if (items.length === 0) return null

          return (
            <div key={module} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {module}
                </Badge>
                <span className="text-xs text-muted-foreground">{items.length} items</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {items.map((item) => (
                  <CompactCoverageCell key={item.id} item={item} onClick={() => onSelect(item)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function CompactCoverageCell({ item, onClick }: { item: ScopeItem; onClick: () => void }) {
  const config = stateConfig[item.coverageState]

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            className={cn(
              'w-8 h-8 sm:w-9 sm:h-9 rounded border-2 text-xs font-mono font-medium',
              'transition-all hover:scale-105 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 focus:ring-offset-background',
              config.bg,
              config.border,
              config.text,
            )}
          >
            {item.scenarioCount > 0 && <span className="text-[10px]">{item.scenarioCount}</span>}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-mono font-medium">{item.code}</p>
            <p className="text-xs">{item.name}</p>
            <p className="caption-text">
              {item.scenarioCount} scenario{item.scenarioCount !== 1 ? 's' : ''}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ScopeItemSheet({ item, onClose }: { item: ScopeItem | null; onClose: () => void }) {
  if (!item) return null

  const config = stateConfig[item.coverageState]

  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{item.code}</SheetTitle>
          <SheetDescription>{item.name}</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col min-h-0">
          <div
            className={cn(
              'relative shrink-0 border-b px-5 sm:px-6 pt-5 pb-4 bg-gradient-to-br via-background to-background',
              item.coverageState === 'covered_passing' && 'from-emerald-500/[0.08]',
              item.coverageState === 'covered_healing' && 'from-amber-500/[0.08]',
              item.coverageState === 'covered_failing' && 'from-red-500/[0.08]',
              item.coverageState === 'not_covered' && 'from-slate-500/[0.06]',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold border',
                  config.bg,
                  config.border,
                  config.text,
                )}
              >
                {item.code}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base leading-tight">{item.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className="text-[10px] h-6">
                    {item.module}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] h-6 border', config.bg, config.border, config.text)}
                  >
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                <p className="micro-label">Scenarios</p>
                <p className="text-lg font-semibold tabular-nums mt-1">{item.scenarioCount}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                <p className="micro-label">Scope ID</p>
                <p className="text-xs font-mono font-medium mt-1.5 truncate">{item.id}</p>
              </div>
            </div>

            <section className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Linked scenarios
              </h4>
              {item.scenarios && item.scenarios.length > 0 ? (
                <div className="space-y-2">
                  {item.scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]"
                    >
                      <p className="font-medium text-sm leading-snug">{scenario.name}</p>
                      <div className="flex items-center justify-between mt-1.5 gap-2">
                        <code className="text-[10px] font-mono text-muted-foreground">{scenario.id}</code>
                        <Badge variant="secondary" className="text-[10px] capitalize h-5">
                          {scenario.state}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No scenarios linked to this scope item</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
