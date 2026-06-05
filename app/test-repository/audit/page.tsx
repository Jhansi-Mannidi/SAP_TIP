'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  History,
  Search,
  Filter,
  ArrowUpDown,
  Shield,
  Check,
  Layers,
  FileText,
  ClipboardCheck,
  Package,
  Zap,
  Database,
  FileCode2,
  X,
  Calendar,
  Download,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { 
  MOCK_REPOSITORY_AUDIT, 
  type RepositoryAuditEvent,
  type RepositoryEntityClass,
} from '@/lib/mock-data'

// Entity class icons
const entityIcons: Record<RepositoryEntityClass, React.ElementType> = {
  Suite: Layers,
  Scenario: FileText,
  Case: ClipboardCheck,
  Pack: Package,
  Promotion: Zap,
  Fixture: Database,
  IR: FileCode2,
}

const entityColors: Record<RepositoryEntityClass, string> = {
  Suite: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Scenario: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Case: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pack: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Promotion: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Fixture: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  IR: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
}

// Get entity link based on class
function getEntityLink(entityClass: RepositoryEntityClass, entityId: string): string {
  switch (entityClass) {
    case 'Suite':
      return `/test-repository/suites/${entityId}`
    case 'Scenario':
      return `/test-repository/scenarios/${entityId}`
    case 'Case':
      return `/test-repository/tasks/${entityId}`
    case 'Pack':
      return `/test-repository/packs/${entityId}`
    case 'Promotion':
      return `/defect-manager/healing-promotions/${entityId}`
    case 'Fixture':
      return `/test-repository/data/${entityId}`
    case 'IR':
      return `/test-repository/ir/${entityId}`
    default:
      return '#'
  }
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date('2026-05-07T16:00:00+05:30')
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Signature status badge
function SignatureStatusBadge({ status }: { status: RepositoryAuditEvent['signatureStatus'] }) {
  if (status === 'verified') {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
        <Shield className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }
  
  if (status === 'signed') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
        <Check className="h-3 w-3 mr-1" />
        Signed
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
      Unsigned
    </Badge>
  )
}

// Action badge
function ActionBadge({ action }: { action: string }) {
  const actionColors: Record<string, string> = {
    created: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    status_changed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    field_updated: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    version_incremented: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    version_released: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    distributed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  }
  
  const colorClass = actionColors[action] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
  
  return (
    <Badge variant="outline" className={cn('font-mono text-xs border-0', colorClass)}>
      {action.replace(/_/g, ' ')}
    </Badge>
  )
}

