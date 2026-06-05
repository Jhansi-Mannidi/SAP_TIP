'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { EntityCodeLink } from '@/components/entity-code-link'
import { AuditTrailTable, type AuditEvent } from '@/components/audit-trail-table'
import { BPCoverageMatrix, type BPScope, type CoverageState } from '@/components/bp-coverage-matrix'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  Play,
  Calendar,
  Pencil,
  MoreHorizontal,
  Upload,
  Archive,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  GripVertical,
  Plus,
  Search,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Layers,
  Send,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOCK_TEST_SUITES,
  MOCK_TEST_SCENARIOS,
  MOCK_MIGRATION,
  mockTestRuns,
  mockAssignees,
  mockZObjects,
} from '@/lib/mock-data'

// Extended suite detail data
const suiteDetail = {
  ...MOCK_TEST_SUITES[0],
  description: `This comprehensive test suite validates all critical business processes for the Star Cement S/4HANA migration cutover. 

It covers:
- **Order-to-Cash (OTC)**: Complete sales cycle from inquiry to billing
- **Procure-to-Pay (PTP)**: Procurement, goods receipt, invoice verification
- **Record-to-Report (RTR)**: Financial closing, asset management, reporting

The suite is designed to run in sequence during the final cutover weekend to ensure all integrations are functioning correctly after the migration.`,
  successCriteria: {
    pass_rate_pct: 95,
    max_failed_critical_cases: 0,
    max_healed_pct: 15,
    target_runner_pool: 'VOLTUS-POOL-01',
  },
  tags: ['cutover', 'regression', 's4hana', 'star-cement', 'critical'],
  linkedMigrations: [MOCK_MIGRATION],
  totalCases: 156,
  estimatedDuration: '2h 15m',
  createdAt: '2026-01-15T10:00:00+05:30',
  updatedAt: '2026-05-07T08:00:00+05:30',
}

// Extended scenarios with ordering
const suiteScenarios = MOCK_TEST_SCENARIOS.slice(0, 12).map((sc, idx) => ({
  ...sc,
  order: idx + 1,
  suite_id: 'sui_1',
}))

// Recent executions
const recentExecutions = [
  { id: 'run_001', timestamp: '2026-05-07T08:00:00+05:30', state: 'Completed_Passed_With_Healing', passRate: 91 },
  { id: 'run_002', timestamp: '2026-05-06T14:00:00+05:30', state: 'Completed_Passed', passRate: 94 },
  { id: 'run_003', timestamp: '2026-05-05T08:00:00+05:30', state: 'Completed_Failed', passRate: 88 },
  { id: 'run_004', timestamp: '2026-05-04T20:00:00+05:30', state: 'Completed_Passed_With_Healing', passRate: 92 },
  { id: 'run_005', timestamp: '2026-05-03T08:00:00+05:30', state: 'Completed_Passed', passRate: 95 },
]

// Execution history
const executionHistory = mockTestRuns.filter(r => r.suite.id === 'sui_1').concat([
  {
    id: 'run_005',
    suite: MOCK_TEST_SUITES[0],
    started_at: '2026-05-05T08:00:00+05:30',
    ended_at: '2026-05-05T09:30:00+05:30',
    state: 'Completed_Failed',
    passed: 41,
    failed: 3,
    healed: 3,
    skipped: 0,
    total: 47,
    triggered_by: mockAssignees[2],
    system: { sid: 'STQ', client: '200', description: 'Star Cement Quality', isProductive: false, environment: 'QAS' as const },
    signOffState: 'Rejected',
  },
  {
    id: 'run_006',
    suite: MOCK_TEST_SUITES[0],
    started_at: '2026-05-04T20:00:00+05:30',
    ended_at: '2026-05-04T21:45:00+05:30',
    state: 'Completed_Passed_With_Healing',
    passed: 42,
    failed: 0,
    healed: 5,
    skipped: 0,
    total: 47,
    triggered_by: mockAssignees[0],
    system: { sid: 'STQ', client: '200', description: 'Star Cement Quality', isProductive: false, environment: 'QAS' as const },
    signOffState: 'Approved',
  },
])

