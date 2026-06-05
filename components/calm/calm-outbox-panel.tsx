'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Inbox, Search, RefreshCw, RotateCcw } from 'lucide-react'

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { MOCK_OUTBOX, OUTBOX_STATE_PILLS, type OutboxOperation } from '@/lib/calm-mock-data'

export function CalmOutboxPanel() {
  const [search, setSearch] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState('all')

  const filtered = MOCK_OUTBOX.filter((e) => {
    if (
      search &&
      !e.idempotency_key.toLowerCase().includes(search.toLowerCase()) &&
      !e.payload_summary.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (stateFilter !== 'all' && e.state !== stateFilter) return false
    return true
  })

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-border/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="section-title">Transactional Outbox</h2>
            <p className="section-description mt-0.5">
              Durable outbound queue with idempotency keys and bounded retry — at-least-once delivery
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 shrink-0">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Drain Queue
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search idempotency key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 bg-background">
              <Inbox className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CLAIMED">Claimed</SelectItem>
              <SelectItem value="DISPATCHED">Dispatched</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="DEAD_LETTER">Dead Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Operation</TableHead>
              <TableHead className="hidden md:table-cell">Idempotency Key</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-center">Attempts</TableHead>
              <TableHead className="hidden lg:table-cell">Next Retry</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <OperationBadge op={entry.operation} />
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-[200px] sm:max-w-none">
                      {entry.payload_summary}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-[10px] max-w-[180px] truncate">
                  {entry.idempotency_key}
                </TableCell>
                <TableCell className="text-xs">{entry.tenant_name}</TableCell>
                <TableCell>
                  <Badge className={cn('h-5 text-[10px] border-0', OUTBOX_STATE_PILLS[entry.state])}>
                    {entry.state.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-center tabular-nums text-sm">{entry.attempts}</TableCell>
                <TableCell className="hidden lg:table-cell caption-text">
                  {entry.next_attempt_at ? formatRelativeTime(entry.next_attempt_at) : '—'}
                </TableCell>
                <TableCell>
                  {(entry.state === 'FAILED' || entry.state === 'DEAD_LETTER') && (
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}

function OperationBadge({ op }: { op: OutboxOperation }) {
  const labels: Record<OutboxOperation, string> = {
    RAISE_DEFECT: 'Raise Defect',
    UPDATE_DEFECT: 'Update Defect',
    UPDATE_REQUIREMENT_STATUS: 'Update Requirement',
    ATTACH_EVIDENCE: 'Attach Evidence',
    UPDATE_TASK_STATUS: 'Update Task',
  }
  return (
    <Badge variant="outline" className="text-[10px] h-5 font-mono">
      {labels[op]}
    </Badge>
  )
}
