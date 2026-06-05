'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Calendar,
  Clock,
  Play,
  RefreshCw,
  Truck,
  User,
  Timer,
  MoreHorizontal,
  X,
  CalendarClock,
  Layers,
  GitBranch,
  Zap,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { MOCK_SCHEDULED_RUNS, type ScheduledRun, type SuiteKind, type TriggerType } from '@/lib/execution-mock-data'

const SUITE_KIND_COLORS: Record<SuiteKind, string> = {
  regression: 'bg-blue-500',
  cutover: 'bg-violet-500',
  smoke: 'bg-emerald-500',
  hypercare: 'bg-rose-500',
}

const SUITE_KIND_LABELS: Record<SuiteKind, string> = {
  regression: 'Regression',
  cutover: 'Cutover',
  smoke: 'Smoke',
  hypercare: 'Hypercare',
}

const TRIGGER_LABELS: Record<TriggerType, { label: string; icon: React.ElementType }> = {
  manual: { label: 'Manual', icon: User },
  scheduled: { label: 'Scheduled', icon: Clock },
  on_transport_release: { label: 'On Transport', icon: Truck },
  on_phase_gate: { label: 'On Phase Gate', icon: GitBranch },
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
}

function getHourFromDate(dateStr: string): number {
  return new Date(dateStr).getHours()
}

// Generate 24 hour slots for timeline
function generateHourSlots() {
  const slots = []
  const now = new Date()
  const currentHour = now.getHours()
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24
    const isNextDay = currentHour + i >= 24
    slots.push({ hour, isNextDay })
  }
  return slots
}

export default function TodaysSchedulePage() {
  const scheduledRuns = MOCK_SCHEDULED_RUNS
  const hourSlots = generateHourSlots()

  // Group runs by hour for timeline
  const runsByHour = scheduledRuns.reduce((acc, run) => {
    const hour = getHourFromDate(run.scheduled_at)
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(run)
    return acc
  }, {} as Record<number, ScheduledRun[]>)

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">Today&apos;s Schedule</h1>
                <p className="page-description mt-1">
                  Scheduled Test Suite executions for the next 24 hours.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Schedule Run
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {Object.entries(SUITE_KIND_COLORS).map(([kind, color]) => (
                <div key={kind} className="flex items-center gap-2 text-sm">
                  <div className={cn("w-3 h-3 rounded", color)} />
                  <span className="text-muted-foreground">{SUITE_KIND_LABELS[kind as SuiteKind]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Timeline View */}
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              24-Hour Timeline
            </h2>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Hour labels */}
                <div className="flex border-b">
                  {hourSlots.slice(0, 12).map(({ hour, isNextDay }) => (
                    <div 
                      key={`${hour}-${isNextDay}`}
                      className="flex-1 text-center text-xs text-muted-foreground py-1 border-r last:border-r-0"
                    >
                      {hour.toString().padStart(2, '0')}:00
                      {isNextDay && <span className="text-[10px] ml-0.5">+1</span>}
                    </div>
                  ))}
                </div>
                {/* Timeline bars */}
                <div className="flex h-16 relative">
                  {hourSlots.slice(0, 12).map(({ hour }) => (
                    <div 
                      key={hour} 
                      className="flex-1 border-r last:border-r-0 bg-muted/30 relative"
                    >
                      {runsByHour[hour]?.map((run, idx) => (
                        <div
                          key={run.id}
                          className={cn(
                            "absolute left-1 right-1 rounded px-2 py-1 text-xs text-white truncate cursor-pointer hover:opacity-80",
                            SUITE_KIND_COLORS[run.suite.kind]
                          )}
                          style={{ 
                            top: `${idx * 28 + 4}px`,
                            width: `calc(${Math.min(run.estimated_duration_mins / 60, 4) * 100}% - 8px)`
                          }}
                          title={`${run.suite.name} - ${formatDuration(run.estimated_duration_mins)}`}
                        >
                          {run.suite.code}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="p-4 md:p-6">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Scheduled Runs ({scheduledRuns.length})
            </h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scheduled At</TableHead>
                    <TableHead>Suite</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Target System</TableHead>
                    <TableHead>Runner Pool</TableHead>
                    <TableHead>Est. Duration</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledRuns.map((run) => {
                    const TriggerIcon = TRIGGER_LABELS[run.trigger_type].icon
                    return (
                      <TableRow key={run.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatTime(run.scheduled_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", SUITE_KIND_COLORS[run.suite.kind])} />
                            <Link 
                              href={`/test-repository/suites/${run.suite.id}`}
                              className="font-medium hover:underline"
                            >
                              {run.suite.name}
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {run.suite.code}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <TriggerIcon className="h-3 w-3" />
                            {TRIGGER_LABELS[run.trigger_type].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {run.triggered_by_user || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {run.target_system.sid}:{run.target_system.client}
                          </Badge>
                        </TableCell>
                        <TableCell>{run.runner_pool}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Timer className="h-3.5 w-3.5" />
                            {formatDuration(run.estimated_duration_mins)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Run Now
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reschedule
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
