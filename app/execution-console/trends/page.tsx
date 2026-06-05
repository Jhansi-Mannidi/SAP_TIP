'use client'

import * as React from 'react'
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Filter,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Mock trend data
const trendMetrics = {
  passRate: { current: 94.2, previous: 91.8, trend: 'up' as const },
  avgDuration: { current: 45, previous: 52, trend: 'down' as const },
  healingRate: { current: 12, previous: 8, trend: 'up' as const },
  totalRuns: { current: 156, previous: 142, trend: 'up' as const },
}

const dailyStats = [
  { date: 'May 1', runs: 22, passed: 20, failed: 2, healed: 3 },
  { date: 'May 2', runs: 18, passed: 17, failed: 1, healed: 2 },
  { date: 'May 3', runs: 25, passed: 23, failed: 2, healed: 4 },
  { date: 'May 4', runs: 20, passed: 19, failed: 1, healed: 1 },
  { date: 'May 5', runs: 28, passed: 27, failed: 1, healed: 5 },
  { date: 'May 6', runs: 24, passed: 22, failed: 2, healed: 3 },
  { date: 'May 7', runs: 19, passed: 18, failed: 1, healed: 2 },
]

const topFailures = [
  { scenario: 'OTC Export with LC', failures: 5, lastFailed: '2 hours ago' },
  { scenario: 'ATP Check with Alternatives', failures: 3, lastFailed: '4 hours ago' },
  { scenario: 'Credit Block Release', failures: 2, lastFailed: '1 day ago' },
  { scenario: 'Returns Processing', failures: 2, lastFailed: '2 days ago' },
]

const suitePerformance = [
  { suite: 'Star Cement Cutover Suite', runs: 45, passRate: 96, avgDuration: 42 },
  { suite: 'SD Core Regression', runs: 38, passRate: 94, avgDuration: 38 },
  { suite: 'FI/CO Compliance Pack', runs: 32, passRate: 91, avgDuration: 55 },
  { suite: 'MM Regression Suite', runs: 28, passRate: 93, avgDuration: 35 },
]

export default function TrendsPage() {
  const [timeRange, setTimeRange] = React.useState('7d')

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">Execution Trends</h1>
                <p className="page-description mt-1">
                  Analyze test execution patterns and identify improvement opportunities
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="14d">Last 14 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          {/* Key Metrics */}
          <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-4" fast>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <Badge variant={trendMetrics.passRate.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                    {trendMetrics.passRate.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    +{(trendMetrics.passRate.current - trendMetrics.passRate.previous).toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="stat-value">{trendMetrics.passRate.current}%</p>
                  <p className="caption-text">Pass Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge variant="default" className="text-xs bg-emerald-500">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -{trendMetrics.avgDuration.previous - trendMetrics.avgDuration.current}min
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="stat-value">{trendMetrics.avgDuration.current}min</p>
                  <p className="caption-text">Avg Duration</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{trendMetrics.healingRate.current - trendMetrics.healingRate.previous}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="stat-value">{trendMetrics.healingRate.current}</p>
                  <p className="caption-text">Auto-Healings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-violet-500" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{trendMetrics.totalRuns.current - trendMetrics.totalRuns.previous}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="stat-value">{trendMetrics.totalRuns.current}</p>
                  <p className="caption-text">Total Runs</p>
                </div>
              </CardContent>
            </Card>
          </StaggerGrid>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Daily Execution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Execution Summary</CardTitle>
                <CardDescription>Runs, pass/fail breakdown by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyStats.map((day) => (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-12">{day.date.split(' ')[1]}</span>
                      <div className="flex-1 flex items-center gap-1 h-6">
                        <div 
                          className="h-full bg-emerald-500 rounded-l"
                          style={{ width: `${(day.passed / day.runs) * 100}%` }}
                        />
                        <div 
                          className="h-full bg-red-500 rounded-r"
                          style={{ width: `${(day.failed / day.runs) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{day.runs}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded" />
                    Passed
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    Failed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Failures */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Failing Scenarios</CardTitle>
                <CardDescription>Most frequent failures in selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topFailures.map((failure, i) => (
                    <div key={failure.scenario} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          i === 0 ? "bg-red-500/20 text-red-500" : "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{failure.scenario}</p>
                          <p className="caption-text">Last failed: {failure.lastFailed}</p>
                        </div>
                      </div>
                      <Badge variant="destructive">{failure.failures} failures</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suite Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suite Performance</CardTitle>
              <CardDescription>Execution metrics by test suite</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Suite</th>
                      <th className="text-right py-3 px-4 font-medium">Runs</th>
                      <th className="text-right py-3 px-4 font-medium">Pass Rate</th>
                      <th className="text-right py-3 px-4 font-medium">Avg Duration</th>
                      <th className="text-right py-3 px-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suitePerformance.map((suite) => (
                      <tr key={suite.suite} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{suite.suite}</td>
                        <td className="text-right py-3 px-4">{suite.runs}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant={suite.passRate >= 95 ? 'default' : suite.passRate >= 90 ? 'secondary' : 'destructive'}>
                            {suite.passRate}%
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4">{suite.avgDuration}min</td>
                        <td className="text-right py-3 px-4">
                          <TrendingUp className="h-4 w-4 text-emerald-500 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
