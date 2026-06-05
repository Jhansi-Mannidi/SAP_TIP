'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
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
  ArrowRight
} from 'lucide-react'

export type PipelineStageState = 'pending' | 'in_progress' | 'done' | 'failed' | 'skipped'

export interface PipelineStage {
  id: string
  name: string
  state: PipelineStageState
  inputSummary?: string
  outputSummary?: string
  startedAt?: string
  completedAt?: string
  details?: Record<string, any>
}

interface PipelineWalkthroughProps {
  transportId: string
  stages: PipelineStage[]
  className?: string
}

const stageConfig: Record<number, { icon: React.ElementType; label: string }> = {
  0: { icon: Package, label: 'Transport Extraction' },
  1: { icon: Tags, label: 'Object Classification' },
  2: { icon: Target, label: 'Impact Analysis' },
  3: { icon: FileText, label: 'Test Plan Generation' },
  4: { icon: FlaskConical, label: 'Test Generation / Regeneration' },
  5: { icon: Play, label: 'Test Execution' },
  6: { icon: HeartPulse, label: 'Self-Healing Loop' },
  7: { icon: BarChart3, label: 'Delta Scoring' },
  8: { icon: Activity, label: 'Live Dashboard Projection' },
}

export function PipelineWalkthrough({ transportId, stages, className }: PipelineWalkthroughProps) {
  const [selectedStage, setSelectedStage] = React.useState<PipelineStage | null>(null)
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">SATIP Pipeline</h3>
          <p className="page-description">{transportId}</p>
        </div>
        <PipelineProgress stages={stages} />
      </div>
      
      {/* Pipeline visualization */}
      <div className="relative">
        <div className="flex items-center overflow-x-auto pb-4 gap-0">
          {stages.map((stage, index) => {
            const config = stageConfig[index]
            const Icon = config?.icon || Circle
            
            return (
              <React.Fragment key={stage.id}>
                <PipelineNode
                  stage={stage}
                  icon={Icon}
                  label={config?.label || stage.name}
                  onClick={() => setSelectedStage(stage)}
                />
                {index < stages.length - 1 && (
                  <PipelineConnector 
                    fromState={stage.state} 
                    toState={stages[index + 1].state}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      
      {/* Stage detail drawer */}
      <Sheet open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedStage && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <StageStateIcon state={selectedStage.state} />
                  {stageConfig[stages.indexOf(selectedStage)]?.label || selectedStage.name}
                </SheetTitle>
                <SheetDescription>
                  Stage {stages.indexOf(selectedStage) + 1} of {stages.length} in the SATIP pipeline
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* State badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <StageStateBadge state={selectedStage.state} />
                </div>
                
                {/* Timestamps */}
                {(selectedStage.startedAt || selectedStage.completedAt) && (
                  <div className="space-y-2">
                    {selectedStage.startedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Started:</span>
                        <span>{new Date(selectedStage.startedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedStage.completedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{new Date(selectedStage.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Input summary */}
                {selectedStage.inputSummary && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Input Artefacts</h4>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      {selectedStage.inputSummary}
                    </div>
                  </div>
                )}
                
                {/* Output summary */}
                {selectedStage.outputSummary && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Output Artefacts</h4>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      {selectedStage.outputSummary}
                    </div>
                  </div>
                )}
                
                {/* Details */}
                {selectedStage.details && Object.keys(selectedStage.details).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Stage Details</h4>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      {Object.entries(selectedStage.details).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
  onClick 
}: { 
  stage: PipelineStage
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  const stateStyles = {
    pending: 'bg-slate-100 border-slate-300 text-slate-500',
    in_progress: 'bg-blue-50 border-blue-400 text-blue-600 animate-pulse',
    done: 'bg-emerald-50 border-emerald-400 text-emerald-600',
    failed: 'bg-red-50 border-red-400 text-red-600',
    skipped: 'bg-slate-50 border-slate-200 text-slate-400',
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-3 min-w-[100px] flex-shrink-0',
        'rounded-lg border-2 transition-all',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        stateStyles[stage.state]
      )}
    >
      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
        {stage.state === 'in_progress' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : stage.state === 'done' ? (
          <Check className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <span className="text-xs font-medium text-center leading-tight max-w-[90px]">
        {label}
      </span>
    </button>
  )
}

function PipelineConnector({ fromState, toState }: { fromState: PipelineStageState; toState: PipelineStageState }) {
  const isActive = fromState === 'done'
  
  return (
    <div className="flex items-center flex-shrink-0 px-1">
      <div className={cn(
        'h-0.5 w-6',
        isActive ? 'bg-emerald-400' : 'bg-slate-200'
      )} />
      <ArrowRight className={cn(
        'h-4 w-4 -ml-1',
        isActive ? 'text-emerald-400' : 'text-slate-300'
      )} />
    </div>
  )
}

function PipelineProgress({ stages }: { stages: PipelineStage[] }) {
  const done = stages.filter(s => s.state === 'done').length
  const total = stages.length
  const percentage = Math.round((done / total) * 100)
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {done}/{total} stages
      </span>
      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  )
}

function StageStateIcon({ state }: { state: PipelineStageState }) {
  if (state === 'in_progress') {
    return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
  }
  if (state === 'done') {
    return <Check className="h-5 w-5 text-emerald-500" />
  }
  return <Circle className="h-5 w-5 text-slate-400" />
}

function StageStateBadge({ state }: { state: PipelineStageState }) {
  const styles = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    skipped: 'bg-slate-50 text-slate-500',
  }
  
  const labels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    done: 'Completed',
    failed: 'Failed',
    skipped: 'Skipped',
  }
  
  return (
    <Badge variant="secondary" className={styles[state]}>
      {labels[state]}
    </Badge>
  )
}
