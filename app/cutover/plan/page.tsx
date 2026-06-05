'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  Users,
  Bot,
  Timer,
  Milestone,
  Download,
  Filter,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

import { MOCK_ACTIVE_WINDOW, type CutoverTask, type CutoverPhase } from '@/lib/cutover-mock-data'

const statusConfig = {
  'Completed': { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500' },
  'In Progress': { icon: Play, color: 'text-blue-500', bg: 'bg-blue-500' },
  'Failed': { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500' },
  'Blocked': { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500' },
  'Not Started': { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-300' },
  'Skipped': { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-300' },
}

function PhaseSection({ phase, tasks }: { phase: CutoverPhase; tasks: CutoverTask[] }) {
  const [expanded, setExpanded] = React.useState(true)
  
  const completed = tasks.filter(t => t.status === 'Completed').length
  const failed = tasks.filter(t => t.status === 'Failed').length
  const blocked = tasks.filter(t => t.status === 'Blocked').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const progress = Math.round((completed / tasks.length) * 100)
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <h3 className="font-semibold">{phase}</h3>
          <Badge variant="secondary">{tasks.length} tasks</Badge>
          {inProgress > 0 && (
            <Badge className="bg-blue-500">{inProgress} running</Badge>
          )}
          {failed > 0 && (
            <Badge variant="destructive">{failed} failed</Badge>
          )}
          {blocked > 0 && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">{blocked} blocked</Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{completed}/{tasks.length}</span>
          <Progress value={progress} className="w-24 h-2" />
        </div>
      </button>
      
      {expanded && (
        <div className="divide-y">
          {tasks.map((task) => {
            const config = statusConfig[task.status]
            const StatusIcon = config.icon
            
            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-4 p-4',
                  task.is_critical_path && 'border-l-4 border-l-red-500',
                  task.status === 'In Progress' && 'bg-blue-50',
                  task.status === 'Failed' && 'bg-red-50',
                  task.status === 'Blocked' && 'bg-amber-50',
                )}
              >
                <div className={cn('p-1.5 rounded-full', config.bg + '/20')}>
                  <StatusIcon className={cn('h-4 w-4', config.color)} />
                </div>
                
                <div className="w-12 text-center">
                  <span className="text-xs font-mono text-muted-foreground">#{task.order}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{task.name}</span>
                    {task.is_milestone && (
                      <Milestone className="h-3.5 w-3.5 text-violet-500" />
                    )}
                    {task.is_critical_path && (
                      <Badge variant="outline" className="text-[10px] text-red-600 border-red-200">CP</Badge>
                    )}
                  </div>
                  <p className="caption-text truncate">{task.description}</p>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground w-32">
                  {task.assignee.type === 'agent' ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <Users className="h-3 w-3" />
                  )}
                  <span className="truncate">{task.assignee.name}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground w-16">
                  <Timer className="h-3 w-3" />
                  <span>{task.duration_mins}m</span>
                </div>
                
                <Badge variant="secondary" className={cn('w-24 justify-center', config.color)}>
                  {task.status}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CutoverPlanPage() {
  const window = MOCK_ACTIVE_WINDOW
  
  // Group tasks by phase
  const tasksByPhase = window.tasks.reduce((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = []
    acc[task.phase].push(task)
    return acc
  }, {} as Record<CutoverPhase, CutoverTask[]>)
  
  const phases: CutoverPhase[] = ['Pre-Cutover', 'Cutover', 'Post-Cutover', 'Hypercare']
  
  return (
    <AppShell currentApp="cutover-command">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Cutover Plan</h1>
              <p className="page-description mt-1">{window.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Summary Stats */}
          <StaggerGrid columns="grid-cols-2 md:grid-cols-5" className="gap-4" fast>
            <Card>
              <CardContent>
                <p className="stat-value">{window.total_tasks}</p>
                <p className="caption-text">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-emerald-600">{window.completed_tasks}</p>
                <p className="caption-text">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-blue-600">
                  {window.tasks.filter(t => t.status === 'In Progress').length}
                </p>
                <p className="caption-text">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-red-600">{window.failed_tasks}</p>
                <p className="caption-text">Failed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-amber-600">{window.blocked_tasks}</p>
                <p className="caption-text">Blocked</p>
              </CardContent>
            </Card>
          </StaggerGrid>
          
          {/* Plan Sections */}
          <div className="space-y-4">
            {phases.map((phase) => {
              const tasks = tasksByPhase[phase]
              if (!tasks || tasks.length === 0) return null
              
              return <PhaseSection key={phase} phase={phase} tasks={tasks} />
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
