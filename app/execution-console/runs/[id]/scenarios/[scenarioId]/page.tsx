'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Play, 
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Server,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Bot,
  User,
  Bug,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { cn } from '@/lib/utils'

import { MOCK_CASE_EXECUTIONS, type CaseExecution } from '@/lib/execution-mock-data'

function formatDuration(secs?: number): string {
  if (!secs) return '-'
  if (secs < 60) return `${secs}s`
  const mins = Math.floor(secs / 60)
  const remainingSecs = secs % 60
  return `${mins}m ${remainingSecs}s`
}

function getStateConfig(state: string) {
  switch (state) {
    case 'Passed':
      return { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
    case 'Healed':
      return { icon: Sparkles, color: 'text-amber-500', bgColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
    case 'Failed':
    case 'Defected':
      return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    case 'ToDo':
      return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' }
    case 'InProgress':
      return { icon: Play, color: 'text-blue-500', bgColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
    default:
      return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }
}

export default function ScenarioDetailPage() {
  const params = useParams()
  const runId = params.id as string
  const scenarioId = params.scenarioId as string

  const cases = MOCK_CASE_EXECUTIONS

  // Calculate counts
  const counts = {
    pass: cases.filter(c => c.state === 'Passed').length,
    healed: cases.filter(c => c.state === 'Healed').length,
    fail: cases.filter(c => c.state === 'Failed' || c.state === 'Defected').length,
    todo: cases.filter(c => c.state === 'ToDo' || c.state === 'InProgress').length,
  }

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/execution-console" className="hover:underline">Active Runs</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/execution-console/runs/${runId}`} className="hover:underline">SC_CUTOVER_VAL</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Scenario</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">OTC Happy Path Domestic</h1>
                  <Badge variant="outline">OTC_HAPPY_DOM</Badge>
                  <Badge className="bg-emerald-500">Completed</Badge>
                </div>
                
                {/* Case Rollup */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-emerald-600">{counts.pass}</span>
                    <span className="text-sm text-muted-foreground">Pass</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-amber-600">{counts.healed}</span>
                    <span className="text-sm text-muted-foreground">Healed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-600">{counts.fail}</span>
                    <span className="text-sm text-muted-foreground">Fail</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{counts.todo}</span>
                    <span className="text-sm text-muted-foreground">ToDo</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Sign Off Scenario
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Failed
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Replay
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Task Type</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Runner</TableHead>
                  <TableHead>Healings</TableHead>
                  <TableHead>Defect</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseExec) => {
                  const stateConfig = getStateConfig(caseExec.state)
                  const StateIcon = stateConfig.icon

                  return (
                    <TableRow key={caseExec.id}>
                      <TableCell>
                        <div>
                          <span className="font-medium">{caseExec.case.name}</span>
                          <p className="caption-text">{caseExec.case.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {caseExec.task_type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {caseExec.assignee_class === 'agent' ? (
                          <AgentTaskIndicator 
                            agentName={caseExec.assignee?.name || 'Agent'}
                            status={caseExec.state === 'InProgress' ? 'running' : 'completed'}
                            size="sm"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {caseExec.assignee?.name?.split('.').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-sm">{caseExec.assignee?.name}</span>
                              {caseExec.assignee?.role && (
                                <p className="caption-text">{caseExec.assignee.role}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={stateConfig.bgColor}>
                          <StateIcon className="h-3 w-3 mr-1" />
                          {caseExec.state}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {caseExec.started_at && (
                            <div className="text-muted-foreground">
                              {new Date(caseExec.started_at).toLocaleTimeString()}
                            </div>
                          )}
                          {caseExec.duration_secs && (
                            <div className="text-xs text-muted-foreground">
                              {formatDuration(caseExec.duration_secs)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {caseExec.runner_id ? (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {caseExec.runner_id}
                          </code>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {caseExec.healing_event_count > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            {caseExec.healing_event_count}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {caseExec.defect_id ? (
                          <Link 
                            href={`/defect-manager/${caseExec.defect_id}`}
                            className="flex items-center gap-1 text-red-600 hover:underline"
                          >
                            <Bug className="h-3.5 w-3.5" />
                            {caseExec.defect_id}
                          </Link>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/execution-console/runs/${runId}/cases/${caseExec.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
