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
import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Database,
  Search,
  Download,
  FileJson,
  FileSpreadsheet,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Filter,
} from 'lucide-react'

// Mock run records
const MOCK_RUN_RECORDS = [
  { id: 'RUN-2026-0507-001', suite: 'Star Cement Cutover Validation Suite', scenarios: 47, cases: 234, passed: 228, failed: 4, healed: 2, duration: '2h 34m', started_at: '2026-05-07T06:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0506-003', suite: 'SD Core Regression Suite', scenarios: 28, cases: 156, passed: 152, failed: 2, healed: 2, duration: '1h 45m', started_at: '2026-05-06T18:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0506-002', suite: 'FI Core Regression Suite', scenarios: 22, cases: 98, passed: 98, failed: 0, healed: 0, duration: '58m', started_at: '2026-05-06T14:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0506-001', suite: 'MM Regression Suite', scenarios: 18, cases: 87, passed: 85, failed: 1, healed: 1, duration: '1h 12m', started_at: '2026-05-06T06:00:00+05:30', status: 'completed', signedOff: false },
  { id: 'RUN-2026-0505-002', suite: 'Star Cement Cutover Validation Suite', scenarios: 47, cases: 234, passed: 225, failed: 6, healed: 3, duration: '2h 41m', started_at: '2026-05-05T18:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0505-001', suite: 'OTC E2E Validation', scenarios: 12, cases: 67, passed: 65, failed: 2, healed: 0, duration: '45m', started_at: '2026-05-05T10:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0504-001', suite: 'PTP E2E Validation', scenarios: 14, cases: 78, passed: 76, failed: 1, healed: 1, duration: '52m', started_at: '2026-05-04T14:00:00+05:30', status: 'completed', signedOff: true },
  { id: 'RUN-2026-0503-001', suite: 'RTR Month-End Suite', scenarios: 8, cases: 42, passed: 42, failed: 0, healed: 0, duration: '28m', started_at: '2026-05-03T22:00:00+05:30', status: 'completed', signedOff: true },
]

export default function RunRecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedRecords, setSelectedRecords] = React.useState<string[]>([])

  const filteredRecords = MOCK_RUN_RECORDS.filter(r =>
    r.suite.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRecord = (id: string) => {
    setSelectedRecords(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(filteredRecords.map(r => r.id))
    }
  }

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Run Record Export</h1>
            <p className="page-description">Export execution records for compliance and audit purposes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" disabled={selectedRecords.length === 0}>
              <FileJson className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" className="gap-2" disabled={selectedRecords.length === 0}>
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button className="gap-2" disabled={selectedRecords.length === 0}>
              <Archive className="h-4 w-4" />
              Archive Package
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Database className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="stat-value">{MOCK_RUN_RECORDS.length}</p>
                  <p className="page-description">Total Runs</p>
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
                  <p className="stat-value">{MOCK_RUN_RECORDS.filter(r => r.signedOff).length}</p>
                  <p className="page-description">Signed Off</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="stat-value">{MOCK_RUN_RECORDS.reduce((sum, r) => sum + r.cases, 0).toLocaleString()}</p>
                  <p className="page-description">Total Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Archive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="stat-value">{selectedRecords.length}</p>
                  <p className="page-description">Selected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by suite name or run ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Run Records</CardTitle>
            <CardDescription>Select runs to include in export package</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead className="text-center">Scenarios</TableHead>
                  <TableHead className="text-center">Cases</TableHead>
                  <TableHead className="text-center">Pass Rate</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const passRate = Math.round((record.passed / record.cases) * 100)
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => toggleRecord(record.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{record.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={record.suite}>
                          {record.suite}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{record.scenarios}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-green-600">{record.passed}</span>
                        {record.failed > 0 && <span className="text-red-600">/{record.failed}</span>}
                        {record.healed > 0 && <span className="text-amber-600">/{record.healed}h</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={passRate >= 95 ? 'default' : passRate >= 80 ? 'secondary' : 'destructive'}>
                          {passRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatRelativeTime(record.started_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                          {record.signedOff && (
                            <Badge variant="outline" className="text-xs">Signed</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
