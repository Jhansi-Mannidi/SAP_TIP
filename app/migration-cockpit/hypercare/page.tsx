'use client'

import * as React from 'react'
import { 
  HeartPulse,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Bot,
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock Hypercare Data
const HYPERCARE_ISSUES = [
  { id: 'hc_1', title: 'ATP Check Timeout on High-Volume Orders', severity: 'High', status: 'Open', category: 'Performance', reported_at: '2026-05-07T09:30:00', reporter: 'Sales Team', assignee: 'M.Reddy', sla_remaining: '2h 30m' },
  { id: 'hc_2', title: 'Credit Block Not Releasing After Payment', severity: 'High', status: 'In Progress', category: 'Functional', reported_at: '2026-05-07T08:15:00', reporter: 'Finance Team', assignee: 'P.Sharma', sla_remaining: '4h 15m' },
  { id: 'hc_3', title: 'Delivery Note Print Format Issues', severity: 'Medium', status: 'Open', category: 'Output', reported_at: '2026-05-07T07:45:00', reporter: 'Logistics Team', assignee: 'Unassigned', sla_remaining: '6h 00m' },
  { id: 'hc_4', title: 'Intercompany Billing Price Mismatch', severity: 'Medium', status: 'In Progress', category: 'Functional', reported_at: '2026-05-06T16:30:00', reporter: 'Controlling Team', assignee: 'J.Rao', sla_remaining: '1h 45m' },
  { id: 'hc_5', title: 'Slow Response on Material Availability', severity: 'Low', status: 'Resolved', category: 'Performance', reported_at: '2026-05-06T14:00:00', reporter: 'Planning Team', assignee: 'S.Kumar', sla_remaining: null },
]

const HYPERCARE_METRICS = {
  issues_total: 23,
  issues_open: 8,
  issues_resolved_today: 5,
  avg_resolution_time: '4.2h',
  sla_compliance: 94,
  satisfaction_score: 4.2,
}

const DAILY_TREND = [
  { day: 'Mon', opened: 8, resolved: 6 },
  { day: 'Tue', opened: 5, resolved: 7 },
  { day: 'Wed', opened: 6, resolved: 5 },
  { day: 'Thu', opened: 4, resolved: 6 },
  { day: 'Fri', opened: 3, resolved: 4 },
]

const severityConfig = {
  High: { color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  Medium: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  Low: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
}

const statusConfig = {
  Open: { color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  'In Progress': { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  Resolved: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
}

export default function HypercarePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const filteredIssues = HYPERCARE_ISSUES.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">Hypercare Dashboard</h1>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <HeartPulse className="h-3 w-3 mr-1" />
                    Day 7 of 14
                  </Badge>
                </div>
                <p className="page-description mt-1">
                  Post-go-live support and issue tracking - Star Cement S/4HANA
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Log Issue
                </Button>
              </div>
            </div>
            
            {/* Metrics */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6" className="gap-3 mt-4" fast>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{HYPERCARE_METRICS.issues_total}</p>
                    <p className="caption-text">Total Issues</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{HYPERCARE_METRICS.issues_open}</p>
                    <p className="caption-text">Open</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{HYPERCARE_METRICS.issues_resolved_today}</p>
                    <p className="caption-text">Resolved Today</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{HYPERCARE_METRICS.avg_resolution_time}</p>
                    <p className="caption-text">Avg Resolution</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/10">
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{HYPERCARE_METRICS.sla_compliance}%</p>
                    <p className="caption-text">SLA Compliance</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <Activity className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{HYPERCARE_METRICS.satisfaction_score}/5</p>
                    <p className="caption-text">Satisfaction</p>
                  </div>
                </div>
              </Card>
            </StaggerGrid>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs defaultValue="issues" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="issues">Active Issues</TabsTrigger>
                <TabsTrigger value="trend">Trend</TabsTrigger>
                <TabsTrigger value="teams">Team Load</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="issues" className="space-y-3">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'p-2 rounded-lg shrink-0',
                            issue.severity === 'High' ? 'bg-red-500/10' : 
                            issue.severity === 'Medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                          )}>
                            <AlertCircle className={cn(
                              'h-4 w-4',
                              issue.severity === 'High' ? 'text-red-500' : 
                              issue.severity === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold">{issue.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <Badge variant="outline" className={severityConfig[issue.severity as keyof typeof severityConfig].color}>
                                {issue.severity}
                              </Badge>
                              <Badge variant="outline" className={statusConfig[issue.status as keyof typeof statusConfig].color}>
                                {issue.status}
                              </Badge>
                              <Badge variant="secondary">{issue.category}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Reported by {issue.reporter}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        {issue.sla_remaining && (
                          <div className={cn(
                            'text-sm font-medium flex items-center gap-1',
                            parseFloat(issue.sla_remaining) < 2 ? 'text-red-500' : 'text-muted-foreground'
                          )}>
                            <Clock className="h-3.5 w-3.5" />
                            {issue.sla_remaining}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Users className="h-3 w-3" />
                            {issue.assignee}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Issue Trend</CardTitle>
                  <CardDescription>Issues opened vs resolved per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DAILY_TREND.map((day) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-medium">{day.day}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-red-400 dark:bg-red-500"
                              style={{ width: `${(day.opened / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-red-600 dark:text-red-400">+{day.opened}</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-emerald-400 dark:bg-emerald-500"
                              style={{ width: `${(day.resolved / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-emerald-600 dark:text-emerald-400">-{day.resolved}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-sm text-muted-foreground">Opened</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-sm text-muted-foreground">Resolved</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teams">
              <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="gap-4" fast>
                {[
                  { name: 'P.Sharma', role: 'Migration Manager', assigned: 3, resolved: 8 },
                  { name: 'J.Rao', role: 'QA Lead', assigned: 2, resolved: 5 },
                  { name: 'M.Reddy', role: 'Test Engineer', assigned: 2, resolved: 4 },
                  { name: 'S.Kumar', role: 'Senior Test Engineer', assigned: 1, resolved: 6 },
                ].map((member) => (
                  <Card key={member.name}>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.name.split('.').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{member.name}</p>
                          <p className="page-description">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-center">
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{member.assigned}</p>
                          <p className="caption-text">Assigned</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{member.resolved}</p>
                          <p className="caption-text">Resolved</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{Math.round((member.resolved / (member.assigned + member.resolved)) * 100)}%</p>
                          <p className="caption-text">Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </StaggerGrid>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
