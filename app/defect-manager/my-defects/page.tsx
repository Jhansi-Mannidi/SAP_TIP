'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Bug, 
  Search, 
  MoreHorizontal,
  AlertTriangle,
  AlertCircle,
  Play,
  Sparkles,
  Code,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  UserPlus,
  MessageSquare,
  Link2,
  Rocket,
  Truck,
  User,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  DEFECT_SOURCE_LABELS,
  type Defect,
  type DefectSourceKind,
  type DefectSeverity,
  type DefectState,
  type ITSMSyncState,
} from '@/lib/defect-mock-data'

function SeverityBadge({ severity }: { severity: DefectSeverity }) {
  const config = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  }
  return <Badge variant="outline" className={cn('text-xs font-medium', config[severity])}>{severity}</Badge>
}

function StateBadge({ state }: { state: DefectState }) {
  const config: Record<DefectState, string> = {
    Open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Triaged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'In Fix': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'Retest Pending': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Retest In Progress': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    Closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Rejected: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[state])}>{state}</Badge>
}

function SourceChip({ source }: { source: DefectSourceKind }) {
  const iconMap: Record<DefectSourceKind, React.ReactNode> = {
    test_failure: <Play className="h-3 w-3" />,
    healing_failure: <Sparkles className="h-3 w-3" />,
    si_item: <AlertTriangle className="h-3 w-3" />,
    abap_finding: <Code className="h-3 w-3" />,
    bp_violation: <AlertCircle className="h-3 w-3" />,
    manual: <Pencil className="h-3 w-3" />,
  }
  return (
    <Badge variant="outline" className="text-xs gap-1">
      {iconMap[source]}
      {DEFECT_SOURCE_LABELS[source]}
    </Badge>
  )
}

function ITSMSyncIcon({ state }: { state: ITSMSyncState }) {
  const config: Record<ITSMSyncState, { icon: React.ReactNode; color: string; label: string }> = {
    synced: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-emerald-500', label: 'Synced' },
    pending: { icon: <Clock className="h-4 w-4" />, color: 'text-amber-500', label: 'Sync Pending' },
    conflict: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-500', label: 'Sync Conflict' },
    not_linked: { icon: <Link2 className="h-4 w-4" />, color: 'text-muted-foreground', label: 'Not Linked' },
  }
  const c = config[state]
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex', c.color)}>{c.icon}</span>
        </TooltipTrigger>
        <TooltipContent>{c.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function MyDefectsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  
  // Pre-filter to current user (u_1 = P.Sharma) as assignee or opened_by
  const currentUserId = 'u_1'
  const myDefects = MOCK_DEFECTS.filter(d => 
    d.assignee?.id === currentUserId || d.opened_by.id === currentUserId
  )
  
  const filteredDefects = myDefects.filter(d => {
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()) && !d.code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const openCount = filteredDefects.filter(d => d.state !== 'Closed' && d.state !== 'Rejected').length
  const assignedToMe = filteredDefects.filter(d => d.assignee?.id === currentUserId).length
  const openedByMe = filteredDefects.filter(d => d.opened_by.id === currentUserId).length

  return (
    <AppShell currentApp="defect-manager">
              {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="page-title">My Defects</h1>
                <p className="page-description">
                  Defects assigned to you or raised by you
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <StaggerGrid columns="grid-cols-3" className="gap-4" fast>
          <Card>
            <CardContent>
              <div className="stat-value">{openCount}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="stat-value text-primary">{assignedToMe}</div>
              <div className="text-xs text-muted-foreground">Assigned to Me</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="stat-value">{openedByMe}</div>
              <div className="text-xs text-muted-foreground">Opened by Me</div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search my defects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>ITSM</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDefects.map(defect => (
                  <TableRow key={defect.id}>
                    <TableCell>
                      <Link 
                        href={`/defect-manager/defects/${defect.id}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {defect.code}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block text-sm">{defect.title}</span>
                    </TableCell>
                    <TableCell><SeverityBadge severity={defect.severity} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{defect.priority}</Badge>
                    </TableCell>
                    <TableCell><StateBadge state={defect.state} /></TableCell>
                    <TableCell><SourceChip source={defect.source_kind} /></TableCell>
                    <TableCell>
                      <Badge variant={defect.assignee?.id === currentUserId ? 'default' : 'secondary'} className="text-xs">
                        {defect.assignee?.id === currentUserId ? 'Assignee' : 'Reporter'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(defect.opened_at)}</span>
                          </TooltipTrigger>
                          <TooltipContent>{new Date(defect.opened_at).toLocaleString()}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {defect.itsm_ref && (
                          <a 
                            href="#" 
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {defect.itsm_ref}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <ITSMSyncIcon state={defect.itsm_sync_state} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/defect-manager/defects/${defect.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="text-sm text-muted-foreground">
          Showing {filteredDefects.length} defects
        </div>
    </AppShell>
  )
}
