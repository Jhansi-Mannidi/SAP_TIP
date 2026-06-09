'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  Search,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Users,
  Clock,
  AlertTriangle,
  Bug,
  ChevronDown,
  GripVertical,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

import { MOCK_MIGRATIONS, MOCK_SI_ITEMS, type SIItemState, type SISeverity } from '@/lib/migration-mock-data'

const migration = MOCK_MIGRATIONS[0]

const STATE_ORDER: SIItemState[] = ['Identified', 'Assessed', 'Decided_Remediate', 'Decided_Accept', 'Decided_Defer', 'Remediation_Planned', 'In_Remediation', 'Validated', 'Closed']

const STATE_COLORS: Record<SIItemState, string> = {
  Identified: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  Assessed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Decided_Remediate: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  Decided_Accept: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Decided_Defer: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Remediation_Planned: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  In_Remediation: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  Validated: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  Closed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const SEVERITY_COLORS: Record<SISeverity, string> = {
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

function KanbanColumn({ state, items }: { state: SIItemState, items: typeof MOCK_SI_ITEMS }) {
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
          <Link key={item.id} href={`/migration-cockpit/si-items/${item.id}`}>
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent>
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <code className="text-[10px] font-mono text-muted-foreground">{item.si_code}</code>
                    <h4 className="text-sm font-medium leading-tight mt-0.5 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn('text-[10px]', SEVERITY_COLORS[item.severity])}>
                        {item.severity}
                      </Badge>
                      {item.effort_estimate_days > 0 && (
                        <span className="text-[10px] text-muted-foreground">{item.effort_estimate_days}d</span>
                      )}
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

export default function SIItemsWorklistPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [severityFilter, setSeverityFilter] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list')
  
  const filteredItems = MOCK_SI_ITEMS.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.si_code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (stateFilter !== 'all' && item.state !== stateFilter) return false
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false
    return true
  })

  // Stats
  const stats = {
    total: MOCK_SI_ITEMS.length,
    closed: MOCK_SI_ITEMS.filter(i => i.state === 'Closed').length,
    inProgress: MOCK_SI_ITEMS.filter(i => ['In_Remediation', 'Remediation_Planned'].includes(i.state)).length,
    deferred: MOCK_SI_ITEMS.filter(i => i.state === 'Decided_Defer').length,
    critical: MOCK_SI_ITEMS.filter(i => i.severity === 'Critical').length,
    high: MOCK_SI_ITEMS.filter(i => i.severity === 'High').length,
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
              <span className="text-foreground">SI Items</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Simplification Items</h1>
                <p className="page-description mt-1">
                  Track and manage SAP simplification items for this migration
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Bulk Decide</Button>
                <Button variant="outline" size="sm">Bulk Assign</Button>
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
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">In Progress:</span>
                <span className="font-semibold text-blue-600">{stats.inProgress}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Deferred:</span>
                <span className="font-semibold text-amber-600">{stats.deferred}</span>
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
                  placeholder="Search SI items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {STATE_ORDER.map(state => (
                    <SelectItem key={state} value={state}>{state.replace(/_/g, ' ')}</SelectItem>
                  ))}
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
                    <TableHead>SI Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Effort</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Defects</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(item => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/migration-cockpit/si-items/${item.id}`}>
                          <code className="text-xs font-mono">{item.si_code}</code>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/migration-cockpit/si-items/${item.id}`} className="font-medium hover:underline">
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', SEVERITY_COLORS[item.severity])}>
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', STATE_COLORS[item.state])}>
                          {item.state.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.effort_estimate_days > 0 ? `${item.effort_estimate_days}d` : '-'}
                      </TableCell>
                      <TableCell>
                        {item.decision_rationale ? (
                          <span className="text-xs text-muted-foreground truncate max-w-[150px] block" title={item.decision_rationale}>
                            {item.decision_rationale.slice(0, 30)}...
                          </span>
                        ) : '-'}
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
                        {new Date(item.last_updated).toLocaleDateString()}
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
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                            <DropdownMenuItem>Change State</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Add Comment</DropdownMenuItem>
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
              {['Identified', 'Assessed', 'Decided_Remediate', 'Remediation_Planned', 'In_Remediation', 'Validated', 'Closed'].map(state => (
                <KanbanColumn 
                  key={state} 
                  state={state as SIItemState} 
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
