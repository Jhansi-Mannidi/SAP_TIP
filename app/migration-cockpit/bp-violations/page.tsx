'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  ExternalLink,
  FileText,
  ChevronRight,
  XCircle,
  Clock,
  ArrowUpRight,
  Layers,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock BP Violations
const MOCK_BP_VIOLATIONS = [
  { id: 'bpv_1', code: 'BPV-001', title: 'Missing Credit Check in OTC Flow', scope_item: 'BD9', process: 'OTC', severity: 'High', status: 'Open', detected_at: '2026-05-05', affected_scenarios: 3, recommendation: 'Enable credit check step in VA01 flow per SAP Best Practice' },
  { id: 'bpv_2', code: 'BPV-002', title: 'Non-standard Pricing Procedure', scope_item: 'BD3', process: 'OTC', severity: 'Medium', status: 'In Review', detected_at: '2026-05-04', affected_scenarios: 2, recommendation: 'Align pricing procedure ZSTAR01 with BP standard' },
  { id: 'bpv_3', code: 'BPV-003', title: 'Custom Partner Determination', scope_item: 'BLG', process: 'OTC', severity: 'Low', status: 'Accepted', detected_at: '2026-05-03', affected_scenarios: 1, recommendation: 'Document custom partner functions as accepted deviation' },
  { id: 'bpv_4', code: 'BPV-004', title: 'Missing ATP Check Configuration', scope_item: 'BD9', process: 'OTC', severity: 'High', status: 'Open', detected_at: '2026-05-02', affected_scenarios: 4, recommendation: 'Configure ATP check in OVZ9 per Best Practice' },
  { id: 'bpv_5', code: 'BPV-005', title: 'Non-standard GR/IR Clearing', scope_item: 'J45', process: 'PTP', severity: 'Medium', status: 'Open', detected_at: '2026-05-01', affected_scenarios: 2, recommendation: 'Use standard GR/IR clearing account per BP' },
  { id: 'bpv_6', code: 'BPV-006', title: 'Custom Invoice Verification Workflow', scope_item: 'J56', process: 'PTP', severity: 'Low', status: 'In Review', detected_at: '2026-04-30', affected_scenarios: 1, recommendation: 'Evaluate standard workflow WS20000077' },
  { id: 'bpv_7', code: 'BPV-007', title: 'Missing Intercompany Billing Config', scope_item: 'BKP', process: 'OTC', severity: 'High', status: 'Open', detected_at: '2026-04-28', affected_scenarios: 2, recommendation: 'Configure IC billing per scope item BKP requirements' },
  { id: 'bpv_8', code: 'BPV-008', title: 'Non-standard Period Close Sequence', scope_item: '1FZ', process: 'RTR', severity: 'Medium', status: 'Resolved', detected_at: '2026-04-25', affected_scenarios: 1, recommendation: 'Follow standard period close task list' },
]

const severityConfig = {
  High: { color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: XCircle },
  Medium: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: AlertTriangle },
  Low: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: AlertCircle },
}

const statusConfig = {
  Open: { color: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: AlertCircle },
  'In Review': { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Clock },
  Accepted: { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: CheckCircle2 },
  Resolved: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
}

export default function BPViolationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [severityFilter, setSeverityFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [processFilter, setProcessFilter] = React.useState<string>('all')
  
  const filteredViolations = MOCK_BP_VIOLATIONS.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || v.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    const matchesProcess = processFilter === 'all' || v.process === processFilter
    return matchesSearch && matchesSeverity && matchesStatus && matchesProcess
  })

  const stats = {
    total: MOCK_BP_VIOLATIONS.length,
    high: MOCK_BP_VIOLATIONS.filter(v => v.severity === 'High').length,
    open: MOCK_BP_VIOLATIONS.filter(v => v.status === 'Open').length,
    resolved: MOCK_BP_VIOLATIONS.filter(v => v.status === 'Resolved').length,
  }

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">BP Violations</h1>
                <p className="page-description mt-1">
                  SAP Best Practice deviations detected in current implementation
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export Report
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="stat-value">{stats.total}</p>
                    <p className="caption-text">Total Violations</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="stat-value text-red-600 dark:text-red-400">{stats.high}</p>
                    <p className="caption-text">High Severity</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="stat-value text-amber-600 dark:text-amber-400">{stats.open}</p>
                    <p className="caption-text">Open</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="stat-value text-emerald-600 dark:text-emerald-400">{stats.resolved}</p>
                    <p className="caption-text">Resolved</p>
                  </div>
                </div>
              </Card>
            </StaggerGrid>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search violations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={processFilter} onValueChange={setProcessFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  <SelectItem value="OTC">OTC</SelectItem>
                  <SelectItem value="PTP">PTP</SelectItem>
                  <SelectItem value="RTR">RTR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Violation</TableHead>
                <TableHead className="w-[100px]">Scope Item</TableHead>
                <TableHead className="w-[80px]">Process</TableHead>
                <TableHead className="w-[100px]">Severity</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Scenarios</TableHead>
                <TableHead className="w-[100px]">Detected</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredViolations.map((violation) => {
                const SeverityIcon = severityConfig[violation.severity as keyof typeof severityConfig].icon
                const StatusIcon = statusConfig[violation.status as keyof typeof statusConfig].icon
                
                return (
                  <TableRow key={violation.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{violation.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{violation.title}</p>
                        <p className="caption-text mt-0.5 line-clamp-1">
                          {violation.recommendation}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {violation.scope_item}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{violation.process}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          'gap-1',
                          severityConfig[violation.severity as keyof typeof severityConfig].color
                        )}
                      >
                        <SeverityIcon className="h-3 w-3" />
                        {violation.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={cn(
                          'gap-1',
                          statusConfig[violation.status as keyof typeof statusConfig].color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {violation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-3 w-3" />
                        <span className="text-sm">{violation.affected_scenarios}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(violation.detected_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  )
}
