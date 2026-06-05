'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { AnimatedNumber } from '@/lib/animations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileCode2, 
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
import { MOCK_ABAP_BURNDOWN } from '@/lib/reports-mock-data'

export default function ABAPBurndownPage() {
  const [migrationScope, setMigrationScope] = React.useState('star-cement')

  const burndownData = MOCK_ABAP_BURNDOWN
  const totalItems = 503
  const closedItems = totalItems - (burndownData[burndownData.length - 1]?.actual || 0)
  const percentClosed = Math.round((closedItems / totalItems) * 100)
  
  const latestActual = burndownData[burndownData.length - 1]?.actual || 0
  const latestIdeal = burndownData[burndownData.length - 1]?.ideal || 0
  const onTrack = latestActual <= latestIdeal

  // Mock severity breakdown
  const severityData = burndownData.map(d => ({
    date: d.date,
    critical: Math.round(d.actual * 0.08),
    high: Math.round(d.actual * 0.22),
    medium: Math.round(d.actual * 0.40),
    low: Math.round(d.actual * 0.30),
  }))

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="ABAP Impact Burndown" description="Track ABAP Impact Findings resolution progress against the ideal burndown." />

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
                  <FileCode2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="kpi-value text-2xl"><AnimatedNumber value={totalItems} duration={0.9} /></p>
                  <p className="caption-text">Total Findings</p>
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
                  <p className="kpi-value text-2xl"><AnimatedNumber value={closedItems} duration={0.9} /></p>
                  <p className="caption-text">Resolved</p>
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
                  <p className="kpi-value text-2xl"><AnimatedNumber value={latestActual} duration={0.9} /></p>
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
                  <p className="kpi-value text-2xl"><AnimatedNumber value={percentClosed} duration={0.9} suffix="%" /></p>
                  <p className="caption-text">{onTrack ? 'Ahead of Schedule' : 'Behind'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Main Burndown Chart */}
        <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>ABAP Findings Burndown</CardTitle>
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
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Actual"
                />
                <ReferenceLine x="2026-02-15" stroke="#8b5cf6" strokeDasharray="3 3" label={{ value: 'Prepare', position: 'top', fontSize: 10 }} />
                <ReferenceLine x="2026-03-15" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Explore', position: 'top', fontSize: 10 }} />
                <ReferenceLine x="2026-04-15" stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Realize', position: 'top', fontSize: 10 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </PageSection>

        {/* Severity Breakdown */}
        <PageSection>
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
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </PageSection>

        {/* Finding Categories */}
        <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>Finding Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
              {[
                { category: 'Deprecated FMs', count: 156, resolved: 142 },
                { category: 'Custom Code', count: 203, resolved: 178 },
                { category: 'DB Access', count: 89, resolved: 72 },
                { category: 'Other', count: 55, resolved: 20 },
              ].map(item => (
                <div key={item.category} className="p-4 rounded-lg border">
                  <p className="page-description">{item.category}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="stat-value">{item.resolved}</span>
                    <span className="text-sm text-muted-foreground">/ {item.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(item.resolved / item.count) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </StaggerGrid>
          </CardContent>
        </Card>
        </PageSection>
    </AppShell>
  )
}
