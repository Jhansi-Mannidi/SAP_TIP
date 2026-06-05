'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  History,
  Search,
  Filter,
  Download,
  ChevronRight,
  User,
  FileText,
  Database,
  Settings,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Eye,
  Shield,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// KB Admin audit events
const KB_AUDIT_EVENTS = [
  { id: 'ka_1', timestamp: '2026-05-07T14:30:00+05:30', actor: 'P.Sharma', action: 'source_sync', target: 'SAP Help Portal', details: 'Manual sync triggered', status: 'success' },
  { id: 'ka_2', timestamp: '2026-05-07T12:15:00+05:30', actor: 'System', action: 'source_sync', target: 'Internal Confluence', details: 'Scheduled sync completed', status: 'success' },
  { id: 'ka_3', timestamp: '2026-05-07T10:00:00+05:30', actor: 'J.Rao', action: 'article_created', target: 'Star Cement Pricing Guide', details: 'New org article created', status: 'success' },
  { id: 'ka_4', timestamp: '2026-05-06T16:45:00+05:30', actor: 'P.Sharma', action: 'source_paused', target: 'SharePoint Documents', details: 'Source paused due to auth error', status: 'warning' },
  { id: 'ka_5', timestamp: '2026-05-06T14:20:00+05:30', actor: 'M.Reddy', action: 'zobject_updated', target: 'Z_SD_PRICING_001', details: 'Documentation updated', status: 'success' },
  { id: 'ka_6', timestamp: '2026-05-06T11:00:00+05:30', actor: 'System', action: 'quality_scan', target: 'All Sources', details: 'Daily quality scan completed', status: 'success' },
  { id: 'ka_7', timestamp: '2026-05-05T15:30:00+05:30', actor: 'P.Sharma', action: 'source_added', target: 'SAP Notes (OSS)', details: 'New ingestion source configured', status: 'success' },
  { id: 'ka_8', timestamp: '2026-05-05T10:00:00+05:30', actor: 'System', action: 'source_sync', target: 'SharePoint Documents', details: 'Sync failed - authentication error', status: 'error' },
  { id: 'ka_9', timestamp: '2026-05-04T16:00:00+05:30', actor: 'J.Rao', action: 'article_deleted', target: 'Outdated Config Guide', details: 'Deleted deprecated article', status: 'success' },
  { id: 'ka_10', timestamp: '2026-05-04T14:30:00+05:30', actor: 'P.Sharma', action: 'settings_changed', target: 'Sync Schedule', details: 'Changed frequency from weekly to daily', status: 'success' },
  { id: 'ka_11', timestamp: '2026-05-03T12:00:00+05:30', actor: 'System', action: 'duplicate_detected', target: 'VA01 Documentation', details: '3 duplicate articles found', status: 'warning' },
  { id: 'ka_12', timestamp: '2026-05-02T10:00:00+05:30', actor: 'M.Reddy', action: 'runbook_created', target: 'Month-End Close Runbook', details: 'New runbook published', status: 'success' },
]

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActionIcon(action: string) {
  switch (action) {
    case 'source_sync': return RefreshCw
    case 'source_added': 
    case 'article_created':
    case 'runbook_created':
      return Plus
    case 'source_paused':
    case 'settings_changed':
      return Settings
    case 'article_updated':
    case 'zobject_updated':
      return Edit
    case 'article_deleted': return Trash2
    case 'quality_scan': return Shield
    case 'duplicate_detected': return Eye
    default: return FileText
  }
}

function getActionLabel(action: string): string {
  switch (action) {
    case 'source_sync': return 'Source Sync'
    case 'source_added': return 'Source Added'
    case 'source_paused': return 'Source Paused'
    case 'article_created': return 'Article Created'
    case 'article_updated': return 'Article Updated'
    case 'article_deleted': return 'Article Deleted'
    case 'zobject_updated': return 'Z-Object Updated'
    case 'runbook_created': return 'Runbook Created'
    case 'settings_changed': return 'Settings Changed'
    case 'quality_scan': return 'Quality Scan'
    case 'duplicate_detected': return 'Duplicate Found'
    default: return action
  }
}

export default function KBAdminAuditPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  
  const filteredEvents = KB_AUDIT_EVENTS.filter(event => {
    const matchesSearch = event.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'all' || event.action.includes(actionFilter)
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesAction && matchesStatus
  })
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/knowledge-center/admin" className="hover:text-foreground">KB Admin</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Audit Log</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link href="/knowledge-center/admin">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="page-title">KB Audit Log</h1>
                  <p className="page-description mt-1">
                    Track all KB administration activities
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="sync">Sync</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card padding="flush">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Time</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map(event => {
                    const Icon = getActionIcon(event.action)
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {event.actor === 'System' ? 'SY' : event.actor.split('.').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{event.actor}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getActionLabel(event.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{event.target}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                          {event.details}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn(
                              event.status === 'success' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                              event.status === 'warning' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                              event.status === 'error' && 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            )}
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
