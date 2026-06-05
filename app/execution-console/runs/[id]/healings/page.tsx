'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Eye,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
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
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { cn } from '@/lib/utils'

import { MOCK_RUN_HEALINGS, type RunHealingEvent } from '@/lib/execution-mock-data'

function getOutcomeConfig(outcome: string) {
  switch (outcome) {
    case 'Repaired Successfully':
      return { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
    case 'Repair Failed':
      return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    case 'Unrepairable':
      return { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
    case 'Repair Deferred':
      return { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
    default:
      return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }
}

export default function HealingsPage() {
  const params = useParams()
  const runId = params.id as string
  
  const healings = MOCK_RUN_HEALINGS

  // Stats
  const successCount = healings.filter(h => h.outcome === 'Repaired Successfully').length
  const failedCount = healings.filter(h => h.outcome === 'Repair Failed').length
  const deferredCount = healings.filter(h => h.outcome === 'Repair Deferred').length

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href={`/execution-console/runs/${runId}`} className="hover:underline flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Run Detail
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Healings</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                  Healing Events
                </h1>
                <p className="page-description mt-1">
                  {healings.length} healing events during this run
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {successCount} Successful
                </Badge>
                <Badge variant="secondary" className="gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <XCircle className="h-3 w-3" />
                  {failedCount} Failed
                </Badge>
                <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Clock className="h-3 w-3" />
                  {deferredCount} Deferred
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Healings Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Originating Case</TableHead>
                  <TableHead>Failure Class</TableHead>
                  <TableHead>Repair Strategy</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Occurred</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healings.map((healing) => {
                  const outcomeConfig = getOutcomeConfig(healing.outcome)
                  const OutcomeIcon = outcomeConfig.icon
                  
                  return (
                    <TableRow key={healing.id}>
                      <TableCell>
                        <Link 
                          href={`/execution-console/runs/${runId}/cases/${healing.case.execution_id}`}
                          className="font-medium hover:underline"
                        >
                          {healing.case.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{healing.failure_class}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-0.5 rounded">
                          {healing.repair_strategy}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                healing.confidence > 0.8 ? "bg-emerald-500" :
                                healing.confidence > 0.6 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${healing.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(healing.confidence * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={outcomeConfig.bgColor}>
                          <OutcomeIcon className="h-3 w-3 mr-1" />
                          {healing.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AgentTaskIndicator 
                          agentName={healing.agent.name}
                          status="completed"
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(healing.occurred_at).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/execution-console/runs/${runId}/cases/${healing.case.execution_id}`}>
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Open Case
                            </Link>
                          </Button>
                          {!healing.promoted && healing.outcome === 'Repaired Successfully' && (
                            <Button variant="outline" size="sm">
                              <Zap className="h-3.5 w-3.5 mr-1" />
                              Promote
                            </Button>
                          )}
                          {healing.promoted && (
                            <Badge variant="secondary" className="text-xs">
                              Promoted
                            </Badge>
                          )}
                        </div>
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
