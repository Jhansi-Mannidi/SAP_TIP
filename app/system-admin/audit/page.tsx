'use client'

import * as React from 'react'
import {
  History,
  Search,
  Filter,
  User,
  Server,
  Database,
  Key,
  Users,
  Bot,
  Shield,
  Puzzle,
  ScrollText,
  Settings,
  Plus,
  Trash2,
  Edit,
  ToggleRight,
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Entity types for filtering
const ENTITY_TYPES = [
  { id: 'system', label: 'SAP Systems', icon: Server },
  { id: 'client', label: 'Clients', icon: Database },
  { id: 'ntu', label: 'NTUs', icon: Key },
  { id: 'role', label: 'Service Roles', icon: Users },
  { id: 'agent', label: 'AI Agents', icon: Bot },
  { id: 'idp', label: 'Identity Providers', icon: Shield },
  { id: 'integration', label: 'Integrations', icon: Puzzle },
  { id: 'policy', label: 'Policies', icon: ScrollText },
]

// Action types
const ACTION_TYPES = [
  { id: 'create', label: 'Created', icon: Plus, color: 'text-emerald-600' },
  { id: 'update', label: 'Updated', icon: Edit, color: 'text-blue-600' },
  { id: 'delete', label: 'Deleted', icon: Trash2, color: 'text-rose-600' },
  { id: 'enable', label: 'Enabled', icon: ToggleRight, color: 'text-emerald-600' },
  { id: 'disable', label: 'Disabled', icon: ToggleRight, color: 'text-amber-600' },
  { id: 'sync', label: 'Synced', icon: RefreshCw, color: 'text-indigo-600' },
]

// Mock audit events
const MOCK_CONFIG_AUDIT: Array<{
  id: string
  timestamp: string
  actor: { name: string; email: string; role: string }
  entityType: string
  entityId: string
  entityName: string
  action: string
  changes?: { field: string; oldValue: string; newValue: string }[]
  ipAddress: string
}> = [
  {
    id: 'ca_1',
    timestamp: '2026-05-07T14:30:00+05:30',
    actor: { name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Admin' },
    entityType: 'policy',
    entityId: 'pol_11',
    entityName: 'Auto-Promotion Threshold',
    action: 'disable',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'ca_2',
    timestamp: '2026-05-07T11:15:00+05:30',
    actor: { name: 'J.Rao', email: 'j.rao@starcement.com', role: 'Lead' },
    entityType: 'integration',
    entityId: 'int_6',
    entityName: 'Slack',
    action: 'sync',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'ca_3',
    timestamp: '2026-05-07T09:00:00+05:30',
    actor: { name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Engineer' },
    entityType: 'ntu',
    entityId: 'ntu_4',
    entityName: 'NTU_BATCH_USER',
    action: 'create',
    changes: [
      { field: 'username', oldValue: '', newValue: 'BATCH_USER' },
      { field: 'client', oldValue: '', newValue: '100' },
    ],
    ipAddress: '192.168.1.110',
  },
  {
    id: 'ca_4',
    timestamp: '2026-05-06T16:45:00+05:30',
    actor: { name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Admin' },
    entityType: 'system',
    entityId: 'sys_1',
    entityName: 'STA (Star Cement S/4)',
    action: 'update',
    changes: [
      { field: 'health_check_interval', oldValue: '5min', newValue: '2min' },
    ],
    ipAddress: '192.168.1.100',
  },
  {
    id: 'ca_5',
    timestamp: '2026-05-06T14:20:00+05:30',
    actor: { name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Engineer' },
    entityType: 'role',
    entityId: 'role_5',
    entityName: 'Batch Processing',
    action: 'create',
    ipAddress: '192.168.1.115',
  },
  {
    id: 'ca_6',
    timestamp: '2026-05-06T10:30:00+05:30',
    actor: { name: 'J.Rao', email: 'j.rao@starcement.com', role: 'Lead' },
    entityType: 'agent',
    entityId: 'agent_1',
    entityName: 'Healing Agent',
    action: 'update',
    changes: [
      { field: 'confidence_threshold', oldValue: '80', newValue: '85' },
    ],
    ipAddress: '192.168.1.105',
  },
  {
    id: 'ca_7',
    timestamp: '2026-05-05T17:00:00+05:30',
    actor: { name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Engineer' },
    entityType: 'client',
    entityId: 'cli_5',
    entityName: 'STA-300',
    action: 'create',
    ipAddress: '192.168.1.120',
  },
  {
    id: 'ca_8',
    timestamp: '2026-05-05T14:30:00+05:30',
    actor: { name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Admin' },
    entityType: 'policy',
    entityId: 'pol_9',
    entityName: 'Auto-Heal Confidence Threshold',
    action: 'update',
    changes: [
      { field: 'min_confidence', oldValue: '80', newValue: '85' },
      { field: 'require_human_review_below', oldValue: '65', newValue: '70' },
    ],
    ipAddress: '192.168.1.100',
  },
  {
    id: 'ca_9',
    timestamp: '2026-05-05T11:00:00+05:30',
    actor: { name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Engineer' },
    entityType: 'integration',
    entityId: 'int_9',
    entityName: 'Custom Webhook',
    action: 'update',
    changes: [
      { field: 'endpoints', oldValue: '2', newValue: '3' },
    ],
    ipAddress: '192.168.1.110',
  },
  {
    id: 'ca_10',
    timestamp: '2026-05-04T16:20:00+05:30',
    actor: { name: 'J.Rao', email: 'j.rao@starcement.com', role: 'Lead' },
    entityType: 'idp',
    entityId: 'idp_1',
    entityName: 'Azure AD',
    action: 'sync',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'ca_11',
    timestamp: '2026-05-04T10:00:00+05:30',
    actor: { name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Admin' },
    entityType: 'ntu',
    entityId: 'ntu_2',
    entityName: 'NTU_QA_USER',
    action: 'update',
    changes: [
      { field: 'password_rotated', oldValue: 'false', newValue: 'true' },
    ],
    ipAddress: '192.168.1.100',
  },
  {
    id: 'ca_12',
    timestamp: '2026-05-03T15:45:00+05:30',
    actor: { name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Engineer' },
    entityType: 'system',
    entityId: 'sys_3',
    entityName: 'PRD (Star Cement Prod)',
    action: 'update',
    changes: [
      { field: 'status', oldValue: 'maintenance', newValue: 'active' },
    ],
    ipAddress: '192.168.1.115',
  },
]

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function getEntityIcon(entityType: string) {
  const type = ENTITY_TYPES.find(t => t.id === entityType)
  return type?.icon || Settings
}

function getActionInfo(action: string) {
  return ACTION_TYPES.find(a => a.id === action) || ACTION_TYPES[1]
}

export default function ConfigAuditPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [entityFilter, setEntityFilter] = React.useState<string>('all')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [timeFilter, setTimeFilter] = React.useState<string>('7d')

  const filteredEvents = MOCK_CONFIG_AUDIT.filter(event => {
    const matchesSearch = event.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEntity = entityFilter === 'all' || event.entityType === entityFilter
    const matchesAction = actionFilter === 'all' || event.action === actionFilter
    return matchesSearch && matchesEntity && matchesAction
  })

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div>
              <h1 className="page-title">Configuration Audit Trail</h1>
              <p className="page-description mt-1">
                Complete history of all configuration changes across SAP systems, integrations, and policies.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by entity or actor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {ENTITY_TYPES.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {ACTION_TYPES.map(action => (
                    <SelectItem key={action.id} value={action.id}>{action.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden lg:table-cell">Changes</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const EntityIcon = getEntityIcon(event.entityType)
                  const actionInfo = getActionInfo(event.action)
                  const ActionIcon = actionInfo.icon

                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-sm">{formatRelativeTime(event.timestamp)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {new Date(event.timestamp).toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-muted">
                              {event.actor.name.split('.').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{event.actor.name}</p>
                            <p className="caption-text">{event.actor.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-muted">
                            <EntityIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{event.entityName}</p>
                            <Badge variant="secondary" className="text-xs">
                              {ENTITY_TYPES.find(t => t.id === event.entityType)?.label}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <ActionIcon className={cn("h-3.5 w-3.5", actionInfo.color)} />
                          <span className={cn("text-sm font-medium", actionInfo.color)}>
                            {actionInfo.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {event.changes && event.changes.length > 0 ? (
                          <div className="space-y-1">
                            {event.changes.slice(0, 2).map((change, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="text-muted-foreground">{change.field}:</span>{' '}
                                {change.oldValue && (
                                  <>
                                    <span className="line-through text-rose-500">{change.oldValue}</span>
                                    <span className="mx-1">→</span>
                                  </>
                                )}
                                <span className="text-emerald-600">{change.newValue}</span>
                              </div>
                            ))}
                            {event.changes.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{event.changes.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs text-muted-foreground">{event.ipAddress}</code>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>

          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No audit events found</h3>
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
