'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import type { TaskState } from '@/lib/types'

export interface TestCaseExecution {
  id: string
  name: string
  state: TaskState
  runnerId: string
  startTime: string
  endTime?: string
  duration?: number // milliseconds
}

export interface Runner {
  id: string
  name: string
  status: 'active' | 'idle' | 'offline'
}

interface TaskTimelineGanttProps {
  cases: TestCaseExecution[]
  runners: Runner[]
  startTime: string
  endTime?: string
  className?: string
}

const stateColors: Record<TaskState, string> = {
  ToDo: 'bg-slate-300',
  InProgress: 'bg-blue-500',
  Pass: 'bg-emerald-500',
  Healed: 'bg-amber-500',
  Fail: 'bg-red-500',
  Defected: 'bg-red-600',
}

export function TaskTimelineGantt({ 
  cases, 
  runners, 
  startTime, 
  endTime,
  className 
}: TaskTimelineGanttProps) {
  const timelineStart = new Date(startTime).getTime()
  const timelineEnd = endTime 
    ? new Date(endTime).getTime() 
    : Math.max(...cases.map(c => c.endTime ? new Date(c.endTime).getTime() : Date.now()))
  const timelineDuration = timelineEnd - timelineStart
  
  // Group cases by runner
  const casesByRunner = React.useMemo(() => {
    const grouped = new Map<string, TestCaseExecution[]>()
    runners.forEach(r => grouped.set(r.id, []))
    cases.forEach(c => {
      const runnerCases = grouped.get(c.runnerId) || []
      runnerCases.push(c)
      grouped.set(c.runnerId, runnerCases)
    })
    return grouped
  }, [cases, runners])
  
  // Generate time markers
  const timeMarkers = React.useMemo(() => {
    const markers: { time: number; label: string }[] = []
    const interval = timelineDuration / 6 // 6 markers
    
    for (let i = 0; i <= 6; i++) {
      const time = timelineStart + (interval * i)
      markers.push({
        time,
        label: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    }
    return markers
  }, [timelineStart, timelineDuration])
  
  return (
    <div className={cn('space-y-2', className)}>
      {/* Time axis header */}
      <div className="flex">
        <div className="w-32 flex-shrink-0" />
        <div className="flex-1 flex justify-between text-xs text-muted-foreground px-1">
          {timeMarkers.map((marker, idx) => (
            <span key={idx}>{marker.label}</span>
          ))}
        </div>
      </div>
      
      {/* Runner rows */}
      <div className="space-y-1">
        {runners.map(runner => {
          const runnerCases = casesByRunner.get(runner.id) || []
          
          return (
            <div key={runner.id} className="flex items-center gap-2">
              {/* Runner label */}
              <div className="w-32 flex-shrink-0 flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  runner.status === 'active' && 'bg-emerald-500',
                  runner.status === 'idle' && 'bg-amber-500',
                  runner.status === 'offline' && 'bg-slate-400'
                )} />
                <span className="text-sm font-medium truncate">{runner.name}</span>
              </div>
              
              {/* Timeline track */}
              <div className="flex-1 h-8 bg-slate-100 rounded relative overflow-hidden">
                {runnerCases.map(execution => {
                  const execStart = new Date(execution.startTime).getTime()
                  const execEnd = execution.endTime 
                    ? new Date(execution.endTime).getTime() 
                    : (execution.state === 'InProgress' ? Date.now() : execStart + (execution.duration || 60000))
                  
                  const left = ((execStart - timelineStart) / timelineDuration) * 100
                  const width = ((execEnd - execStart) / timelineDuration) * 100
                  
                  return (
                    <GanttBar 
                      key={execution.id}
                      execution={execution}
                      left={left}
                      width={Math.max(width, 1)} // Minimum 1% width for visibility
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-xs text-muted-foreground">State:</span>
        {Object.entries(stateColors).map(([state, color]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded', color)} />
            <span className="text-xs text-muted-foreground">{state}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GanttBar({ 
  execution, 
  left, 
  width 
}: { 
  execution: TestCaseExecution
  left: number
  width: number
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'absolute top-1 bottom-1 rounded cursor-pointer transition-opacity hover:opacity-80',
              stateColors[execution.state],
              execution.state === 'InProgress' && 'animate-pulse'
            )}
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1.5">
            <div className="font-medium">{execution.name}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn(
                'text-xs',
                execution.state === 'Pass' && 'bg-emerald-100 text-emerald-700',
                execution.state === 'Fail' && 'bg-red-100 text-red-700',
                execution.state === 'Healed' && 'bg-amber-100 text-amber-700',
                execution.state === 'InProgress' && 'bg-blue-100 text-blue-700'
              )}>
                {execution.state}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <div>Start: {new Date(execution.startTime).toLocaleTimeString()}</div>
              {execution.endTime && (
                <div>End: {new Date(execution.endTime).toLocaleTimeString()}</div>
              )}
              {execution.duration && (
                <div>Duration: {formatDuration(execution.duration)}</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
