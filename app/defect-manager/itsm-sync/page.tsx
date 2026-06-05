'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Settings,
  Wifi,
  WifiOff,
  Clock,
  Layers,
} from 'lucide-react'
import {
  MOCK_ITSM_CONNECTIONS,
  MOCK_FAILED_SYNCS,
  type ITSMConnection,
} from '@/lib/defect-mock-data'

function conformanceTone(percent: number, connected: boolean) {
  if (!connected) return 'from-muted-foreground/25 to-muted-foreground/15'
  if (percent === 100) return 'from-emerald-500 to-emerald-400'
  if (percent >= 90) return 'from-brand to-[#d4a04a]'
  if (percent >= 80) return 'from-amber-500 to-amber-400'
  return 'from-red-500 to-red-400'
}

function conformanceTextTone(percent: number, connected: boolean) {
  if (!connected) return 'text-muted-foreground'
  if (percent === 100) return 'text-emerald-600 dark:text-emerald-400'
  if (percent >= 90) return 'text-brand'
  if (percent >= 80) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function ConformanceProgress({
  value,
  connected = true,
  className,
}: {
  value: number
  connected?: boolean
  className?: string
}) {
  return (
    <div className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-muted', className)}>
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r', conformanceTone(value, connected))}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      />
    </div>
  )
}

function ITSMCard({ connection }: { connection: ITSMConnection }) {
  const typeLabels = {
    servicenow: 'ServiceNow',
    jira: 'Jira Software',
    sap_charm: 'SAP ChaRM',
  }

  const conformancePercent =
    connection.mapped_fields > 0
      ? Math.round((connection.conformant_fields / connection.mapped_fields) * 100)
      : 0

  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="h-full flex flex-col shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  'h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset',
                  connection.connected
                    ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 ring-red-500/20',
                )}
              >
                {connection.connected ? (
                  <Wifi className="h-5 w-5" />
                ) : (
                  <WifiOff className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <CardTitle className="card-title-text line-clamp-2">{connection.name}</CardTitle>
                <CardDescription className="mt-0.5">{typeLabels[connection.type]}</CardDescription>
              </div>
            </div>
            <Badge
              className={cn(
                'shrink-0 h-6 text-[11px]',
                connection.connected
                  ? 'pill pill-success'
                  : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
              )}
            >
              {connection.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Last Sync', value: formatRelativeTime(connection.last_sync) },
              { label: 'Queue Depth', value: `${connection.queue_depth} items` },
              {
                label: 'Sync Errors',
                value: String(connection.sync_errors),
                danger: connection.sync_errors > 0,
              },
              { label: 'Field Mappings', value: String(connection.mapped_fields) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5"
              >
                <p className="micro-label normal-case tracking-normal font-medium">{item.label}</p>
                <p
                  className={cn(
                    'text-sm font-medium mt-1',
                    item.danger && 'text-red-600 dark:text-red-400',
                  )}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mapping Conformance</span>
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  conformanceTextTone(conformancePercent, connection.connected),
                )}
              >
                {conformancePercent}%
              </span>
            </div>
            <ConformanceProgress
              value={conformancePercent}
              connected={connection.connected}
            />
            <p className="caption-text">
              {connection.conformant_fields} of {connection.mapped_fields} fields conformant
            </p>
          </div>

          <div className="mt-auto flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" disabled={!connection.connected}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ITSMSyncPage() {
  const connections = MOCK_ITSM_CONNECTIONS
  const failedSyncs = MOCK_FAILED_SYNCS

  const totalConnected = connections.filter((c) => c.connected).length
  const totalErrors = connections.reduce((sum, c) => sum + c.sync_errors, 0)
  const totalQueueDepth = connections.reduce((sum, c) => sum + c.queue_depth, 0)
  const totalMappings = connections.reduce((s, c) => s + c.mapped_fields, 0)

  return (
    <AppShell currentApp="defect-manager">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title="ITSM Sync Status"
              description="External system synchronization health and configuration"
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Resync All
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-2">
                    <Link href="/configuration/itsm">
                      <Settings className="h-4 w-4" />
                      Edit Mappings
                    </Link>
                  </Button>
                </div>
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
          <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-3 w-full items-stretch" fast>
            <KpiStatCard
              label="Connected"
              value={totalConnected}
              icon={CheckCircle}
              tone="success"
              hint={`of ${connections.length} systems`}
              className="min-h-[6.5rem]"
            />
            <KpiStatCard
              label="In Queue"
              value={totalQueueDepth}
              icon={Clock}
              tone="warning"
              className="min-h-[6.5rem]"
            />
            <KpiStatCard
              label="Sync Errors"
              value={totalErrors}
              icon={XCircle}
              tone="danger"
              className="min-h-[6.5rem]"
            />
            <KpiStatCard
              label="Field Mappings"
              value={totalMappings}
              icon={Layers}
              tone="brand"
              className="min-h-[6.5rem]"
            />
          </StaggerGrid>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full items-stretch">
            {connections.map((connection) => (
              <ITSMCard key={connection.id} connection={connection} />
            ))}
          </div>

          {failedSyncs.length > 0 && (
            <Card className="shadow-[var(--shadow-xs)]">
              <CardHeader>
                <CardTitle className="section-title text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Failed Sync Items ({failedSyncs.length})
                </CardTitle>
                <CardDescription>Items that failed to sync and require attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Defect</TableHead>
                      <TableHead>ITSM</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Retry Count</TableHead>
                      <TableHead>Last Attempt</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedSyncs.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Link
                            href={`/defect-manager/defects/${item.defect_code}`}
                            className="font-mono text-sm text-brand hover:underline"
                          >
                            {item.defect_code}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-[11px]">
                            {item.itsm_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <span className="text-sm text-muted-foreground truncate block">
                            {item.reason}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.retry_count >= 3 ? 'destructive' : 'secondary'}
                            className="text-[11px]"
                          >
                            {item.retry_count} retries
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatRelativeTime(item.last_attempt)}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Resync
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-[var(--shadow-xs)]">
            <CardHeader>
              <CardTitle className="section-title text-base">Field Mapping Conformance</CardTitle>
              <CardDescription>Per-ITSM field mapping status and conformance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {connections.map((connection) => {
                  const conformancePercent =
                    connection.mapped_fields > 0
                      ? Math.round(
                          (connection.conformant_fields / connection.mapped_fields) * 100,
                        )
                      : 0

                  return (
                    <div key={connection.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="w-full sm:w-44 shrink-0">
                        <p className="text-sm font-medium truncate">{connection.name}</p>
                        <p className="caption-text capitalize">{connection.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <ConformanceProgress
                          value={conformancePercent}
                          connected={connection.connected}
                          className="h-3"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            'text-sm font-semibold tabular-nums min-w-[3rem] text-right',
                            conformanceTextTone(conformancePercent, connection.connected),
                          )}
                        >
                          {connection.conformant_fields}/{connection.mapped_fields}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