// Comments
const comments = [
  {
    id: 'cmt_1',
    author: mockAssignees[0],
    content: 'Updated the suite to include the new credit check scenarios for the Star Cement migration. @Jahnavi Rao please review the OTC_CREDIT scenario.',
    timestamp: '2026-05-06T14:30:00+05:30',
    replies: [
      {
        id: 'cmt_1_r1',
        author: mockAssignees[1],
        content: 'Reviewed the credit check flow. Looks good, but we should add a test for the manual override path.',
        timestamp: '2026-05-06T15:00:00+05:30',
      },
    ],
  },
  {
    id: 'cmt_2',
    author: mockAssignees[3],
    content: 'The FI month-end closing scenarios are now stable after the depreciation fix. Pass rate improved from 85% to 88%.',
    timestamp: '2026-05-05T10:00:00+05:30',
    replies: [],
  },
]

// Audit events
const auditEvents: AuditEvent[] = [
  {
    id: 'aud_1',
    timestamp: '2026-05-07T08:00:00+05:30',
    actor: { id: '1', name: 'Pradeep Sharma', email: 'pradeep.sharma@starcement.com', role: 'Migration Manager' },
    action: 'EXECUTE',
    entityType: 'TestSuite',
    entityId: 'SC_CUTOVER_VAL',
    signatureStatus: 'verified',
  },
  {
    id: 'aud_2',
    timestamp: '2026-05-06T16:00:00+05:30',
    actor: { id: '1', name: 'Pradeep Sharma', email: 'pradeep.sharma@starcement.com', role: 'Migration Manager' },
    action: 'UPDATE',
    entityType: 'TestSuite',
    entityId: 'SC_CUTOVER_VAL',
    fieldChanged: 'version',
    oldValue: '2.3.0',
    newValue: '2.4.0',
    signatureStatus: 'signed',
  },
  {
    id: 'aud_3',
    timestamp: '2026-05-05T11:00:00+05:30',
    actor: { id: '2', name: 'Jahnavi Rao', email: 'jahnavi.rao@starcement.com', role: 'QA Lead' },
    action: 'ADD_SCENARIO',
    entityType: 'TestSuite',
    entityId: 'SC_CUTOVER_VAL',
    fieldChanged: 'scenarios',
    newValue: 'OTC_CREDIT',
    signatureStatus: 'signed',
  },
  {
    id: 'aud_4',
    timestamp: '2026-05-04T09:00:00+05:30',
    actor: { id: '1', name: 'Pradeep Sharma', email: 'pradeep.sharma@starcement.com', role: 'Migration Manager' },
    action: 'PUBLISH',
    entityType: 'TestSuite',
    entityId: 'SC_CUTOVER_VAL',
    fieldChanged: 'state',
    oldValue: 'Draft',
    newValue: 'Published',
    signatureStatus: 'verified',
  },
]

// BP Coverage data
const bpCoverage: BPScope = {
  id: 'bp_otc',
  name: 'Order-to-Cash Process Coverage',
  items: [
    { id: 'BD9', code: 'BD9', name: 'Standard Sales Order Processing', module: 'SD', coverageState: 'covered_passing', scenarioCount: 4 },
    { id: 'BD3', code: 'BD3', name: 'Credit Management', module: 'SD', coverageState: 'covered_healing', scenarioCount: 2 },
    { id: 'BD4', code: 'BD4', name: 'Export Sales Processing', module: 'SD', coverageState: 'covered_passing', scenarioCount: 1 },
    { id: 'BD5', code: 'BD5', name: 'Intercompany Sales', module: 'SD', coverageState: 'covered_failing', scenarioCount: 1 },
    { id: 'BFK', code: 'BFK', name: 'Procurement Processing', module: 'MM', coverageState: 'covered_passing', scenarioCount: 4 },
    { id: 'BFL', code: 'BFL', name: 'Warehouse Management', module: 'MM', coverageState: 'covered_passing', scenarioCount: 1 },
    { id: 'BFM', code: 'BFM', name: 'Inventory Management', module: 'MM', coverageState: 'not_covered', scenarioCount: 0 },
    { id: 'BCA', code: 'BCA', name: 'General Ledger Accounting', module: 'FI', coverageState: 'covered_passing', scenarioCount: 3 },
    { id: 'BCB', code: 'BCB', name: 'Asset Accounting', module: 'FI', coverageState: 'covered_passing', scenarioCount: 2 },
    { id: 'BCC', code: 'BCC', name: 'Cash Management', module: 'FI', coverageState: 'not_covered', scenarioCount: 0 },
  ],
}

