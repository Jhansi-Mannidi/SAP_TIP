'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Maximize2,
} from 'lucide-react'

// Mock CIO dashboard data
const MOCK_CIO_DATA = {
  overallHealth: 92,
  healthTrend: 'up',
  activeMigrations: 3,
  onTrack: 2,
  atRisk: 1,
  testPassRate: 96.4,
  passRateTrend: 2.1,
  defectsOpen: 23,
  defectsTrend: -8,
  automationRate: 87,
  automationTrend: 5,
  costSavings: '$1.2M',
  savingsTrend: 15,
}

const MOCK_MIGRATIONS = [
  { name: 'Star Cement S/4HANA', status: 'on-track', phase: 'UAT', progress: 78, goLive: '2026-06-15', passRate: 97.2 },
  { name: 'Dalmia Bharat ECC', status: 'on-track', phase: 'SIT', progress: 45, goLive: '2026-09-01', passRate: 94.8 },
  { name: 'ACC Limited BW', status: 'at-risk', phase: 'Build', progress: 32, goLive: '2026-11-15', passRate: 88.5 },
]

const MOCK_TIMELINE = [
  { date: '2026-05-15', event: 'Star Cement UAT Phase 2 Start', type: 'milestone' },
  { date: '2026-05-20', event: 'Dalmia Bharat SIT Completion', type: 'milestone' },
  { date: '2026-06-01', event: 'Star Cement Dry Run #2', type: 'cutover' },
  { date: '2026-06-15', event: 'Star Cement Go-Live', type: 'golive' },
]

export default function CIODashboardPage() {
  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">CIO Dashboard</h1>
            <p className="page-description">Executive overview of test automation and migration health</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Present
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="page-description">Overall Health</p>
                  <p className="text-3xl font-bold">{MOCK_CIO_DATA.overallHealth}%</p>
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm',
                  MOCK_CIO_DATA.healthTrend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {MOCK_CIO_DATA.healthTrend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  Stable
                </div>
              </div>
              <Progress value={MOCK_CIO_DATA.overallHealth} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="page-description">Test Pass Rate</p>
                  <p className="text-3xl font-bold">{MOCK_CIO_DATA.testPassRate}%</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  +{MOCK_CIO_DATA.passRateTrend}%
                </div>
              </div>
              <Progress value={MOCK_CIO_DATA.testPassRate} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="page-description">Automation Rate</p>
                  <p className="text-3xl font-bold">{MOCK_CIO_DATA.automationRate}%</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  +{MOCK_CIO_DATA.automationTrend}%
                </div>
              </div>
              <Progress value={MOCK_CIO_DATA.automationRate} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="page-description">Cost Savings (YTD)</p>
                  <p className="text-3xl font-bold">{MOCK_CIO_DATA.costSavings}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  +{MOCK_CIO_DATA.savingsTrend}%
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">vs manual testing baseline</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Migration Health */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Migration Portfolio Health</CardTitle>
                    <CardDescription>{MOCK_CIO_DATA.activeMigrations} active migrations</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {MOCK_CIO_DATA.onTrack} On Track
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      {MOCK_CIO_DATA.atRisk} At Risk
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_MIGRATIONS.map((migration) => (
                    <div key={migration.name} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            migration.status === 'on-track' ? 'bg-green-500' : 'bg-amber-500'
                          )} />
                          <span className="font-medium">{migration.name}</span>
                          <Badge variant="outline">{migration.phase}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Pass Rate: <span className="font-medium text-foreground">{migration.passRate}%</span></span>
                          <span className="text-muted-foreground">Go-Live: <span className="font-medium text-foreground">{migration.goLive}</span></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={migration.progress} className="flex-1" />
                        <span className="text-sm font-medium w-12 text-right">{migration.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_TIMELINE.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      item.type === 'golive' ? 'bg-green-100 dark:bg-green-900/30' :
                      item.type === 'cutover' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    )}>
                      {item.type === 'golive' ? <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                       item.type === 'cutover' ? <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" /> :
                       <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="caption-text">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="stat-value">{MOCK_CIO_DATA.defectsOpen}</p>
                  <p className="page-description">Open Defects</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-sm text-green-600">
                  <ArrowDownRight className="h-4 w-4" />
                  {MOCK_CIO_DATA.defectsTrend}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="stat-value">12</p>
                  <p className="page-description">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="stat-value">1,247</p>
                  <p className="page-description">Test Cases This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
