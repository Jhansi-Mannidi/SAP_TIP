'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertTriangle, 
  CheckCircle,
  Clock,
  XCircle,
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
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts'
import { MOCK_SI_BURNDOWN } from '@/lib/reports-mock-data'

export default function SIBurndownPage() {
  const [migrationScope, setMigrationScope] = React.useState('star-cement')

  const burndownData = MOCK_SI_BURNDOWN
  const totalItems = 96
  const closedItems = totalItems - (burndownData[burndownData.length - 1]?.actual || 0)
  const percentClosed = Math.round((closedItems / totalItems) * 100)
  
  // Calculate if on track
  const latestActual = burndownData[burndownData.length - 1]?.actual || 0
  const latestIdeal = burndownData[burndownData.length - 1]?.ideal || 0
  const onTrack = latestActual <= latestIdeal

  // Mock severity breakdown for stacked area
  const severityData = burndownData.map(d => ({
    date: d.date,
    critical: Math.round(d.actual * 0.05),
    high: Math.round(d.actual * 0.20),
    medium: Math.round(d.actual * 0.45),
    low: Math.round(d.actual * 0.20),
    informational: Math.round(d.actual * 0.10),
  }))

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Simplification Items Burndown" description="Track SI item closure progress against the ideal burndown line." />

        {/* Migration Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Migration:</span>
            <Select value={migrationScope} onValueChange={setMigrationScope}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star-cement">Star Cement S/4HANA</SelectItem>
                <SelectItem value="vertex">Vertex Industries</SelectItem>
                <SelectItem value="northwind">Northwind Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="stat-value">{totalItems}</p>
                  <p className="caption-text">Total SI Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="stat-value">{closedItems}</p>
                  <p className="caption-text">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="stat-value">{latestActual}</p>
                  <p className="caption-text">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', onTrack ? 'bg-emerald-500/10' : 'bg-red-500/10')}>
                  {onTrack ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                <div>
                  <p className="stat-value">{percentClosed}%</p>
                  <p className="caption-text">{onTrack ? 'On Track' : 'Behind'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Main Burndown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>SI Items Burndown</CardTitle>
            <CardDescription>Actual vs ideal burndown with phase markers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Ideal"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Actual"
                />
                {/* Phase transition markers */}
                <ReferenceLine x="2026-02-15" stroke="#8b5cf6" strokeDasharray="3 3" label={{ value: 'Prepare', position: 'top', fontSize: 10 }} />
                <ReferenceLine x="2026-03-15" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Explore', position: 'top', fontSize: 10 }} />
                <ReferenceLine x="2026-04-15" stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Realize', position: 'top', fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Burndown by Severity</CardTitle>
            <CardDescription>Stacked area showing composition by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} name="Critical" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} name="High" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="Medium" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Low" />
                <Area type="monotone" dataKey="informational" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.8} name="Informational" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* State Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Per-State Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StaggerGrid columns="grid-cols-2 md:grid-cols-5" className="gap-4" fast>
              {[
                { state: 'Open', count: 12, color: 'bg-red-500' },
                { state: 'In Progress', count: 11, color: 'bg-amber-500' },
                { state: 'Resolved', count: 45, color: 'bg-blue-500' },
                { state: 'Verified', count: 18, color: 'bg-emerald-500' },
                { state: 'Closed', count: 10, color: 'bg-gray-500' },
              ].map(item => (
                <div key={item.state} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={cn('w-3 h-3 rounded-full', item.color)} />
                  <div>
                    <p className="text-lg font-semibold">{item.count}</p>
                    <p className="caption-text">{item.state}</p>
                  </div>
                </div>
              ))}
            </StaggerGrid>
          </CardContent>
        </Card>
    </AppShell>
  )
}
