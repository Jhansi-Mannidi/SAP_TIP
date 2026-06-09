'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  RefreshCw,
  Code2,
  Bug,
  GripVertical,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { MOCK_MIGRATIONS, MOCK_ABAP_FINDINGS, type ABAPFindingState, type ABAPProvider, type SISeverity } from '@/lib/migration-mock-data'

const migration = MOCK_MIGRATIONS[0]

const STATE_COLORS: Record<ABAPFindingState, string> = {
  Open: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  Triaged: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  In_Remediation: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  Remediated: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  Verified: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Closed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Accepted_FalsePositive: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const SEVERITY_COLORS: Record<SISeverity, string> = {
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const PROVIDER_COLORS: Record<ABAPProvider, string> = {
  Joule: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  SAP_ATC_Remote: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Voltus_ABAP_Analyzer: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  SonarQube_ABAP: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

function KanbanColumn({ state, items }: { state: ABAPFindingState, items: typeof MOCK_ABAP_FINDINGS }) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{state.replace(/_/g, ' ')}</Badge>
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </div>
      </div>
      <div className="space-y-2 bg-muted/30 rounded-lg p-2 min-h-[400px]">
        {items.map(item => (
          <Link key={item.id} href={`/migration-cockpit/abap/${item.id}`}>
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent>
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <code className="text-[10px] font-mono text-muted-foreground">{item.zobject}</code>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-[10px]">{item.kind}</Badge>
                      <Badge className={cn('text-[10px]', PROVIDER_COLORS[item.provider])}>
                        {item.provider.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn('text-[10px]', SEVERITY_COLORS[item.severity])}>
                        {item.severity}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">{item.priority}</Badge>
                    </div>
                    {item.assignee && (
                      <div className="flex items-center gap-1 mt-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px]">{item.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-muted-foreground truncate">{item.assignee.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function ABAPFindingsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [providerFilter, setProviderFilter] = React.useState<string>('all')
  const [severityFilter, setSeverityFilter] = React.useState<string>('all')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list')
  
  const filteredItems = MOCK_ABAP_FINDINGS.filter(item => {
    if (searchQuery && !item.zobject.toLowerCase().includes(searchQuery.toLowerCase()) && !item.rule_id.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (providerFilter !== 'all' && item.provider !== providerFilter) return false
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false
    if (stateFilter !== 'all' && item.state !== stateFilter) return false
    return true
  })

  // Stats
  const stats = {
    total: MOCK_ABAP_FINDINGS.length,
    closed: MOCK_ABAP_FINDINGS.filter(i => i.state === 'Closed').length,
    critical: MOCK_ABAP_FINDINGS.filter(i => i.severity === 'Critical').length,
    high: MOCK_ABAP_FINDINGS.filter(i => i.severity === 'High').length,
  }

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-2">
              <Link href="/migration-cockpit" className="hover:text-foreground">Migrations</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href={`/migration-cockpit/${migration.id}`} className="hover:text-foreground">{migration.name}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">ABAP Findings</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">ABAP Impact Findings</h1>
                <p className="page-description mt-1">
                  Custom code analysis findings from multiple providers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Bulk Triage</Button>
                <Button variant="outline" size="sm">Bulk Assign</Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Re-run Check
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Closed:</span>
                <span className="font-semibold text-emerald-600">{stats.closed}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">Critical: {stats.critical}</Badge>
                <Badge variant="default" className="text-xs bg-orange-500">High: {stats.high}</Badge>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Z-objects or rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="Joule">Joule</SelectItem>
                  <SelectItem value="SAP_ATC_Remote">SAP ATC Remote</SelectItem>
                  <SelectItem value="Voltus_ABAP_Analyzer">Voltus Analyzer</SelectItem>
                  <SelectItem value="SonarQube_ABAP">SonarQube</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Triaged">Triaged</SelectItem>
                  <SelectItem value="In_Remediation">In Remediation</SelectItem>
                  <SelectItem value="Remediated">Remediated</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('kanban')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {viewMode === 'list' ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Z-Object</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Defects</TableHead>
                    <TableHead>Discovered</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/migration-cockpit/abap/${item.id}`}>
                          <code className="text-xs font-mono">{item.zobject}</code>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{item.kind}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', PROVIDER_COLORS[item.provider])}>
                          {item.provider.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', SEVERITY_COLORS[item.severity])}>
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{item.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px] block" title={item.rule_description}>
                          {item.rule_description.slice(0, 35)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', STATE_COLORS[item.state])}>
                          {item.state.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">{item.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{item.assignee.name}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {item.linked_defects > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            <Bug className="h-3 w-3 mr-1" />
                            {item.linked_defects}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(item.discovered_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Triage</DropdownMenuItem>
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Re-run Check</DropdownMenuItem>
                            <DropdownMenuItem>Mark as False Positive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {['Open', 'Triaged', 'In_Remediation', 'Remediated', 'Verified', 'Closed'].map(state => (
                <KanbanColumn 
                  key={state} 
                  state={state as ABAPFindingState} 
                  items={filteredItems.filter(i => i.state === state)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