export default function RepositoryAuditTrailPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [entityFilter, setEntityFilter] = React.useState<string>('all')
  const [actorFilter, setActorFilter] = React.useState<string>('all')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [timeRange, setTimeRange] = React.useState<string>('30d')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  
  // Get unique actors
  const actors = React.useMemo(() => {
    const unique = new Map<string, string>()
    MOCK_REPOSITORY_AUDIT.forEach(e => unique.set(e.actor.id, e.actor.name))
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
  }, [])
  
  // Get unique actions
  const actions = React.useMemo(() => {
    const unique = new Set(MOCK_REPOSITORY_AUDIT.map(e => e.action))
    return Array.from(unique).sort()
  }, [])
  
  // Filter events
  const filteredEvents = React.useMemo(() => {
    let filtered = [...MOCK_REPOSITORY_AUDIT]
    
    // Time range filter
    const now = new Date('2026-05-07T16:00:00+05:30')
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    filtered = filtered.filter(e => new Date(e.timestamp) >= cutoff)
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => 
        e.actor.name.toLowerCase().includes(query) ||
        e.entityName.toLowerCase().includes(query) ||
        e.action.toLowerCase().includes(query) ||
        e.fieldChanged?.toLowerCase().includes(query)
      )
    }
    
    // Entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(e => e.entityClass === entityFilter)
    }
    
    // Actor filter
    if (actorFilter !== 'all') {
      filtered = filtered.filter(e => e.actor.id === actorFilter)
    }
    
    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(e => e.action === actionFilter)
    }
    
    // Sort
    return filtered.sort((a, b) => {
      const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [searchQuery, entityFilter, actorFilter, actionFilter, timeRange, sortOrder])
  
  const hasFilters = searchQuery || entityFilter !== 'all' || actorFilter !== 'all' || actionFilter !== 'all'
  
  const clearFilters = () => {
    setSearchQuery('')
    setEntityFilter('all')
    setActorFilter('all')
    setActionFilter('all')
  }
  
  // Stats
  const stats = React.useMemo(() => {
    const byEntity: Record<string, number> = {}
    filteredEvents.forEach(e => {
      byEntity[e.entityClass] = (byEntity[e.entityClass] || 0) + 1
    })
    return byEntity
  }, [filteredEvents])

  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <History className="h-6 w-6 text-indigo-600" />
                  Repository Audit Trail
                </h1>
                <p className="page-description mt-1 max-w-2xl">
                  Complete audit history of all Test Repository entities with cryptographic signatures.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 sm:grid-cols-4 lg:grid-cols-7" className="gap-2 mt-4" fast>
              {(['Suite', 'Scenario', 'Case', 'Pack', 'Promotion', 'Fixture', 'IR'] as RepositoryEntityClass[]).map(entityClass => {
                const Icon = entityIcons[entityClass]
                const count = stats[entityClass] || 0
                return (
                  <Card 
                    key={entityClass} 
                    className={cn(
                      'cursor-pointer transition-all',
                      entityFilter === entityClass && 'ring-2 ring-indigo-500'
                    )}
                    onClick={() => setEntityFilter(entityFilter === entityClass ? 'all' : entityClass)}
                  >
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1.5 rounded', entityColors[entityClass])}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">{count}</p>
                          <p className="page-description text-[10px]">{entityClass}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </StaggerGrid>
          </div>
          
          {/* Filters */}
          <div className="px-4 md:px-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                {actors.map(actor => (
                  <SelectItem key={actor.id} value={actor.id}>{actor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>{action.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="hidden sm:flex"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </Button>
            
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[140px]">Timestamp</TableHead>
                    <TableHead className="w-[180px]">Actor</TableHead>
                    <TableHead className="w-[250px]">Entity</TableHead>
                    <TableHead className="w-[140px]">Action</TableHead>
                    <TableHead className="w-[120px]">Field</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead className="w-[100px] text-center">Signature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No audit events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => {
                      const EntityIcon = entityIcons[event.entityClass]
                      return (
                        <TableRow key={event.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">
                            <div className="flex flex-col">
                              <span>{formatRelativeTime(event.timestamp)}</span>
                              <span className="text-muted-foreground text-[10px]">
                                {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                                  {event.actor.name.split('.').map(n => n[0]?.toUpperCase()).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{event.actor.name}</p>
                                <p className="page-description text-[10px] truncate">{event.actor.role}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={cn('p-1 rounded', entityColors[event.entityClass])}>
                                <EntityIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0">
                                <Link 
                                  href={getEntityLink(event.entityClass, event.entityId)}
                                  className="text-sm font-medium text-indigo-600 hover:underline truncate block dark:text-indigo-400"
                                >
                                  {event.entityName}
                                </Link>
                                <p className="page-description text-[10px]">{event.entityClass}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <ActionBadge action={event.action} />
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {event.fieldChanged || '-'}
                          </TableCell>
                          <TableCell>
                            {event.oldValue ? (
                              <code className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded dark:bg-red-900/30 dark:text-red-400">
                                {event.oldValue.length > 20 
                                  ? `${event.oldValue.slice(0, 20)}...` 
                                  : event.oldValue}
                              </code>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {event.newValue ? (
                              <code className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded dark:bg-emerald-900/30 dark:text-emerald-400">
                                {event.newValue.length > 20 
                                  ? `${event.newValue.slice(0, 20)}...` 
                                  : event.newValue}
                              </code>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <SignatureStatusBadge status={event.signatureStatus} />
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>Showing {filteredEvents.length} of {MOCK_REPOSITORY_AUDIT.length} events</span>
              <span className="text-xs">All events are cryptographically signed for compliance</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
