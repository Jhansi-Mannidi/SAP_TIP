'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  User,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  MoreHorizontal,
  Calendar,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { MOCK_HUMAN_TASKS, type HumanTask } from '@/lib/execution-mock-data'

const TASK_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  sign_off: { label: 'Sign Off', icon: ClipboardCheck },
  accept_deviation: { label: 'Accept Deviation', icon: AlertTriangle },
  approval_gate: { label: 'Approval Gate', icon: CheckCircle2 },
  manual_review: { label: 'Manual Review', icon: FileText },
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m ago`
  const hours = Math.floor(diffMins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function formatDueDate(dateStr?: string): { text: string; isOverdue: boolean; isUrgent: boolean } {
  if (!dateStr) return { text: '-', isOverdue: false, isUrgent: false }
  const due = new Date(dateStr)
  const now = new Date()
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (diffHours < 0) {
    return { text: 'Overdue', isOverdue: true, isUrgent: false }
  } else if (diffHours < 4) {
    return { text: `Due in ${Math.ceil(diffHours)}h`, isOverdue: false, isUrgent: true }
  } else if (diffHours < 24) {
    return { text: `Due in ${Math.ceil(diffHours)}h`, isOverdue: false, isUrgent: false }
  } else {
    return { text: `Due ${due.toLocaleDateString()}`, isOverdue: false, isUrgent: false }
  }
}

export default function MyTasksPage() {
  const tasks = MOCK_HUMAN_TASKS
  const [markDialogOpen, setMarkDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<HumanTask | null>(null)
  const [markAction, setMarkAction] = React.useState<'pass' | 'fail'>('pass')
  const [rationale, setRationale] = React.useState('')

  const todoTasks = tasks.filter(t => t.state === 'ToDo')
  const inProgressTasks = tasks.filter(t => t.state === 'InProgress')

  const handleMark = (task: HumanTask, action: 'pass' | 'fail') => {
    setSelectedTask(task)
    setMarkAction(action)
    setRationale('')
    setMarkDialogOpen(true)
  }

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">My Tasks</h1>
                <p className="page-description mt-1">
                  Tasks assigned to you requiring human action.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {todoTasks.length} To Do
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {inProgressTasks.length} In Progress
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
                  <TableHead>Scenario</TableHead>
                  <TableHead>Suite / Execution</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No tasks assigned to you
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => {
                    const taskConfig = TASK_TYPE_LABELS[task.task_type] || { label: task.task_type, icon: FileText }
                    const TaskIcon = taskConfig.icon
                    const dueInfo = formatDueDate(task.due_at)
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <span className="font-medium">{task.name}</span>
                        </TableCell>
                        <TableCell>
                          <Link 
                            href={`/test-repository/scenarios/${task.scenario.id}`}
                            className="hover:underline text-sm"
                          >
                            {task.scenario.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <Link 
                              href={`/execution-console/runs/${task.suite.execution_id}`}
                              className="hover:underline text-sm font-medium"
                            >
                              {task.suite.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              Run: {task.suite.execution_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <TaskIcon className="h-3 w-3" />
                            {taskConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={task.state === 'InProgress' ? 'default' : 'outline'}
                            className={cn(
                              task.state === 'InProgress' && 'bg-blue-500'
                            )}
                          >
                            {task.state}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTimeAgo(task.assigned_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-sm",
                            dueInfo.isOverdue && "text-red-600 dark:text-red-400 font-medium",
                            dueInfo.isUrgent && "text-amber-600 dark:text-amber-400 font-medium"
                          )}>
                            {dueInfo.text}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {task.state === 'ToDo' && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3.5 w-3.5 mr-1" />
                                Pick Up
                              </Button>
                            )}
                            {task.state === 'InProgress' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-emerald-600"
                                  onClick={() => handleMark(task, 'pass')}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => handleMark(task, 'fail')}
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Play className="h-4 w-4 mr-2" />
                                  Open Replay
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleMark(task, 'pass')}>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark Pass
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMark(task, 'fail')}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Mark Fail
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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

      {/* Mark Pass/Fail Dialog */}
      <Dialog open={markDialogOpen} onOpenChange={setMarkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {markAction === 'pass' ? 'Mark Task as Pass' : 'Mark Task as Fail'}
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rationale">
                Rationale {markAction === 'fail' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="rationale"
                placeholder={markAction === 'pass' 
                  ? "Optional: Add any notes about this task..."
                  : "Required: Explain why this task failed..."
                }
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => setMarkDialogOpen(false)}
              disabled={markAction === 'fail' && !rationale.trim()}
              className={markAction === 'pass' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {markAction === 'pass' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Pass
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Fail
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
