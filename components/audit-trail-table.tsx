'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpDown, Search, Check, Shield } from 'lucide-react'

export interface AuditEvent {
  id: string
  timestamp: string
  actor: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  action: string
  entityType: string
  entityId: string
  fieldChanged?: string
  oldValue?: string
  newValue?: string
  signatureStatus: 'signed' | 'unsigned' | 'verified'
  ipAddress?: string
}

interface AuditTrailTableProps {
  events?: AuditEvent[]
  className?: string
}

export function AuditTrailTable({ events = [], className }: AuditTrailTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  
  const actions = React.useMemo(() => {
    const unique = new Set(events.map(e => e.action))
    return Array.from(unique).sort()
  }, [events])
  
  const filteredEvents = React.useMemo(() => {
    let filtered = events
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => 
        e.actor.name.toLowerCase().includes(query) ||
        e.action.toLowerCase().includes(query) ||
        e.entityId.toLowerCase().includes(query) ||
        e.fieldChanged?.toLowerCase().includes(query)
      )
    }
    
    if (actionFilter !== 'all') {
      filtered = filtered.filter(e => e.action === actionFilter)
    }
    
    return filtered.sort((a, b) => {
      const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [events, searchQuery, actionFilter, sortOrder])
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {actions.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </Button>
      </div>
      
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[200px]">Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Field Changed</TableHead>
              <TableHead>Old Value</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead className="w-[100px] text-center">Signature</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No audit events found
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.actor.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {event.actor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{event.actor.name}</p>
                        <p className="caption-text truncate">{event.actor.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {event.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {event.fieldChanged || '-'}
                  </TableCell>
                  <TableCell>
                    {event.oldValue ? (
                      <code className="text-xs bg-red-500/10 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
                        {event.oldValue.length > 30 
                          ? `${event.oldValue.slice(0, 30)}...` 
                          : event.oldValue}
                      </code>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {event.newValue ? (
                      <code className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                        {event.newValue.length > 30 
                          ? `${event.newValue.slice(0, 30)}...` 
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Showing {filteredEvents.length} of {events.length} events
      </div>
    </div>
  )
}

function SignatureStatusBadge({ status }: { status: AuditEvent['signatureStatus'] }) {
  if (status === 'verified') {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
        <Shield className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }
  
  if (status === 'signed') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Check className="h-3 w-3 mr-1" />
        Signed
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
      Unsigned
    </Badge>
  )
}
