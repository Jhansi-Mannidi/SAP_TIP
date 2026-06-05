'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Calendar,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Users,
  Bot,
  Flag,
  Plus,
  MoreHorizontal,
  Timer,
  ArrowRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// Mock Cutover Tasks
const CUTOVER_PHASES = [
  {
    id: 'phase_1',
    name: 'Pre-Cutover Preparation',
    status: 'Completed',
    progress: 100,
    start: '2026-05-01T18:00',
    end: '2026-05-02T06:00',
    tasks: [
      { id: 't1', name: 'Freeze source system changes', status: 'Completed', assignee: 'P.Sharma', assignee_type: 'human', duration: 30, actual: 25 },
      { id: 't2', name: 'Create system backup snapshot', status: 'Completed', assignee: 'Executor Agent', assignee_type: 'agent', duration: 60, actual: 55 },
      { id: 't3', name: 'Validate backup integrity', status: 'Completed', assignee: 'Executor Agent', assignee_type: 'agent', duration: 30, actual: 28 },
      { id: 't4', name: 'Notify stakeholders', status: 'Completed', assignee: 'J.Rao', assignee_type: 'human', duration: 15, actual: 12 },
    ]
  },
  {
    id: 'phase_2',
    name: 'Data Migration',
    status: 'In Progress',
    progress: 65,
    start: '2026-05-02T06:00',
    end: '2026-05-02T18:00',
    tasks: [
      { id: 't5', name: 'Extract Customer Masters from ECC', status: 'Completed', assignee: 'Executor Agent', assignee_type: 'agent', duration: 120, actual: 115 },
      { id: 't6', name: 'Extract Vendor Masters from ECC', status: 'Completed', assignee: 'Executor Agent', assignee_type: 'agent', duration: 90, actual: 88 },
      { id: 't7', name: 'Transform BP data for S/4', status: 'Completed', assignee: 'Executor Agent', assignee_type: 'agent', duration: 60, actual: 62 },
      { id: 't8', name: 'Load Business Partners to S/4', status: 'In Progress', assignee: 'Executor Agent', assignee_type: 'agent', duration: 90, actual: null },
      { id: 't9', name: 'Validate BP load counts', status: 'Pending', assignee: 'Executor Agent', assignee_type: 'agent', duration: 30, actual: null },
      { id: 't10', name: 'Data migration sign-off', status: 'Pending', assignee: 'Data Lead', assignee_type: 'human', duration: 30, actual: null },
    ]
  },
  {
    id: 'phase_3',
    name: 'Functional Verification',
    status: 'Pending',
    progress: 0,
    start: '2026-05-02T18:00',
    end: '2026-05-03T06:00',
    tasks: [
      { id: 't11', name: 'Execute OTC Happy Path', status: 'Pending', assignee: 'Executor Agent', assignee_type: 'agent', duration: 45, actual: null },
      { id: 't12', name: 'Execute PTP Happy Path', status: 'Pending', assignee: 'Executor Agent', assignee_type: 'agent', duration: 40, actual: null },
      { id: 't13', name: 'Execute RTR Close Cycle', status: 'Pending', assignee: 'Executor Agent', assignee_type: 'agent', duration: 35, actual: null },
      { id: 't14', name: 'Verify interface connectivity', status: 'Pending', assignee: 'M.Reddy', assignee_type: 'human', duration: 60, actual: null },
      { id: 't15', name: 'Functional testing sign-off', status: 'Pending', assignee: 'QA Lead', assignee_type: 'human', duration: 30, actual: null },
    ]
  },
  {
    id: 'phase_4',
    name: 'Go-Live',
    status: 'Pending',
    progress: 0,
    start: '2026-05-03T06:00',
    end: '2026-05-03T08:00',
    tasks: [
      { id: 't16', name: 'Enable production users', status: 'Pending', assignee: 'S.Kumar', assignee_type: 'human', duration: 30, actual: null },
      { id: 't17', name: 'Open system for business', status: 'Pending', assignee: 'P.Sharma', assignee_type: 'human', duration: 15, actual: null },
      { id: 't18', name: 'Business go-live sign-off', status: 'Pending', assignee: 'Business Owner', assignee_type: 'human', duration: 30, actual: null },
      { id: 't19', name: 'Create post-go-live snapshot', status: 'Pending', assignee: 'Executor Agent', assignee_type: 'agent', duration: 30, actual: null },
    ]
  },
]

