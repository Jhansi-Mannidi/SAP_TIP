'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Bot,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  MoreHorizontal,
  RefreshCw,
  Eye,
  AlertTriangle,
  Zap,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { cn } from '@/lib/utils'

import { MOCK_AGENT_TASKS, type AgentTask } from '@/lib/execution-mock-data'

function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const hours = Math.floor(diffMins / 60)
  return `${hours}h ago`
}

function getOutcomeDisplay(outcome?: string): { icon: React.ElementType; color: string; label: string } | null {
  if (!outcome) return null
  switch (outcome) {
    case 'success':
      return { icon: CheckCircle2, color: 'text-emerald-500', label: 'Success' }
    case 'healed':
      return { icon: Sparkles, color: 'text-amber-500', label: 'Healed' }
    case 'failed':
      return { icon: XCircle, color: 'text-red-500', label: 'Failed' }
    default:
      return null
  }
}

export default function MyAgentsPage() {
  const tasks = MOCK_AGENT_TASKS

  const completedTasks = tasks.filter(t => t.state === 'Completed')
  const inProgressTasks = tasks.filter(t => t.state === 'InProgress')
  const todoTasks = tasks.filter(t => t.state === 'ToDo')

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">My Agents</h1>
                <p className="page-description mt-1">
                  Tasks assigned to agents that you supervise.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm gap-1">
                  <Clock className="h-3 w-3" />
                  {todoTasks.length} Queued
                </Badge>
                <Badge className="text-sm bg-blue-500 gap-1">
                  <Zap className="h-3 w-3" />
                  {inProgressTasks.length} Running
                </Badge>
                <Badge variant="secondary" className="text-sm gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {completedTasks.length} Done
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Scenario / Suite</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No agent tasks to display
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => {
                    const outcomeDisplay = getOutcomeDisplay(task.outcome)
                    const OutcomeIcon = outcomeDisplay?.icon
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <span className="font-medium">{task.name}</span>
                        </TableCell>
                        <TableCell>
                          <AgentTaskIndicator 
                            agentName={task.agent.name}
                            status={task.state === 'InProgress' ? 'running' : task.state === 'Completed' ? 'completed' : 'pending'}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <Link 
                              href={`/test-repository/scenarios/${task.scenario.id}`}
                              className="hover:underline text-sm"
                            >
                              {task.scenario.name}
                            </Link>
                            <Link 
                              href={`/execution-console/runs/${task.suite.execution_id}`}
                              className="text-xs text-muted-foreground hover:underline"
                            >
                              {task.suite.name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {task.task_type.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.state === 'InProgress' ? 'default' : task.state === 'Completed' ? 'secondary' : 'outline'}
                            className={cn(
                              task.state === 'InProgress' && 'bg-blue-500 animate-pulse'
                            )}
                          >
                            {task.state}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.confidence ? (
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={task.confidence * 100} 
                                className="h-1.5 w-16"
                              />
                              <span className="text-sm text-muted-foreground">
                                {Math.round(task.confidence * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {outcomeDisplay && OutcomeIcon ? (
                            <div className={cn("flex items-center gap-1.5", outcomeDisplay.color)}>
                              <OutcomeIcon className="h-4 w-4" />
                              <span className="text-sm">{outcomeDisplay.label}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {task.started_at && (
                              <div>Started {formatTimeAgo(task.started_at)}</div>
                            )}
                            {task.completed_at && (
                              <div>Completed {formatTimeAgo(task.completed_at)}</div>
                            )}
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
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {task.state === 'Completed' && task.outcome !== 'success' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Retry
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Override: Mark Pass
                                  </DropdownMenuItem>
                                </>
                              )}
                              {task.outcome === 'healed' && (
                                <DropdownMenuItem>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  View Healing Details
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
