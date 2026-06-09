'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  ChevronLeft,
  Clock,
  Server,
  Eye,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Generate mock Gantt data
interface GanttTask {
  id: string
  caseName: string
  caseCode: string
  runnerId: string
  state: 'Passed' | 'Healed' | 'Failed' | 'InProgress' | 'Pending'
  startOffset: number // minutes from suite start
  duration: number // minutes
}

function generateMockTasks(): GanttTask[] {
  const runners = ['runner_1', 'runner_2', 'runner_3', 'runner_4', 'runner_5', 'runner_6', 'runner_7', 'runner_8']
  const tasks: GanttTask[] = []
  const states: GanttTask['state'][] = ['Passed', 'Passed', 'Passed', 'Passed', 'Healed', 'Failed', 'InProgress', 'Pending']
  
  const caseNames = [
    'VA01 Create Order', 'VA02 Change Order', 'VL01N Create Delivery', 'VL02N Post GI',
    'VF01 Create Invoice', 'FB01 Post Document', 'ME21N Create PO', 'ME22N Change PO',
    'MIGO Goods Receipt', 'MIRO Invoice Verification', 'F110 Payment Run', 'FB03 Display Doc',
    'VA03 Display Order', 'VL03N Display Delivery', 'VF03 Display Invoice', 'MM01 Create Material',
    'XK01 Create Vendor', 'XD01 Create Customer', 'FS00 GL Account', 'FK01 Vendor Master',
    'FD01 Customer Master', 'VA21 Create Quotation', 'VA22 Change Quotation', 'VA23 Display Quotation',
    'ME51N Create PR', 'ME52N Change PR', 'ME53N Display PR', 'MMBE Stock Overview',
    'MB51 Material Documents', 'MB52 Warehouse Stocks', 'CO01 Create Production Order', 'CO02 Change Production Order',
    'CO03 Display Production Order', 'MD04 Stock Requirements', 'MD01 MRP Run', 'CS01 Create BOM',
    'CS02 Change BOM', 'CS03 Display BOM', 'CR01 Create Work Center', 'CA01 Create Routing',
    'KS01 Create Cost Center', 'KS02 Change Cost Center', 'KS03 Display Cost Center', 'KB21N Post Allocation',
    'KP06 Cost Planning', 'CJ20N Project Builder', 'CN21 Create Network',
  ]

  let taskId = 1
  runners.forEach((runner, runnerIdx) => {
    let currentOffset = runnerIdx * 2 // Stagger start times
    const tasksPerRunner = 5 + Math.floor(Math.random() * 3)
    
    for (let i = 0; i < tasksPerRunner; i++) {
      const duration = 2 + Math.floor(Math.random() * 6)
      const caseIdx = (runnerIdx * tasksPerRunner + i) % caseNames.length
      const stateIdx = Math.floor(Math.random() * states.length)
      
      // Make later tasks more likely to be pending/in-progress
      let state = states[stateIdx]
      if (currentOffset > 80) state = 'Pending'
      else if (currentOffset > 70) state = Math.random() > 0.5 ? 'InProgress' : 'Pending'
      
      tasks.push({
        id: `task_${taskId++}`,
        caseName: caseNames[caseIdx],
        caseCode: caseNames[caseIdx].split(' ')[0],
        runnerId: runner,
        state,
        startOffset: currentOffset,
        duration,
      })
      
      currentOffset += duration + Math.floor(Math.random() * 2)
    }
  })
  
  return tasks
}

const MOCK_TASKS = generateMockTasks()

function getStateColor(state: string) {
  switch (state) {
    case 'Passed': return 'bg-emerald-500'
    case 'Healed': return 'bg-amber-500'
    case 'Failed': return 'bg-red-500'
    case 'InProgress': return 'bg-blue-500 animate-pulse'
    case 'Pending': return 'bg-zinc-400'
    default: return 'bg-zinc-500'
  }
}

export default function LiveTimelinePage() {
  const params = useParams()
  const runId = params.id as string
  
  const [zoom, setZoom] = React.useState(1)
  const runners = Array.from(new Set(MOCK_TASKS.map(t => t.runnerId)))
  const maxOffset = Math.max(...MOCK_TASKS.map(t => t.startOffset + t.duration))
  const totalWidth = maxOffset * 8 * zoom // 8px per minute

  // Generate time markers
  const timeMarkers = []
  for (let i = 0; i <= maxOffset; i += 15) {
    const hours = Math.floor(i / 60)
    const mins = i % 60
    timeMarkers.push({
      offset: i,
      label: `${hours}:${mins.toString().padStart(2, '0')}`
    })
  }

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-2">
              <Link href={`/execution-console/runs/${runId}`} className="hover:underline flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Run Detail
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Live Timeline</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title">Live Timeline</h1>
                <p className="page-description mt-1">
                  Visual Gantt view of case executions across {runners.length} runners
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                  disabled={zoom >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-sm text-muted-foreground">Healed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm text-muted-foreground">Failed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-zinc-400" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          <div className="flex">
            {/* Runner Labels (Fixed) */}
            <div className="sticky left-0 z-10 bg-background border-r">
              <div className="h-8 border-b flex items-center px-3 bg-muted/50">
                <span className="text-sm font-medium">Runner</span>
              </div>
              {runners.map((runner) => (
                <div
                  key={runner}
                  className="h-12 border-b flex items-center px-3 bg-background"
                >
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm">{runner}</code>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Grid */}
            <div className="flex-1" style={{ minWidth: `${totalWidth}px` }}>
              {/* Time markers */}
              <div className="h-8 border-b relative bg-muted/50">
                {timeMarkers.map((marker) => (
                  <div
                    key={marker.offset}
                    className="absolute top-0 h-full flex items-center"
                    style={{ left: `${marker.offset * 8 * zoom}px` }}
                  >
                    <div className="border-l border-border h-full" />
                    <span className="text-xs text-muted-foreground ml-1">{marker.label}</span>
                  </div>
                ))}
              </div>

              {/* Runner rows */}
              <TooltipProvider>
                {runners.map((runner) => {
                  const runnerTasks = MOCK_TASKS.filter(t => t.runnerId === runner)
                  return (
                    <div key={runner} className="h-12 border-b relative">
                      {/* Grid lines */}
                      {timeMarkers.map((marker) => (
                        <div
                          key={marker.offset}
                          className="absolute top-0 h-full border-l border-border/50"
                          style={{ left: `${marker.offset * 8 * zoom}px` }}
                        />
                      ))}
                      
                      {/* Tasks */}
                      {runnerTasks.map((task) => (
                        <Tooltip key={task.id}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/execution-console/runs/${runId}/cases/${task.id}`}
                              className={cn(
                                "absolute top-1.5 h-9 rounded px-2 flex items-center cursor-pointer transition-opacity hover:opacity-80",
                                getStateColor(task.state)
                              )}
                              style={{
                                left: `${task.startOffset * 8 * zoom}px`,
                                width: `${Math.max(task.duration * 8 * zoom - 2, 24)}px`
                              }}
                            >
                              <span className="text-xs text-white truncate font-medium">
                                {task.caseCode}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{task.caseName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="h-5">{task.state}</Badge>
                                <span>{task.duration} min</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  )
                })}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
