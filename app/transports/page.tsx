'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Truck,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Play,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  X,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { 
  MOCK_TRANSPORTS, 
  type Transport, 
  type TransportState,
  TRANSPORT_STATES,
} from '@/lib/transport-mock-data'

// Filter chip definitions
const filterChips = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'pending-analysis', label: 'Pending Analysis', filter: (t: Transport) => ['Captured', 'Classified'].includes(t.state) },
  { id: 'pending-approval', label: 'Pending Test Plan Approval', filter: (t: Transport) => t.state === 'Test_Plan_Ready' },
  { id: 'in-test', label: 'In Test', filter: (t: Transport) => t.state === 'In_Test' },
  { id: 'released-qas', label: 'Released to QAS', filter: (t: Transport) => t.state === 'Released_to_QAS' },
  { id: 'released-prod', label: 'Released to PROD', filter: (t: Transport) => t.state === 'Released_to_PROD' },
  { id: 'high-risk', label: 'High Risk', filter: (t: Transport) => t.risk_band === 'high' || t.risk_band === 'critical' },
  { id: 'mine', label: 'Mine', filter: (t: Transport) => t.owner.name === 'P.Sharma' },
]

function getStateColor(state: TransportState): string {
  switch (state) {
    case 'Captured': return 'bg-slate-500'
    case 'Classified': return 'bg-blue-500'
    case 'Analyzed': return 'bg-indigo-500'
    case 'Test_Plan_Ready': return 'bg-amber-500'
    case 'Test_Plan_Approved': return 'bg-lime-500'
    case 'In_Test': return 'bg-cyan-500'
    case 'Released_to_QAS': return 'bg-emerald-500'
    case 'Released_to_PROD': return 'bg-green-600'
    case 'Closed': return 'bg-gray-400'
    default: return 'bg-gray-500'
  }
}

