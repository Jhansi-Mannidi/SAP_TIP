'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Link2,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react'

import { BPCoverageMatrix } from '@/components/bp-coverage-matrix'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { ScenarioTask } from '@/lib/mock-data'
import {
  buildScenarioCoverageScope,
  buildTransactionCoverage,
  getCoverageGaps,
  getLinkedScopeItems,
  getScenarioCoverageSummary,
} from '@/lib/scenario-coverage-data'

const TX_STATE_STYLES = {
  covered: { pill: 'pill pill-success', label: 'Covered' },
  partial: { pill: 'pill pill-warning', label: 'Partial' },
  gap: { pill: 'pill pill-danger', label: 'Gap' },
} as const

export interface ScenarioCoveragePanelProps {
  scenarioCode: string
  scenarioName: string
  businessProcess: string
  bpScopeItems: string[]
  tasks: ScenarioTask[]
  passRatePct?: number
}

export function ScenarioCoveragePanel({
  scenarioCode,
  scenarioName,
  businessProcess,
  bpScopeItems,
  tasks,
  passRatePct = 0,
}: ScenarioCoveragePanelProps) {
  const linkedItems = React.useMemo(() => getLinkedScopeItems(bpScopeItems), [bpScopeItems])
  const scope = React.useMemo(
    () => buildScenarioCoverageScope(scenarioCode, scenarioName, bpScopeItems),
    [scenarioCode, scenarioName, bpScopeItems],
  )
  const summary = React.useMemo(
    () => getScenarioCoverageSummary(bpScopeItems, tasks),
    [bpScopeItems, tasks],
  )
  const transactions = React.useMemo(
    () => buildTransactionCoverage(tasks, bpScopeItems),
    [tasks, bpScopeItems],
  )
  const gaps = React.useMemo(
    () => getCoverageGaps(bpScopeItems, businessProcess),
    [bpScopeItems, businessProcess],
  )

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Linked scope items',
            value: summary.linkedScopeCount,
            icon: Target,
            tone: 'text-brand',
          },
          {
            label: 'Transactions mapped',
            value: summary.transactionCount,
            icon: Layers,
            tone: 'text-foreground',
          },
          {
            label: 'Task coverage',
            value: `${summary.coveragePercent}%`,
            icon: Shield,
            tone: 'text-emerald-600 dark:text-emerald-400',
          },
          {
            label: 'Last pass rate',
            value: `${passRatePct}%`,
            icon: CheckCircle2,
            tone: 'text-foreground',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border/80 bg-card px-4 py-3.5 shadow-[var(--shadow-xs)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="micro-label text-[10px]">{stat.label}</p>
                <Icon className={cn('h-3.5 w-3.5', stat.tone)} />
              </div>
              <p className={cn('text-xl font-bold tabular-nums mt-1.5', stat.tone)}>{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Linked scope items */}
      <Card className="shadow-[var(--shadow-xs)]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">Linked BP Scope Items</CardTitle>
              <CardDescription>
                SAP Best Practice scope items directly covered by this scenario
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit gap-1.5 h-7 shrink-0">
              <Link2 className="h-3 w-3" />
              {linkedItems.length} linked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {linkedItems.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {linkedItems.map((item) => (
                <div
                  key={item.code}
                  className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono h-6 text-xs">
                        {item.code}
                      </Badge>
                      <Badge variant="outline" className="h-6 text-[10px]">
                        {item.module}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold mt-1.5 leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.scenarioCount} scenario{item.scenarioCount !== 1 ? 's' : ''} in suite
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-border bg-muted/15">
              <Target className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium">No BP scope items linked</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Link scope items in scenario metadata to trace coverage against SAP Best Practices.
              </p>
            </div>
          )}

          {summary.modulesCovered.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Modules touched:</span>
              {summary.modulesCovered.map((mod) => (
                <Badge key={mod} variant="secondary" className="text-[10px]">
                  {mod}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction mapping */}
      <Card className="shadow-[var(--shadow-xs)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Task → Transaction Coverage</CardTitle>
          <CardDescription>
            How scenario tasks map to T-codes and BP scope items
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {transactions.map((row) => {
              const style = TX_STATE_STYLES[row.state]
              return (
                <div
                  key={row.taskId}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-6 py-3.5 hover:bg-muted/15 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <code className="text-xs font-mono font-semibold bg-muted/60 px-2 py-1 rounded-md shrink-0">
                      {row.tcode}
                    </code>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{row.taskName}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{row.taskId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pl-0 sm:pl-0 sm:justify-end">
                    {row.scopeItems.map((code) => (
                      <Badge key={code} variant="outline" className="font-mono text-[10px] h-5">
                        {code}
                      </Badge>
                    ))}
                    <Badge className={cn('h-5 text-[9px] border-0', style.pill)}>{style.label}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="px-4 sm:px-6 py-3 border-t border-border/50 bg-muted/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Overall task-to-scope mapping</span>
              <span className="font-semibold tabular-nums text-foreground">
                {summary.coveragePercent}%
              </span>
            </div>
            <Progress value={summary.coveragePercent} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* BP matrix */}
      <Card className="shadow-[var(--shadow-xs)] overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">BP Scope Landscape</CardTitle>
              <CardDescription>
                Full process coverage context — linked items highlighted for this scenario
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 shrink-0" asChild>
              <Link href="/process-mining/coverage">
                <ExternalLink className="h-3.5 w-3.5" />
                Process Mining
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <BPCoverageMatrix scope={scope} variant="expanded" />
        </CardContent>
      </Card>

      {/* Gaps */}
      {gaps.length > 0 && (
        <Card className="shadow-[var(--shadow-xs)] border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              Coverage Recommendations
            </CardTitle>
            <CardDescription>
              Suggested improvements from coverage analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {gaps.map((gap) => (
              <div
                key={gap.title}
                className="flex gap-3 rounded-xl border border-border/60 bg-muted/10 px-4 py-3.5"
              >
                <AlertTriangle
                  className={cn(
                    'h-4 w-4 shrink-0 mt-0.5',
                    gap.priority === 'high'
                      ? 'text-red-500'
                      : gap.priority === 'medium'
                        ? 'text-amber-500'
                        : 'text-muted-foreground',
                  )}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{gap.title}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'h-5 text-[9px] capitalize border-0',
                        gap.priority === 'high'
                          ? 'pill pill-danger'
                          : gap.priority === 'medium'
                            ? 'pill pill-warning'
                            : 'pill pill-neutral',
                      )}
                    >
                      {gap.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{gap.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
