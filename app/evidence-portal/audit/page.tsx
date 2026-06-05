'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, formatRelativeTime } from '@/lib/utils'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp, AnimatedNumber } from '@/lib/animations'
import {
  Search,
  Filter,
  Download,
  Shield,
  FileText,
  Upload,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Bot,
} from 'lucide-react'

// Mock audit log entries
const MOCK_AUDIT_LOG = [
  {
    id: 'AUD-001',
    action: 'evidence_uploaded',
    description: 'Screenshot evidence uploaded for Order to Cash test',
    actor: { name: 'Alex Chen', initials: 'AC', type: 'human' },
    timestamp: '2024-01-15T14:30:00Z',
    entity: 'Evidence Bundle',
    entityId: 'EVB-001',
    details: { fileName: 'order_confirmation.png', size: '1.2 MB' },
  },
  {
    id: 'AUD-002',
    action: 'signoff_approved',
    description: 'Sign-off request approved for P2P Integration Test',
    actor: { name: 'Sarah Johnson', initials: 'SJ', type: 'human' },
    timestamp: '2024-01-15T13:15:00Z',
    entity: 'Sign-Off Request',
    entityId: 'SOR-002',
    details: { comment: 'All test criteria met' },
  },
  {
    id: 'AUD-003',
    action: 'evidence_generated',
    description: 'Auto-generated test evidence for regression suite',
    actor: { name: 'Executor Agent', initials: 'EA', type: 'agent' },
    timestamp: '2024-01-15T12:00:00Z',
    entity: 'Evidence Bundle',
    entityId: 'EVB-003',
    details: { screenshots: 24, logs: 8 },
  },
  {
    id: 'AUD-004',
    action: 'signoff_rejected',
    description: 'Sign-off request rejected for HR Performance Test',
    actor: { name: 'James Lee', initials: 'JL', type: 'human' },
    timestamp: '2024-01-15T11:45:00Z',
    entity: 'Sign-Off Request',
    entityId: 'SOR-004',
    details: { reason: 'Performance thresholds not met' },
  },
  {
    id: 'AUD-005',
    action: 'bundle_created',
    description: 'New evidence bundle created for Finance module',
    actor: { name: 'Tom Wilson', initials: 'TW', type: 'human' },
    timestamp: '2024-01-15T10:30:00Z',
    entity: 'Evidence Bundle',
    entityId: 'EVB-005',
    details: { migration: 'Star Cement S/4HANA' },
  },
  {
    id: 'AUD-006',
    action: 'evidence_deleted',
    description: 'Obsolete evidence file removed',
    actor: { name: 'Maria Garcia', initials: 'MG', type: 'human' },
    timestamp: '2024-01-15T09:00:00Z',
    entity: 'Evidence File',
    entityId: 'EVF-012',
    details: { fileName: 'old_screenshot.png', reason: 'Superseded by new evidence' },
  },
  {
    id: 'AUD-007',
    action: 'signoff_requested',
    description: 'New sign-off request submitted for O2C Test Pack',
    actor: { name: 'Alex Chen', initials: 'AC', type: 'human' },
    timestamp: '2024-01-14T16:00:00Z',
    entity: 'Sign-Off Request',
    entityId: 'SOR-001',
    details: { approvers: ['Sarah Johnson', 'Mike Peters'] },
  },
  {
    id: 'AUD-008',
    action: 'bundle_exported',
    description: 'Evidence bundle exported for audit compliance',
    actor: { name: 'Emily Brown', initials: 'EB', type: 'human' },
    timestamp: '2024-01-14T14:30:00Z',
    entity: 'Evidence Bundle',
    entityId: 'EVB-002',
    details: { format: 'PDF', pages: 45 },
  },
]

export default function EvidenceAuditPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState('all')
  const [actorFilter, setActorFilter] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('7d')

  // Filter logic
  const filteredLog = MOCK_AUDIT_LOG.filter(entry => {
    if (searchQuery && !entry.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (actionFilter !== 'all' && entry.action !== actionFilter) return false
    if (actorFilter !== 'all' && entry.actor.type !== actorFilter) return false
    return true
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'evidence_uploaded':
        return <Upload className="h-4 w-4 text-blue-500" />
      case 'evidence_generated':
        return <Bot className="h-4 w-4 text-violet-500" />
      case 'evidence_deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />
      case 'signoff_approved':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case 'signoff_rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'signoff_requested':
        return <Clock className="h-4 w-4 text-amber-500" />
      case 'bundle_created':
        return <FileText className="h-4 w-4 text-primary" />
      case 'bundle_exported':
        return <Download className="h-4 w-4 text-teal-500" />
      default:
        return <Edit className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getActionBadge = (action: string) => {
    const labels: Record<string, string> = {
      'evidence_uploaded': 'Upload',
      'evidence_generated': 'Generated',
      'evidence_deleted': 'Deleted',
      'signoff_approved': 'Approved',
      'signoff_rejected': 'Rejected',
      'signoff_requested': 'Requested',
      'bundle_created': 'Created',
      'bundle_exported': 'Exported',
    }
    return labels[action] || action
  }

  return (
    <AppShell currentApp="evidence-portal">
      <div className="space-y-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">Audit Log</h1>
            <p className="page-description">
              Complete audit trail of all evidence and sign-off activities
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="evidence_uploaded">Upload</SelectItem>
                    <SelectItem value="evidence_generated">Generated</SelectItem>
                    <SelectItem value="evidence_deleted">Deleted</SelectItem>
                    <SelectItem value="signoff_approved">Approved</SelectItem>
                    <SelectItem value="signoff_rejected">Rejected</SelectItem>
                    <SelectItem value="signoff_requested">Requested</SelectItem>
                    <SelectItem value="bundle_created">Created</SelectItem>
                    <SelectItem value="bundle_exported">Exported</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={actorFilter} onValueChange={setActorFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Actor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actors</SelectItem>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="card-bleed-x card-bleed-b">
            <motion.div
              className="divide-y"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredLog.map((entry) => (
                <motion.div
                  key={entry.id}
                  variants={staggerItem}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 rounded-full bg-muted">
                      {getActionIcon(entry.action)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getActionBadge(entry.action)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {entry.entity} • {entry.entityId}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{entry.description}</p>
                    {entry.details && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(entry.details).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            <span className="capitalize">{key.replace('_', ' ')}:</span> {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className={cn(
                          'h-5 w-5',
                          entry.actor.type === 'agent' && 'bg-violet-500/10'
                        )}>
                          <AvatarFallback className="text-[10px]">
                            {entry.actor.type === 'agent' ? <Bot className="h-3 w-3" /> : entry.actor.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{entry.actor.name}</span>
                        {entry.actor.type === 'agent' && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4">Agent</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(entry.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* No Results */}
        {filteredLog.length === 0 && (
          <Card>
            <CardContent className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No audit entries found</h3>
              <p className="page-description mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setActionFilter('all')
                  setActorFilter('all')
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredLog.length} of {MOCK_AUDIT_LOG.length} entries
        </div>
      </div>
    </AppShell>
  )
}
