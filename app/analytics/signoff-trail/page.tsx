'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Shield,
  Search,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  FileSignature,
  User,
  ExternalLink,
} from 'lucide-react'

// Mock data for sign-off audit trail
const MOCK_SIGNOFFS = [
  { id: 'so_1', entity_type: 'Run', entity_id: 'RUN-2026-0507-001', entity_name: 'Star Cement Cutover Validation - Full Suite', signoff_type: 'Run Acceptance', signer: { name: 'P.Sharma', role: 'Migration Manager' }, decision: 'approved', signed_at: '2026-05-07T10:30:00+05:30', rationale: 'All critical scenarios passed. 2 low-priority failures addressed in defect tracker.' },
  { id: 'so_2', entity_type: 'Scenario', entity_id: 'SC-OTC-001', entity_name: 'OTC Happy Path Domestic', signoff_type: 'Scenario Publish', signer: { name: 'J.Rao', role: 'QA Lead' }, decision: 'approved', signed_at: '2026-05-06T16:45:00+05:30', rationale: 'Scenario validated against latest S/4HANA release.' },
  { id: 'so_3', entity_type: 'Promotion', entity_id: 'HP-VA01-001', entity_name: 'VA01 Extra Modal Fix', signoff_type: 'IR Promotion', signer: { name: 'P.Sharma', role: 'Migration Manager' }, decision: 'approved', signed_at: '2026-05-05T14:20:00+05:30', rationale: 'High confidence healing with 94% success rate across 12 occurrences.' },
  { id: 'so_4', entity_type: 'Migration', entity_id: 'MIG-SC-2026', entity_name: 'Star Cement S/4HANA Migration', signoff_type: 'Phase Gate', signer: { name: 'R.Gupta', role: 'Program Director' }, decision: 'approved', signed_at: '2026-05-04T11:00:00+05:30', rationale: 'SIT phase complete. 98% pass rate achieved. Cleared for UAT.' },
  { id: 'so_5', entity_type: 'Defect', entity_id: 'DEF-2026-0089', entity_name: 'Credit Block Not Releasing', signoff_type: 'Defect Closure', signer: { name: 'M.Reddy', role: 'Test Engineer' }, decision: 'approved', signed_at: '2026-05-03T09:15:00+05:30', rationale: 'Root cause identified and fixed in transport K900123. Verified in QAS.' },
  { id: 'so_6', entity_type: 'Run', entity_id: 'RUN-2026-0503-002', entity_name: 'SD Regression Suite - Nightly', signoff_type: 'Run Acceptance', signer: { name: 'J.Rao', role: 'QA Lead' }, decision: 'rejected', signed_at: '2026-05-03T08:00:00+05:30', rationale: 'Critical billing scenario failed. Cannot accept until DEF-2026-0091 resolved.' },
  { id: 'so_7', entity_type: 'Pack', entity_id: 'TP-SC-001', entity_name: 'Star Cement Cutover Test Pack', signoff_type: 'Pack Distribution', signer: { name: 'P.Sharma', role: 'Migration Manager' }, decision: 'approved', signed_at: '2026-05-02T15:30:00+05:30', rationale: 'Test pack validated and ready for customer distribution.' },
  { id: 'so_8', entity_type: 'Cutover', entity_id: 'CUT-DRY-001', entity_name: 'Dry Run #1 Window', signoff_type: 'Window Closure', signer: { name: 'R.Gupta', role: 'Program Director' }, decision: 'approved', signed_at: '2026-05-01T22:00:00+05:30', rationale: 'All tasks completed within SLA. 3 decisions logged and resolved.' },
]

const SIGNOFF_TYPE_COLORS: Record<string, string> = {
  'Run Acceptance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Scenario Publish': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'IR Promotion': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Phase Gate': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Defect Closure': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Pack Distribution': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Window Closure': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
}

export default function SignOffTrailPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [decisionFilter, setDecisionFilter] = React.useState<string>('all')

  const filteredSignoffs = MOCK_SIGNOFFS.filter(s => {
    const matchesSearch = s.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.signer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || s.signoff_type === typeFilter
    const matchesDecision = decisionFilter === 'all' || s.decision === decisionFilter
    return matchesSearch && matchesType && matchesDecision
  })

  const stats = {
    total: MOCK_SIGNOFFS.length,
    approved: MOCK_SIGNOFFS.filter(s => s.decision === 'approved').length,
    rejected: MOCK_SIGNOFFS.filter(s => s.decision === 'rejected').length,
  }

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Sign-Off Audit Trail</h1>
            <p className="page-description">Complete audit log of all approvals and rejections with rationale</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Trail
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <FileSignature className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="stat-value">{stats.total}</p>
                  <p className="page-description">Total Sign-Offs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="stat-value">{stats.approved}</p>
                  <p className="page-description">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="stat-value">{stats.rejected}</p>
                  <p className="page-description">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by entity, ID, or signer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sign-Off Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Run Acceptance">Run Acceptance</SelectItem>
                  <SelectItem value="Scenario Publish">Scenario Publish</SelectItem>
                  <SelectItem value="IR Promotion">IR Promotion</SelectItem>
                  <SelectItem value="Phase Gate">Phase Gate</SelectItem>
                  <SelectItem value="Defect Closure">Defect Closure</SelectItem>
                  <SelectItem value="Pack Distribution">Pack Distribution</SelectItem>
                  <SelectItem value="Window Closure">Window Closure</SelectItem>
                </SelectContent>
              </Select>
              <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sign-Off Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sign-Off Records</CardTitle>
            <CardDescription>Chronological audit trail with full rationale</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Signer</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Signed</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignoffs.map((signoff) => (
                  <TableRow key={signoff.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{signoff.entity_name}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{signoff.entity_type}</Badge>
                          <span className="text-xs text-muted-foreground font-mono">{signoff.entity_id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('font-normal', SIGNOFF_TYPE_COLORS[signoff.signoff_type])}>
                        {signoff.signoff_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{signoff.signer.name.split('.').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{signoff.signer.name}</p>
                          <p className="caption-text">{signoff.signer.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {signoff.decision === 'approved' ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatRelativeTime(signoff.signed_at)}
                        <p className="caption-text">
                          {new Date(signoff.signed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate" title={signoff.rationale}>
                        {signoff.rationale}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
