'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { History, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
import { MOCK_SYNC_LOG, SYNC_STATE_PILLS } from '@/lib/calm-mock-data'

export function CalmSyncLogPanel() {
  const [search, setSearch] = React.useState('')
  const [directionFilter, setDirectionFilter] = React.useState('all')

  const filtered = MOCK_SYNC_LOG.filter((e) => {
    if (
      search &&
      !e.operation.toLowerCase().includes(search.toLowerCase()) &&
      !e.correlation_id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (directionFilter !== 'all' && e.direction !== directionFilter) return false
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
        <div>
          <h2 className="section-title">Sync Log</h2>
          <p className="section-description mt-0.5">
            Append-only history of inbound served and outbound CALM API interactions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search operation or correlation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Select value={directionFilter} onValueChange={setDirectionFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 bg-background">
              <History className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Directions</SelectItem>
              <SelectItem value="INBOUND">Inbound</SelectItem>
              <SelectItem value="OUTBOUND">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Direction</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">Operation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead className="hidden lg:table-cell">Correlation</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1 text-[10px] h-5',
                      entry.direction === 'INBOUND'
                        ? 'border-blue-500/30 bg-blue-500/[0.06]'
                        : 'border-brand/30 bg-brand/[0.06]',
                    )}
                  >
                    {entry.direction === 'INBOUND' ? (
                      <ArrowDownLeft className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {entry.direction}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-[10px] sm:text-xs">{entry.service}</TableCell>
                <TableCell className="hidden md:table-cell text-xs max-w-[220px] truncate">
                  {entry.operation}
                </TableCell>
                <TableCell>
                  <Badge className={cn('h-5 text-[10px] border-0', SYNC_STATE_PILLS[entry.status])}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell tabular-nums text-xs">
                  {entry.duration_ms}ms
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono text-[10px]">
                  {entry.correlation_id}
                </TableCell>
                <TableCell className="text-right caption-text whitespace-nowrap">
                  {formatRelativeTime(entry.occurred_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
