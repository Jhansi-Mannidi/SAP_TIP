'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Settings,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Clock,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Table,
} from 'lucide-react'

// Mock custom reports
const MOCK_CUSTOM_REPORTS = [
  { id: 'cr_1', name: 'Weekly Executive Summary', description: 'High-level metrics for leadership review', schedule: 'Weekly (Mon 8:00 AM)', lastRun: '2026-05-06T08:00:00+05:30', format: 'PDF', charts: ['Pass Rate Trend', 'Defect Summary', 'Coverage'], createdBy: 'P.Sharma' },
  { id: 'cr_2', name: 'Daily Test Run Report', description: 'Detailed results from overnight test runs', schedule: 'Daily (6:00 AM)', lastRun: '2026-05-07T06:00:00+05:30', format: 'Email', charts: ['Run Results', 'Failed Cases', 'Healings'], createdBy: 'J.Rao' },
  { id: 'cr_3', name: 'Migration Progress Tracker', description: 'Phase-by-phase progress for all active migrations', schedule: 'On Demand', lastRun: '2026-05-05T14:30:00+05:30', format: 'XLSX', charts: ['Progress Bars', 'SI Burndown', 'Risk Matrix'], createdBy: 'P.Sharma' },
  { id: 'cr_4', name: 'Defect Aging Analysis', description: 'Deep dive into open defect aging and trends', schedule: 'Weekly (Fri 5:00 PM)', lastRun: '2026-05-03T17:00:00+05:30', format: 'PDF', charts: ['Aging Histogram', 'Trend Line', 'By Severity'], createdBy: 'M.Reddy' },
]

const CHART_ICONS: Record<string, React.ElementType> = {
  'bar': BarChart3,
  'line': LineChart,
  'pie': PieChart,
  'table': Table,
}

export default function CustomReportsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const filteredReports = MOCK_CUSTOM_REPORTS.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Custom Report Builder</h1>
            <p className="page-description">Create and schedule custom reports with your preferred metrics</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Custom Report</DialogTitle>
                <DialogDescription>
                  Configure a new report with custom metrics and scheduling.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name</Label>
                  <Input id="name" placeholder="e.g., Monthly QA Summary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Brief description of the report purpose" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="xlsx">Excel Workbook</SelectItem>
                        <SelectItem value="email">Email Digest</SelectItem>
                        <SelectItem value="dashboard">Dashboard Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="ondemand">On Demand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Metrics to Include</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {['Pass Rate', 'Failure Rate', 'Execution Duration', 'Defect Count', 'Coverage %', 'Healing Rate', 'SLA Compliance', 'Resource Utilization'].map((metric) => (
                      <label key={metric} className="flex items-center gap-2 text-sm">
                        <Checkbox />
                        {metric}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chart Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {['bar', 'line', 'pie', 'table'].map((type) => {
                      const Icon = CHART_ICONS[type]
                      return (
                        <Button key={type} variant="outline" size="sm" className="gap-2">
                          <Icon className="h-4 w-4" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Recipients (for email reports)</Label>
                  <Input placeholder="email@example.com, another@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateOpen(false)}>Create Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReports.map((report) => (
            <Card key={report.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{report.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last run: {formatRelativeTime(report.lastRun)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Includes</p>
                    <div className="flex flex-wrap gap-1">
                      {report.charts.map((chart) => (
                        <Badge key={chart} variant="secondary" className="text-xs">
                          {chart}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Play className="h-3 w-3" />
                    Run Now
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
