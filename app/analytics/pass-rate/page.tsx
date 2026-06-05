'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, 
  TrendingDown,
  Sparklines,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { MOCK_PASS_RATE_DATA, MOCK_TOP_FAILING_SUITES } from '@/lib/reports-mock-data'

const suites = ['Star Cement Cutover', 'SD Core Regression', 'FI Core Regression', 'MM Regression', 'PP Regression']
const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function PassRateTrendsPage() {
  const [scope, setScope] = React.useState('all')
  const [timeRange, setTimeRange] = React.useState('30d')
  const [showHealing, setShowHealing] = React.useState(false)
  const [showMTTH, setShowMTTH] = React.useState(false)
  const [showDefectRate, setShowDefectRate] = React.useState(false)

  // Process data for chart
  const dates = [...new Set(MOCK_PASS_RATE_DATA.map(d => d.date))]
  const chartData = dates.map(date => {
    const point: Record<string, number | string> = { date }
    suites.forEach(suite => {
      const entry = MOCK_PASS_RATE_DATA.find(d => d.date === date && d.suite === suite)
      if (entry) {
        point[suite] = entry.passRate
        if (showHealing) point[`${suite}_healing`] = entry.healingRate || 0
        if (showMTTH) point[`${suite}_mtth`] = entry.mtth || 0
        if (showDefectRate) point[`${suite}_defect`] = entry.defectRate || 0
      }
    })
    return point
  })

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Pass Rate Trends" description="Time-series of test pass rates by Suite, Scenario, or Module." />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Scope:</span>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suites</SelectItem>
                <SelectItem value="suite">By Suite</SelectItem>
                <SelectItem value="scenario">By Scenario</SelectItem>
                <SelectItem value="module">By Module</SelectItem>
                <SelectItem value="migration">By Migration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pass Rate Over Time</CardTitle>
                <CardDescription>Star Cement - All 5 Suites - Last 30 days</CardDescription>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="healing" checked={showHealing} onCheckedChange={setShowHealing} />
                  <Label htmlFor="healing" className="text-sm">Healing Rate</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="mtth" checked={showMTTH} onCheckedChange={setShowMTTH} />
                  <Label htmlFor="mtth" className="text-sm">MTTH</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="defect" checked={showDefectRate} onCheckedChange={setShowDefectRate} />
                  <Label htmlFor="defect" className="text-sm">Defect Rate</Label>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[70, 100]} className="text-xs" unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {suites.map((suite, idx) => (
                  <Line
                    key={suite}
                    type="monotone"
                    dataKey={suite}
                    stroke={colors[idx]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={suite}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Tables */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Failing Suites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Failing Suites</CardTitle>
              <CardDescription>Last 7 days pass rate with delta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_TOP_FAILING_SUITES.map((suite, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{suite.suite}</p>
                        <p className="caption-text">Last 7d pass rate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">{suite.last7dPassRate}%</span>
                      <Badge 
                        variant={suite.trend === 'up' ? 'default' : 'destructive'}
                        className={cn(
                          suite.trend === 'up' 
                            ? 'bg-emerald-500/20 text-emerald-700' 
                            : 'bg-red-500/20 text-red-700'
                        )}
                      >
                        {suite.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {suite.delta > 0 ? '+' : ''}{suite.delta}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Improved Suites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Most Improved Suites</CardTitle>
              <CardDescription>Largest positive delta vs previous period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { suite: 'Star Cement Cutover', last7dPassRate: 96, delta: 4, trend: 'up' },
                  { suite: 'FI Core Regression', last7dPassRate: 97, delta: 2, trend: 'up' },
                  { suite: 'PP Regression', last7dPassRate: 95, delta: 1, trend: 'up' },
                ].map((suite, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-medium text-emerald-700">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{suite.suite}</p>
                        <p className="caption-text">Last 7d pass rate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">{suite.last7dPassRate}%</span>
                      <Badge className="bg-emerald-500/20 text-emerald-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{suite.delta}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </AppShell>
  )
}