const statusConfig = {
  Completed: { color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-500/10', icon: CheckCircle2 },
  'In Progress': { color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500/10', icon: Play },
  Pending: { color: 'bg-muted', textColor: 'text-muted-foreground', bgColor: 'bg-muted/50', icon: Clock },
  Blocked: { color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-500/10', icon: AlertCircle },
}

export default function CutoverPlanPage() {
  const [expandedPhases, setExpandedPhases] = React.useState<string[]>(['phase_2'])
  
  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    )
  }

  const totalTasks = CUTOVER_PHASES.flatMap(p => p.tasks).length
  const completedTasks = CUTOVER_PHASES.flatMap(p => p.tasks).filter(t => t.status === 'Completed').length
  const inProgressTasks = CUTOVER_PHASES.flatMap(p => p.tasks).filter(t => t.status === 'In Progress').length
  const overallProgress = Math.round((completedTasks / totalTasks) * 100)

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">Cutover Plan</h1>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Play className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <p className="page-description mt-1">
                  Star Cement S/4HANA Migration - Go-Live Cutover
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline View
                </Button>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Resume Execution
                </Button>
              </div>
            </div>
            
            {/* Overall Progress */}
            <Card className="mt-4">
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-3xl font-bold">{overallProgress}%</p>
                      <p className="page-description">Overall Progress</p>
                    </div>
                    <div className="h-12 w-px bg-border hidden md:block" />
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{completedTasks}</p>
                        <p className="caption-text">Completed</p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">{inProgressTasks}</p>
                        <p className="caption-text">In Progress</p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-muted-foreground">{totalTasks - completedTasks - inProgressTasks}</p>
                        <p className="caption-text">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Started: May 1, 18:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                      <span>Target: May 3, 08:00</span>
                    </div>
                  </div>
                </div>
                <Progress value={overallProgress} className="mt-4 h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Phases */}
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
          {CUTOVER_PHASES.map((phase, index) => {
            const isExpanded = expandedPhases.includes(phase.id)
            const StatusIcon = statusConfig[phase.status as keyof typeof statusConfig].icon
            
            return (
              <Card key={phase.id} className={cn(
                'overflow-hidden',
                phase.status === 'In Progress' && 'ring-2 ring-blue-500/50'
              )}>
                <div 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => togglePhase(phase.id)}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    statusConfig[phase.status as keyof typeof statusConfig].bgColor,
                    statusConfig[phase.status as keyof typeof statusConfig].textColor
                  )}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{phase.name}</h3>
                      <Badge 
                        variant="outline"
                        className={cn(
                          'gap-1',
                          statusConfig[phase.status as keyof typeof statusConfig].bgColor,
                          statusConfig[phase.status as keyof typeof statusConfig].textColor
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="section-description mt-0.5">
                      {phase.tasks.length} tasks | {new Date(phase.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(phase.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t bg-muted/30">
                    <div className="divide-y">
                      {phase.tasks.map((task) => {
                        const TaskStatusIcon = statusConfig[task.status as keyof typeof statusConfig].icon
                        
                        return (
                          <div key={task.id} className="flex items-center gap-4 p-4 pl-16">
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                              statusConfig[task.status as keyof typeof statusConfig].bgColor
                            )}>
                              <TaskStatusIcon className={cn(
                                'h-3.5 w-3.5',
                                statusConfig[task.status as keyof typeof statusConfig].textColor
                              )} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{task.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {task.assignee_type === 'agent' ? (
                                  <Badge variant="secondary" className="gap-1 text-xs">
                                    <Bot className="h-3 w-3" />
                                    {task.assignee}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1 text-xs">
                                    <Users className="h-3 w-3" />
                                    {task.assignee}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Timer className="h-3.5 w-3.5" />
                                <span>{task.actual ?? task.duration}m</span>
                                {task.actual && task.actual !== task.duration && (
                                  <span className={cn(
                                    'text-xs',
                                    task.actual < task.duration ? 'text-emerald-500' : 'text-amber-500'
                                  )}>
                                    ({task.actual < task.duration ? '-' : '+'}{Math.abs(task.duration - task.actual)}m)
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {task.status === 'In Progress' && (
                              <Button size="sm" variant="outline" className="gap-1">
                                <Pause className="h-3 w-3" />
                                Pause
                              </Button>
                            )}
                            {task.status === 'Pending' && (
                              <Button size="sm" variant="ghost" className="gap-1">
                                <Play className="h-3 w-3" />
                                Start
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
