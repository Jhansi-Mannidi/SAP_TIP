'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Package,
  Tags,
  Target,
  FileText,
  FlaskConical,
  Play,
  HeartPulse,
  BarChart3,
  Activity,
  Check,
  Loader2,
  Circle,
  ArrowRight,
  Clock,
  ExternalLink,
  Zap,
} from 'lucide-react'
import {
  SATIP_STAGE_METADATA,
  getStageStatusLabel,
} from '@/lib/pipeline-stage-metadata'

export type PipelineStageState = 'pending' | 'in_progress' | 'done' | 'failed' | 'skipped'

export interface PipelineStage {
  id: string
  name: string
  state: PipelineStageState
  inputSummary?: string
  outputSummary?: string
  startedAt?: string
  completedAt?: string
  details?: Record<string, string | number>
}

interface PipelineWalkthroughProps {
  transportId: string
  stages: PipelineStage[]
  className?: string
}

const STAGE_ICONS = [Package, Tags, Target, FileText, FlaskConical, Play, HeartPulse, BarChart3, Activity]

const STATE_PILL: Record<PipelineStageState, string> = {
  pending: 'border-slate-300/80 text-slate-600 dark:text-slate-400 bg-slate-500/[0.06]',
  in_progress: 'border-blue-500/35 text-blue-700 dark:text-blue-400 bg-blue-500/[0.08]',
  done: 'border-emerald-500/35 text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.08]',
  failed: 'border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/[0.08]',
  skipped: 'border-border text-muted-foreground bg-muted/30',
}