function getRiskColor(risk_band: string): string {
  switch (risk_band) {
    case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950/30'
    case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/30'
    case 'medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30'
    case 'low': return 'text-green-600 bg-green-50 dark:bg-green-950/30'
    default: return 'text-gray-600 bg-gray-50'
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function RiskGauge({ score, band }: { score: number; band: string }) {
  const percentage = score * 100
  const color = band === 'critical' ? '#dc2626' : band === 'high' ? '#ea580c' : band === 'medium' ? '#d97706' : '#16a34a'
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-12 h-6">
        <svg viewBox="0 0 48 24" className="w-full h-full">
          <path
            d="M 4 20 A 20 20 0 0 1 44 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted-foreground/20"
          />
          <path
            d="M 4 20 A 20 20 0 0 1 44 20"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${percentage * 0.63} 100`}
          />
        </svg>
      </div>
      <span className="text-sm font-medium tabular-nums">{(score * 100).toFixed(0)}%</span>
    </div>
  )
}

function TestStateBadge({ state }: { state: TransportState }) {
  const stateLabels: Record<TransportState, string> = {
    'Captured': 'Captured',
    'Classified': 'Classified',
    'Analyzed': 'Analyzed',
    'Test_Plan_Ready': 'Plan Ready',
    'Test_Plan_Approved': 'Plan Approved',
    'In_Test': 'In Test',
    'Released_to_QAS': 'QAS',
    'Released_to_PROD': 'PROD',
    'Closed': 'Closed',
  }

  return (
    <Badge variant="secondary" className={cn('text-white', getStateColor(state))}>
      {stateLabels[state]}
    </Badge>
  )
}

export default function TransportInboxPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState<'risk' | 'captured'>('risk')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [drawerFilters, setDrawerFilters] = React.useState({
    state: 'all',
    sourceSystem: 'all',
    riskBand: 'all',
    owner: 'all',
  })

  const activeChipFilter = filterChips.find(c => c.id === activeFilter)?.filter || (() => true)

  const filteredTransports = MOCK_TRANSPORTS
    .filter(t => activeChipFilter(t))
    .filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.tr_number.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })
    .filter(t => {
      if (drawerFilters.state !== 'all' && t.state !== drawerFilters.state) return false
      if (drawerFilters.sourceSystem !== 'all' && t.source_system !== drawerFilters.sourceSystem) return false
      if (drawerFilters.riskBand !== 'all' && t.risk_band !== drawerFilters.riskBand) return false
      if (drawerFilters.owner !== 'all' && t.owner.id !== drawerFilters.owner) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'risk') {
        return sortOrder === 'desc' ? b.risk_score - a.risk_score : a.risk_score - b.risk_score
      }
      return sortOrder === 'desc' 
        ? new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime()
        : new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime()
    })

  // KPI calculations
  const last24h = MOCK_TRANSPORTS.filter(t => {
    const captured = new Date(t.captured_at)
    const now = new Date()
    return (now.getTime() - captured.getTime()) < 86400000
  }).length
  const pendingAnalysis = MOCK_TRANSPORTS.filter(t => ['Captured', 'Classified'].includes(t.state)).length
  const inTest = MOCK_TRANSPORTS.filter(t => t.state === 'In_Test').length
  const highRisk = MOCK_TRANSPORTS.filter(t => t.risk_band === 'high' || t.risk_band === 'critical').length

  return (
    <AppShell currentApp="transport-intelligence">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Transports</h1>
                <p className="page-description mt-1">
                  All transport requests across registered SAP systems. Captured from STMS, classified, impact-analyzed, validated.
                </p>
              </div>
            </div>

            {/* KPI Strip */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{last24h}</div>
                  <div className="text-xs text-muted-foreground">Last 24h Captured</div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <CardContent>
                  <div className="stat-value text-amber-700 dark:text-amber-400">{pendingAnalysis}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-500">Pending Analysis</div>
                </CardContent>
              </Card>
              <Card className="bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900">
                <CardContent>
                  <div className="stat-value text-cyan-700 dark:text-cyan-400">{inTest}</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-500">In Test</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
                <CardContent>
                  <div className="stat-value text-red-700 dark:text-red-400">{highRisk}</div>
                  <div className="text-xs text-red-600 dark:text-red-500">High Risk</div>
                </CardContent>
              </Card>
            </StaggerGrid>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {filterChips.map(chip => (
                <Button
                  key={chip.id}
                  variant={activeFilter === chip.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(chip.id)}
                  className="h-7 text-xs"
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="px-4 md:px-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search TR number or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Transports</SheetTitle>
                    <SheetDescription>Refine the transport list</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <Select value={drawerFilters.state} onValueChange={(v) => setDrawerFilters(f => ({ ...f, state: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          {TRANSPORT_STATES.map(s => (
                            <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Source System</label>
                      <Select value={drawerFilters.sourceSystem} onValueChange={(v) => setDrawerFilters(f => ({ ...f, sourceSystem: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Systems</SelectItem>
                          <SelectItem value="SD1">SD1 (DEV)</SelectItem>
                          <SelectItem value="SQ1">SQ1 (QAS)</SelectItem>
                          <SelectItem value="SP1">SP1 (PROD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Risk Band</label>
                      <Select value={drawerFilters.riskBand} onValueChange={(v) => setDrawerFilters(f => ({ ...f, riskBand: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Risk Levels</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Owner</label>
                      <Select value={drawerFilters.owner} onValueChange={(v) => setDrawerFilters(f => ({ ...f, owner: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Owners</SelectItem>
                          <SelectItem value="u_1">P.Sharma</SelectItem>
                          <SelectItem value="u_2">J.Rao</SelectItem>
                          <SelectItem value="u_3">M.Reddy</SelectItem>
                          <SelectItem value="u_4">S.Kumar</SelectItem>
                          <SelectItem value="u_5">K.Iyer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setDrawerFilters({ state: 'all', sourceSystem: 'all', riskBand: 'all', owner: 'all' })}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (sortBy === 'risk') {
                    setSortOrder(o => o === 'desc' ? 'asc' : 'desc')
                  } else {
                    setSortBy('risk')
                    setSortOrder('desc')
                  }
                }}
              >
                <ArrowUpDown className="h-4 w-4" />
                Risk {sortBy === 'risk' && (sortOrder === 'desc' ? '↓' : '↑')}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[140px]">TR Number</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="w-[80px]">System</TableHead>
                <TableHead className="w-[100px]">Owner</TableHead>
                <TableHead className="w-[100px]">State</TableHead>
                <TableHead className="w-[120px]">Risk</TableHead>
                <TableHead className="w-[180px]">Classification</TableHead>
                <TableHead className="w-[80px] text-center">Tests</TableHead>
                <TableHead className="w-[100px]">Captured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransports.map(transport => (
                <TableRow key={transport.id} className="group">
                  <TableCell>
                    <Link 
                      href={`/transports/${transport.id}`}
                      className="font-mono font-semibold text-primary hover:underline"
                    >
                      {transport.tr_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[250px] truncate" title={transport.description}>
                      {transport.description}
                    </div>
                    {transport.linked_migration_name && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {transport.linked_migration_name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {transport.source_system}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{transport.owner.avatar_initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{transport.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TestStateBadge state={transport.state} />
                  </TableCell>
                  <TableCell>
                    <div className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium', getRiskColor(transport.risk_band))}>
                      <RiskGauge score={transport.risk_score} band={transport.risk_band} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {transport.classification_summary.slice(0, 2).map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {c}
                        </Badge>
                      ))}
                      {transport.classification_summary.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{transport.classification_summary.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{transport.linked_tests_count}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeTime(transport.captured_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/transports/${transport.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/transports/${transport.id}/pipeline`}>
                            <ChevronRight className="h-4 w-4 mr-2" />
                            Pipeline View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {['Captured', 'Classified'].includes(transport.state) && (
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Trigger Impact Analysis
                          </DropdownMenuItem>
                        )}
                        {transport.state === 'Test_Plan_Ready' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/transports/${transport.id}/impact-analysis`}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Review Test Plan
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTransports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No transports found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
