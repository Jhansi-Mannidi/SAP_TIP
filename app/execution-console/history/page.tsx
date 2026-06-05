'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  History,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
  Calendar,
  Search,
  ChevronRight,
  AlertCircle,
  Timer,
  Bug,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { MOCK_PAST_RUNS, type PastRun } from '@/lib/execution-mock-data'

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

function getStateConfig(state: string) {
  switch (state) {
    case 'Completed':
      return { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
    case 'Failed':
      return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    case 'Aborted':
      return { icon: AlertCircle, color: 'text-orange-500', bgColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
    default:
      return { icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }
}

export default function PastRunsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [dateFilter, setDateFilter] = React.useState<string>('30d')
  
  const runs = MOCK_PAST_RUNS

  // Filter runs
  const filteredRuns = runs.filter(run => {
    if (searchQuery && !run.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !run.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (stateFilter !== 'all' && run.state !== stateFilter) {
      return false
    }
    return true
  })

  // Stats
  const totalRuns = runs.length
  const avgPassRate = Math.round(runs.reduce((sum, r) => sum + r.pass_rate, 0) / runs.length)
  const totalHealings = runs.reduce((sum, r) => sum + r.healing_events, 0)
  const totalDefects = runs.reduce((sum, r) => sum + r.defects_raised, 0)

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <History className="h-6 w-6" />
                  Past Runs
                </h1>
                <p className="page-description mt-1">
                  Historical test suite executions
                </p>
              </div>
            </div>

            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-3 mt-4" fast>
              <Card className="bg-muted/50">
                <CardContent>
                  <p className="caption-text">Total Runs (30d)</p>
                  <p className="stat-value">{totalRuns}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <p className="caption-text">Avg Pass Rate</p>
                  <p className="stat-value text-emerald-600">{avgPassRate}%</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <p className="caption-text">Total Healings</p>
                  <p className="stat-value text-amber-600">{totalHealings}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <p className="caption-text">Defects Raised</p>
                  <p className="stat-value text-red-600">{totalDefects}</p>
                </CardContent>
              </Card>
            </StaggerGrid>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Aborted">Aborted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Runs Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Suite</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead>Pass Rate</TableHead>
                  <TableHead>Healings</TableHead>
                  <TableHead>Defects</TableHead>
                  <TableHead>Triggered By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.map((run) => {
                  const stateConfig = getStateConfig(run.state)
                  const StateIcon = stateConfig.icon
                  
                  return (
                    <TableRow key={run.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link 
                          href={`/execution-console/runs/${run.id}`}
                          className="font-medium hover:underline"
                        >
                          {run.name}
                        </Link>
                        <p className="caption-text">{run.code}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {run.target_system.sid}:{run.target_system.client}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={stateConfig.bgColor}>
                          <StateIcon className="h-3 w-3 mr-1" />
                          {run.state}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(run.started_at)}</p>
                          <p className="caption-text">
                            {new Date(run.started_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Timer className="h-3.5 w-3.5" />
                          {formatDuration(run.duration_mins)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-emerald-600">{run.case_counts.pass}P</span>
                          <span className="text-amber-600">{run.case_counts.healed}H</span>
                          <span className="text-red-600">{run.case_counts.fail}F</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          run.pass_rate >= 95 ? "text-emerald-600" :
                          run.pass_rate >= 85 ? "text-amber-600" : "text-red-600"
                        )}>
                          {run.pass_rate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {run.healing_events > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            {run.healing_events}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {run.defects_raised > 0 ? (
                          <Badge variant="secondary" className="gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <Bug className="h-3 w-3" />
                            {run.defects_raised}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{run.triggered_by}</span>
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