export function PipelineWalkthrough({ transportId, stages, className }: PipelineWalkthroughProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const selectedStage = selectedIndex != null ? stages[selectedIndex] : null
  const meta = selectedIndex != null ? SATIP_STAGE_METADATA[selectedIndex] : null

  const done = stages.filter((s) => s.state === 'done').length
  const percentage = Math.round((done / stages.length) * 100)

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base sm:text-lg">SATIP Pipeline</h3>
            <Badge variant="outline" className="font-mono text-[10px] h-5">
              {transportId}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            End-to-end assurance pipeline from transport extraction to live projection
          </p>
        </div>
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {done}/{stages.length} stages
              </span>
              <span className="font-mono font-medium text-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="relative rounded-xl border border-border/80 bg-gradient-to-b from-muted/30 to-card p-4 sm:p-5 overflow-x-auto">
        <div className="flex items-stretch min-w-max gap-0">
          {stages.map((stage, index) => {
            const Icon = STAGE_ICONS[index] ?? Circle
            const label = SATIP_STAGE_METADATA[index]?.label ?? stage.name
            const isLast = index === stages.length - 1

            return (
              <React.Fragment key={stage.id}>
                <PipelineNode
                  stage={stage}
                  icon={Icon}
                  label={label}
                  index={index}
                  active={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                />
                {!isLast && (
                  <PipelineConnector fromState={stage.state} toState={stages[index + 1].state} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <Sheet open={selectedIndex != null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
        >
          {selectedStage && meta && selectedIndex != null && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{meta.label}</SheetTitle>
                <SheetDescription>Pipeline stage details</SheetDescription>
              </SheetHeader>

              <div className="flex h-full flex-col min-h-0">
                <div
                  className={cn(
                    'relative shrink-0 border-b px-5 sm:px-6 pt-5 pb-4 bg-gradient-to-br via-background to-background',
                    selectedStage.state === 'done' && 'from-emerald-500/[0.08]',
                    selectedStage.state === 'in_progress' && 'from-blue-500/[0.08]',
                    selectedStage.state === 'pending' && 'from-slate-500/[0.06]',
                    selectedStage.state === 'failed' && 'from-red-500/[0.08]',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm',
                        selectedStage.state === 'done' && 'bg-emerald-600 text-white',
                        selectedStage.state === 'in_progress' && 'bg-blue-600 text-white',
                        selectedStage.state === 'pending' && 'bg-muted text-muted-foreground ring-1 ring-border',
                        selectedStage.state === 'failed' && 'bg-red-600 text-white',
                      )}
                    >
                      <StageStateIcon state={selectedStage.state} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight">{meta.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stage {selectedIndex + 1} of {stages.length} · SATIP pipeline
                      </p>
                      <Badge
                        variant="outline"
                        className={cn('mt-2 h-6 text-[10px] border', STATE_PILL[selectedStage.state])}
                      >
                        {getStageStatusLabel(selectedStage.state)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{meta.description}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
                  {selectedStage.state === 'pending' && (
                    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3.5 flex gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{meta.pendingHint}</p>
                    </div>
                  )}

                  {(selectedStage.startedAt || selectedStage.completedAt) && (
                    <section className="grid grid-cols-2 gap-3">
                      {selectedStage.startedAt && (
                        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                          <p className="micro-label">Started</p>
                          <p className="text-xs font-medium mt-1">
                            {new Date(selectedStage.startedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedStage.completedAt && (
                        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                          <p className="micro-label">Completed</p>
                          <p className="text-xs font-medium mt-1">
                            {new Date(selectedStage.completedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </section>
                  )}

                  <section className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {meta.inputLabel}
                    </h4>
                    <div className="rounded-xl border border-border bg-muted/25 p-3 text-sm font-mono leading-relaxed">
                      {selectedStage.inputSummary ?? meta.defaultInput}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {meta.outputLabel}
                    </h4>
                    <div className="rounded-xl border border-border bg-card p-3 text-sm font-mono leading-relaxed shadow-[var(--shadow-xs)]">
                      {selectedStage.outputSummary ?? meta.defaultOutput}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-brand" />
                      Stage metrics
                    </h4>
                    <div className="rounded-xl border border-border divide-y divide-border/60 overflow-hidden">
                      {Object.entries({
                        ...meta.details,
                        ...Object.fromEntries(
                          Object.entries(selectedStage.details ?? {}).map(([k, v]) => [k, String(v)]),
                        ),
                      }).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm bg-card/50"
                        >
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-mono text-xs font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="shrink-0 border-t bg-background/95 backdrop-blur px-5 sm:px-6 py-4 flex flex-col gap-2">
                  {selectedStage.state === 'done' && (
                    <Button className="w-full gap-2" variant="default" asChild>
                      <Link href="/execution-console">
                        <ExternalLink className="h-4 w-4" />
                        View in Execution Console
                      </Link>
                    </Button>
                  )}
                  {selectedStage.state === 'in_progress' && (
                    <Button className="w-full gap-2" variant="default">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Monitor live run
                    </Button>
                  )}
                  {selectedStage.state === 'pending' && selectedIndex === 5 && (
                    <Button className="w-full gap-2" variant="default">
                      <Play className="h-4 w-4" />
                      Queue test execution
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => setSelectedIndex(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PipelineNode({
  stage,
  icon: Icon,
  label,
  index,
  active,
  onClick,
}: {
  stage: PipelineStage
  icon: React.ElementType
  label: string
  index: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col items-center gap-2.5 p-3 min-w-[108px] max-w-[120px] flex-shrink-0',
        'rounded-xl border-2 transition-all duration-200',
        'hover:shadow-[var(--card-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
        stage.state === 'pending' && 'border-border/80 bg-card text-muted-foreground',
        stage.state === 'in_progress' &&
          'border-blue-500/50 bg-blue-500/[0.06] text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/15',
        stage.state === 'done' &&
          'border-emerald-500/45 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-400',
        stage.state === 'failed' && 'border-red-500/45 bg-red-500/[0.06] text-red-600',
        active && 'ring-2 ring-brand/30 border-brand/40 shadow-[var(--shadow-sm)]',
      )}
    >
      <div
        className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
          stage.state === 'pending' && 'bg-muted ring-1 ring-border',
          stage.state === 'in_progress' && 'bg-blue-600 text-white shadow-sm',
          stage.state === 'done' && 'bg-emerald-600 text-white shadow-sm',
          stage.state === 'failed' && 'bg-red-600 text-white shadow-sm',
        )}
      >
        {stage.state === 'in_progress' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : stage.state === 'done' ? (
          <Check className="h-5 w-5" strokeWidth={2.5} />
        ) : (
          <Icon className="h-5 w-5" strokeWidth={2} />
        )}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2">
        {label}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground/80">#{index + 1}</span>
    </button>
  )
}

function PipelineConnector({
  fromState,
  toState,
}: {
  fromState: PipelineStageState
  toState: PipelineStageState
}) {
  const active = fromState === 'done'
  const nextActive = toState === 'in_progress' || toState === 'done'

  return (
    <div className="flex items-center flex-shrink-0 self-center px-0.5 sm:px-1">
      <div
        className={cn('h-0.5 w-5 sm:w-8 rounded-full transition-colors', active ? 'bg-emerald-500' : 'bg-border')}
      />
      <ArrowRight
        className={cn(
          'h-3.5 w-3.5 -ml-0.5 shrink-0',
          active || nextActive ? 'text-emerald-500' : 'text-muted-foreground/40',
        )}
      />
    </div>
  )
}

function StageStateIcon({
  state,
  className,
}: {
  state: PipelineStageState
  className?: string
}) {
  if (state === 'in_progress') return <Loader2 className={cn('animate-spin', className)} />
  if (state === 'done') return <Check className={className} />
  return <Circle className={className} />
}
