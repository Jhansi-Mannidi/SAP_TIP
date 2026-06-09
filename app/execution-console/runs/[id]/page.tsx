'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Play, 
  Pause,
  Square,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Server,
  Layers,
  Activity,
  FileText,
  Zap,
  Bug,
  ClipboardCheck,
  History,
  Eye,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { 
  MOCK_SUITE_EXECUTION, 
  MOCK_SCENARIO_EXECUTIONS,
  MOCK_RUN_HEALINGS,
  type ScenarioExecution 
} from '@/lib/execution-mock-data'

function formatTime(mins: number): string {
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function ScenarioCard({ scenario }: { scenario: ScenarioExecution }) {
  const total = scenario.case_counts.pass + scenario.case_counts.healed + scenario.case_counts.fail + scenario.case_counts.todo
  const done = scenario.case_counts.pass + scenario.case_counts.healed + scenario.case_counts.fail
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0
  
  return (
    <Link 
      href={`/execution-console/runs/run_1/scenarios/${scenario.id}`}
      className="block"
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{scenario.scenario.name}</h4>
              <p className="caption-text">{scenario.scenario.code}</p>
            </div>
            <Badge 
              variant={scenario.state === 'Completed' ? 'secondary' : scenario.state === 'InProgress' ? 'default' : 'outline'}
              className={cn(
                "shrink-0 text-xs",
                scenario.state === 'InProgress' && 'bg-blue-500 animate-pulse'
              )}
            >
              {scenario.state}
            </Badge>
          </div>
          
          {/* Mini case rollup */}
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" />
              {scenario.case_counts.pass}
            </span>
            <span className="text-amber-600 flex items-center gap-0.5">
              <Sparkles className="h-3 w-3" />
              {scenario.case_counts.healed}
            </span>
            <span className="text-red-600 flex items-center gap-0.5">
              <XCircle className="h-3 w-3" />
              {scenario.case_counts.fail}
            </span>
            <span className="text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {scenario.case_counts.todo}
            </span>
          </div>

          {/* Progress */}
          <Progress value={progressPct} className="h-1" />
          
          {/* Duration */}
          {scenario.duration_mins && (
            <p className="caption-text mt-2">
              {formatTime(scenario.duration_mins)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function RunDetailPage() {
  const params = useParams()
  const runId = params.id as string
  const execution = MOCK_SUITE_EXECUTION
  const scenarios = MOCK_SCENARIO_EXECUTIONS
  const healings = MOCK_RUN_HEALINGS

  // Calculate progress bar segments
  const total = execution.case_counts.total
  const passWidth = (execution.case_counts.pass / total) * 100
  const healedWidth = (execution.case_counts.healed / total) * 100
  const failWidth = (execution.case_counts.fail / total) * 100
  const todoWidth = (execution.case_counts.todo / total) * 100

  // Recent events feed
  const recentEvents = [
    { type: 'healing', message: 'Healing event on VA01_ATP', time: '2m ago' },
    { type: 'completion', message: 'OTC_HAPPY_DOM completed', time: '5m ago' },
    { type: 'completion', message: 'OTC_CREDIT completed', time: '8m ago' },
    { type: 'healing', message: 'Healing event on ME21N_CREATE', time: '12m ago' },
    { type: 'signoff', message: 'PTP_STD signed off by J.Rao', time: '15m ago' },
    { type: 'completion', message: 'PTP_STD completed', time: '18m ago' },
    { type: 'healing', message: 'Healing event on MIGO_GR', time: '22m ago' },
    { type: 'defect', message: 'Defect DEF-001 raised', time: '25m ago' },
  ]

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="page-breadcrumb mb-1">
                  <Link href="/execution-console" className="hover:underline">Active Runs</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span>Run Detail</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">{execution.suite.name}</h1>
                  <Badge variant="outline">{execution.suite.code}</Badge>
                  <Badge className="bg-blue-500 animate-pulse">InProgress</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">{runId}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Started {new Date(execution.started_at).toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ETA: ~{formatTime(execution.eta_remaining_mins || 0)}
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {execution.target_system.sid}:{execution.target_system.client}
                  </Badge>
                  <Link href="/system-admin/runners" className="flex items-center gap-1 hover:underline">
                    <Server className="h-3.5 w-3.5" />
                    {execution.runner_pool.name}
                  </Link>
                  <span>Triggered by {execution.triggered_by.user || execution.triggered_by.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Replay
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Abort
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Evidence Bundle
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <div className="border-b px-4 md:px-6">
            <TabsList className="h-10">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="timeline">Live Timeline</TabsTrigger>
              <TabsTrigger value="healings" className="gap-1">
                Healings
                {execution.healing_events > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {execution.healing_events}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="defects" className="gap-1">
                Defects
                {execution.defects_raised > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {execution.defects_raised}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="signoff">Sign-Off</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            {/* Full-width progress bar */}
            <Card className="mb-6">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Case Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {execution.case_counts.pass + execution.case_counts.healed + execution.case_counts.fail} / {total} cases complete
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden flex mb-3">
                  <div className="bg-emerald-500" style={{ width: `${passWidth}%` }} />
                  <div className="bg-amber-500" style={{ width: `${healedWidth}%` }} />
                  <div className="bg-red-500" style={{ width: `${failWidth}%` }} />
                  <div className="bg-slate-300 dark:bg-slate-600" style={{ width: `${todoWidth}%` }} />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-sm">Pass: {execution.case_counts.pass}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500" />
                    <span className="text-sm">Healed: {execution.case_counts.healed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-sm">Failed: {execution.case_counts.fail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600" />
                    <span className="text-sm">ToDo: {execution.case_counts.todo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two columns */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Scenarios */}
              <div className="lg:col-span-2">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Scenarios ({scenarios.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {scenarios.map((scenario) => (
                    <ScenarioCard key={scenario.id} scenario={scenario} />
                  ))}
                </div>
              </div>

              {/* Right: Stats and Events */}
              <div className="space-y-6">
                {/* Pass Rate */}
                <Card>
                  <CardContent className="text-center">
                    <p className="text-4xl font-bold text-emerald-600">{execution.pass_rate}%</p>
                    <p className="page-description">Pass Rate</p>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Recent Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="card-bleed-x card-bleed-b">
                    <ScrollArea className="h-64">
                      <div className="p-4 pt-0 space-y-2">
                        {recentEvents.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            {event.type === 'healing' && <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                            {event.type === 'completion' && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                            {event.type === 'signoff' && <ClipboardCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />}
                            {event.type === 'defect' && <Bug className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{event.message}</p>
                              <p className="caption-text">{event.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Runner Pool */}
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Runner Pool</span>
                      <Badge variant="outline">{execution.runner_pool.name}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={execution.runner_pool.utilization} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground">{execution.runner_pool.utilization}%</span>
                    </div>
                    <p className="caption-text mt-1">Pool utilization</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <Link 
                  key={scenario.id}
                  href={`/execution-console/runs/${runId}/scenarios/${scenario.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{scenario.scenario.name}</h4>
                            <Badge variant="outline">{scenario.scenario.code}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{scenario.business_process}</span>
                            <span>{scenario.modules.join(', ')}</span>
                            {scenario.started_at && (
                              <span>Started {new Date(scenario.started_at).toLocaleTimeString()}</span>
                            )}
                            {scenario.duration_mins && (
                              <span>Duration: {formatTime(scenario.duration_mins)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-emerald-600">{scenario.case_counts.pass}P</span>
                            <span className="text-amber-600">{scenario.case_counts.healed}H</span>
                            <span className="text-red-600">{scenario.case_counts.fail}F</span>
                            <span className="text-muted-foreground">{scenario.case_counts.todo}T</span>
                          </div>
                          <Badge 
                            variant={scenario.state === 'Completed' ? 'secondary' : scenario.state === 'InProgress' ? 'default' : 'outline'}
                            className={scenario.state === 'InProgress' ? 'bg-blue-500' : ''}
                          >
                            {scenario.state}
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Cases Tab placeholder */}
          <TabsContent value="cases" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Cases list will be shown here...</p>
          </TabsContent>

          {/* Timeline Tab placeholder */}
          <TabsContent value="timeline" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Live Timeline Gantt will be shown here...</p>
          </TabsContent>

          {/* Healings Tab placeholder */}
          <TabsContent value="healings" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Healings list will be shown here...</p>
          </TabsContent>

          {/* Defects Tab placeholder */}
          <TabsContent value="defects" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Defects list will be shown here...</p>
          </TabsContent>

          {/* Sign-Off Tab placeholder */}
          <TabsContent value="signoff" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Sign-off panel will be shown here...</p>
          </TabsContent>

          {/* Audit Tab placeholder */}
          <TabsContent value="audit" className="flex-1 overflow-auto p-4 md:p-6 mt-0">
            <p className="page-description">Audit trail will be shown here...</p>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