export default function TestSuiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('overview')
  const [scenarioOrder, setScenarioOrder] = React.useState(suiteScenarios)
  const [showAddScenarioSheet, setShowAddScenarioSheet] = React.useState(false)
  const [showRunNowModal, setShowRunNowModal] = React.useState(false)
  const [showPublishModal, setShowPublishModal] = React.useState(false)
  const [newComment, setNewComment] = React.useState('')
  const [selectedScenarios, setSelectedScenarios] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  
  const suite = suiteDetail
  const isDraft = suite.state === 'Draft'
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date('2026-05-07T11:00:00+05:30')
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }
  
  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'In Progress'
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffMs = endDate.getTime() - startDate.getTime()
    const hours = Math.floor(diffMs / 3600000)
    const mins = Math.floor((diffMs % 3600000) / 60000)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }
  
  const handleRunNow = () => {
    if (isDraft) {
      // Show warning
      return
    }
    setShowRunNowModal(true)
  }

  const handleDragEnd = (result: { source: { index: number }, destination?: { index: number } }) => {
    if (!result.destination) return
    
    const items = Array.from(scenarioOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    // Update order numbers
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }))
    setScenarioOrder(reordered)
  }
  
  const availableScenarios = MOCK_TEST_SCENARIOS.filter(
    sc => !scenarioOrder.find(s => s.id === sc.id)
  ).filter(sc => 
    searchQuery === '' || 
    sc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sc.code.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddScenarios = () => {
    const toAdd = MOCK_TEST_SCENARIOS.filter(sc => selectedScenarios.includes(sc.id))
    const newScenarios = toAdd.map((sc, idx) => ({
      ...sc,
      order: scenarioOrder.length + idx + 1,
      suite_id: 'sui_1',
    }))
    setScenarioOrder([...scenarioOrder, ...newScenarios])
    setSelectedScenarios([])
    setShowAddScenarioSheet(false)
  }

  return (
    <AppShell currentApp="test-repository">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Draft Warning Banner */}
          {isDraft && (
            <Alert variant="default" className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Suite is in Draft</AlertTitle>
              <AlertDescription className="text-amber-700">
                Publish the Suite before scheduling executions in production environments.
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => setShowPublishModal(true)}
                >
                  Publish Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Header */}
          <div className="space-y-4">
            {/* Back + Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/test-repository/suites')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <span className="text-muted-foreground">/</span>
              <Link href="/test-repository/suites" className="text-muted-foreground hover:text-foreground">
                Test Suites
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{suite.name}</span>
            </div>
            
            {/* Title Row */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="page-title">{suite.name}</h1>
                  <code className="text-lg font-mono text-muted-foreground">
                    {suite.code}
                  </code>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={suite.state} />
                  <Badge variant="outline" className="font-mono">
                    v{suite.version}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>Pass Rate:</span>
                    <span className="font-semibold text-foreground">{suite.last_pass_rate_pct}%</span>
                    {suite.last_pass_rate_pct > suite.prev_pass_rate_pct ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : suite.last_pass_rate_pct < suite.prev_pass_rate_pct ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {/* Sparkline placeholder */}
                  <div className="flex items-center gap-0.5 h-6">
                    {[88, 92, 85, 91, 94, 91].map((val, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-1.5 rounded-full',
                          val >= 90 ? 'bg-emerald-500' : val >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ height: `${(val / 100) * 24}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button onClick={handleRunNow} disabled={isDraft}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {suite.state === 'Draft' && (
                      <DropdownMenuItem onClick={() => setShowPublishModal(true)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    {suite.state === 'Published' && (
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Deprecate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Upload className="h-4 w-4 mr-2" />
                      Export as Test Pack
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="history">Execution History</TabsTrigger>
              <TabsTrigger value="coverage">Coverage</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <StaggerGrid columns="grid-cols-3" className="gap-6" fast>
                {/* Left Column - 2/3 width */}
                <div className="col-span-2 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {suite.description.split('\n').map((line, i) => {
                          if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.+?)\*\*: (.+)/)
                            if (match) {
                              return (
                                <p key={i} className="mb-1">
                                  <span className="font-semibold">{match[1]}:</span> {match[2]}
                                </p>
                              )
                            }
                          }
                          if (line.startsWith('It covers:')) {
                            return <p key={i} className="mt-3 mb-1">{line}</p>
                          }
                          return line ? <p key={i}>{line}</p> : <br key={i} />
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Success Criteria */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Success Criteria</CardTitle>
                      <CardDescription>
                        Thresholds that must be met for the suite execution to be considered successful
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
                        <div className="space-y-1">
                          <p className="page-description">Minimum Pass Rate</p>
                          <p className="text-lg font-semibold">{suite.successCriteria.pass_rate_pct}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="page-description">Max Failed Critical Cases</p>
                          <p className="text-lg font-semibold">{suite.successCriteria.max_failed_critical_cases}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="page-description">Max Healed Percentage</p>
                          <p className="text-lg font-semibold">{suite.successCriteria.max_healed_pct}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="page-description">Target Runner Pool</p>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {suite.successCriteria.target_runner_pool}
                          </code>
                        </div>
                      </StaggerGrid>
                    </CardContent>
                  </Card>
                  
                  {/* Linked Migrations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Linked Migrations</CardTitle>
                      <CardDescription>
                        Migration projects using this test suite
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {suite.linkedMigrations.map((mig) => (
                          <Link
                            key={mig.id}
                            href="/migration-cockpit"
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Layers className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{mig.name}</p>
                                <p className="page-description">{mig.code}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Cutover:</span>{' '}
                                <span className="font-medium">{mig.days_to_cutover} days</span>
                              </div>
                              <StatusBadge status={mig.state} />
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Scenarios</span>
                        <span className="font-semibold">{suite.scenario_count}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Test Cases</span>
                        <span className="font-semibold">{suite.totalCases}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Duration</span>
                        <span className="font-semibold">{suite.estimatedDuration}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Execution</span>
                        <div className="text-right">
                          <p className="font-semibold">{formatRelativeTime(suite.last_executed!)}</p>
                          <StatusBadge status="Completed_Passed_With_Healing" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {suite.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Executions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Executions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentExecutions.map((exec) => (
                          <div key={exec.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={exec.state} />
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{exec.passRate}%</p>
                              <p className="caption-text">
                                {formatRelativeTime(exec.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </StaggerGrid>
            </TabsContent>
            
            {/* Composition Tab */}
            <TabsContent value="composition" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Test Scenarios</CardTitle>
                    <CardDescription>
                      {scenarioOrder.length} scenarios in this suite. Drag to reorder.
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddScenarioSheet(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scenario
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Business Process</TableHead>
                          <TableHead>Modules</TableHead>
                          <TableHead className="text-center">Tasks</TableHead>
                          <TableHead className="text-center">Pass Rate</TableHead>
                          <TableHead>State</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scenarioOrder.map((scenario, idx) => (
                          <TableRow key={scenario.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-muted-foreground">
                              {scenario.order}
                            </TableCell>
                            <TableCell>
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            </TableCell>
                            <TableCell>
                              <EntityCodeLink
                                entityType="scenario"
                                code={scenario.code}
                                href={`/test-repository/scenarios/${scenario.id}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {scenario.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {scenario.business_process}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {scenario.modules.map((mod) => (
                                  <Badge key={mod} variant="secondary" className="font-mono text-xs">
                                    {mod}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {scenario.task_count}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress
                                  value={scenario.last_pass_rate_pct}
                                  className="w-12 h-2"
                                />
                                <span className="text-sm">
                                  {scenario.last_pass_rate_pct}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={scenario.state} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Execution History Tab */}
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution History</CardTitle>
                  <CardDescription>
                    All test runs for this suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Run ID</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead className="text-center">Pass</TableHead>
                          <TableHead className="text-center">Healed</TableHead>
                          <TableHead className="text-center">Failed</TableHead>
                          <TableHead>Triggered By</TableHead>
                          <TableHead>Sign-Off</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {executionHistory.map((run) => (
                          <TableRow key={run.id} className="hover:bg-muted/30">
                            <TableCell>
                              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                                {run.id}
                              </code>
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(run.started_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {run.ended_at ? new Date(run.ended_at).toLocaleString() : '-'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDuration(run.started_at, run.ended_at)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={run.state} />
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-emerald-600 font-medium">{run.passed}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-amber-600 font-medium">{run.healed}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-red-600 font-medium">{run.failed}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={cn(
                                    'text-xs',
                                    run.triggered_by.class === 'agent' && 'bg-primary text-primary-foreground'
                                  )}>
                                    {run.triggered_by.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{run.triggered_by.name.split(' ')[0]}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {(run as any).signOffState ? (
                                <StatusBadge status={(run as any).signOffState} />
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open Run Detail
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Evidence Bundle
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Coverage Tab */}
            <TabsContent value="coverage" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Process Coverage</CardTitle>
                  <CardDescription>
                    BP Scope Items covered by scenarios in this suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BPCoverageMatrix scope={bpCoverage} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Z-Object Touchpoints</CardTitle>
                  <CardDescription>
                    Custom ABAP objects exercised by this test suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Object Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>S/4 Status</TableHead>
                          <TableHead className="text-center">ATC Findings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockZObjects.slice(0, 5).map((obj) => (
                          <TableRow key={obj.name} className="hover:bg-muted/30">
                            <TableCell>
                              <code className="font-mono text-sm">{obj.name}</code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {obj.kind}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {obj.package}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={obj.s4_status} />
                            </TableCell>
                            <TableCell className="text-center">
                              {obj.atc_findings > 0 ? (
                                <Badge variant={obj.atc_findings > 2 ? 'destructive' : 'secondary'}>
                                  {obj.atc_findings}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Comments Tab */}
            <TabsContent value="comments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Discussion and notes about this test suite
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment... Use @mention to notify team members"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button size="sm" disabled={!newComment.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                            <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                        
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-11 space-y-4 border-l-2 border-muted pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {reply.author.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{reply.author.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-1">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Audit Tab */}
            <TabsContent value="audit" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    Complete history of changes to this test suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AuditTrailTable events={auditEvents} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Scenario Sheet */}
      <Sheet open={showAddScenarioSheet} onOpenChange={setShowAddScenarioSheet}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Add Scenarios</SheetTitle>
            <SheetDescription>
              Search and select scenarios to add to this suite
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="p-4 space-y-2">
                {availableScenarios.map((scenario) => (
                  <label
                    key={scenario.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                      selectedScenarios.includes(scenario.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <Checkbox
                      checked={selectedScenarios.includes(scenario.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedScenarios([...selectedScenarios, scenario.id])
                        } else {
                          setSelectedScenarios(selectedScenarios.filter(id => id !== scenario.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-muted-foreground">
                          {scenario.code}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {scenario.business_process}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm mt-1">{scenario.name}</p>
                    </div>
                  </label>
                ))}
                {availableScenarios.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No more scenarios available to add
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAddScenarioSheet(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddScenarios}
              disabled={selectedScenarios.length === 0}
            >
              Add {selectedScenarios.length} Scenario{selectedScenarios.length !== 1 ? 's' : ''}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Run Now Modal */}
      <Dialog open={showRunNowModal} onOpenChange={setShowRunNowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Test Suite</DialogTitle>
            <DialogDescription>
              Start a new execution of {suite.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target System</label>
              <select className="w-full border rounded-md p-2">
                <option>STQ / 200 - Star Cement Quality</option>
                <option>STA / 100 - Star Cement Development</option>
                <option>S4H / 100 - S/4HANA Target System</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Runner Pool</label>
              <select className="w-full border rounded-md p-2">
                <option>VOLTUS-POOL-01 (Recommended)</option>
                <option>VOLTUS-POOL-02</option>
              </select>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Estimated duration: {suite.estimatedDuration}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRunNowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRunNowModal(false)}>
              <Play className="h-4 w-4 mr-2" />
              Start Execution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Test Suite</DialogTitle>
            <DialogDescription>
              Publishing this suite will make it available for production executions
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Approval Required</AlertTitle>
              <AlertDescription>
                This action requires approval from a QA Lead before the suite can be used in production environments.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPublishModal(false)}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Request Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
