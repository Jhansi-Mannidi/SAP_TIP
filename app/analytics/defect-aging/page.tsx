'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Clock, 
  AlertTriangle,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { MOCK_DEFECT_AGING_KPIS, MOCK_AGE_BUCKET_DATA, MOCK_OLDEST_DEFECTS } from '@/lib/reports-mock-data'

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-500/30'
    case 'medium': return 'bg-amber-500/20 text-amber-700 border-amber-500/30'
    case 'low': return 'bg-blue-500/20 text-blue-700 border-blue-500/30'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function DefectAgingPage() {
  const [migrationScope, setMigrationScope] = React.useState('all')
  const [severityFilter, setSeverityFilter] = React.useState('all')
  const [sourceFilter, setSourceFilter] = React.useState('all')

  const kpis = MOCK_DEFECT_AGING_KPIS
  const ageBuckets = MOCK_AGE_BUCKET_DATA
  const oldestDefects = MOCK_OLDEST_DEFECTS

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Defect Aging" description="How quickly defects move through the lifecycle, by severity." />

        {/* KPI Strip */}
        <StaggerGrid columns="grid-cols-2 md:grid-cols-5" className="gap-4" fast>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.meanTimeToTriage}h</p>
                  <p className="caption-text">Mean Time to Triage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Clock className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.meanTimeToFix}h</p>
                  <p className="caption-text">Mean Time to Fix</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.meanTimeToClose}h</p>
                  <p className="caption-text">Mean Time to Close</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.openOver7Days}</p>
                  <p className="caption-text">Open {'>'} 7 Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.openOver30Days}</p>
                  <p className="caption-text">Open {'>'} 30 Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Migration:</span>
            <Select value={migrationScope} onValueChange={setMigrationScope}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Migrations</SelectItem>
                <SelectItem value="star-cement">Star Cement S/4HANA</SelectItem>
                <SelectItem value="vertex">Vertex Industries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Severity:</span>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Source:</span>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="test">Test Execution</SelectItem>
                <SelectItem value="manual">Manual Entry</SelectItem>
                <SelectItem value="import">ITSM Import</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Age Bucket Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Defects by Age Bucket</CardTitle>
            <CardDescription>Stacked by severity - Critical / High / Medium / Low</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageBuckets}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="bucket" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="#f97316" name="High" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Low" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Oldest Open Defects */}
        <Card>
          <CardHeader>
            <CardTitle>Oldest Open Defects</CardTitle>
            <CardDescription>Top 10 by age requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {oldestDefects.map((defect, idx) => (
                <div key={defect.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-sm font-medium text-red-700">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{defect.id}</span>
                        <Badge className={getSeverityColor(defect.severity)}>
                          {defect.severity}
                        </Badge>
                      </div>
                      <p className="page-description">{defect.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{defect.assignee.split('.').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{defect.assignee}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-red-600">{defect.age}d</p>
                      <p className="caption-text">Last: {defect.lastActivity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </AppShell>
  )
}
