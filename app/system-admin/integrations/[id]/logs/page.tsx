'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatRelativeTime } from '@/lib/utils'
import {
  getIntegrationById,
  getSyncLogsForIntegration,
} from '@/lib/integrations-mock-data'

const STATUS_PILL = {
  success: 'pill pill-success',
  warning: 'pill pill-warning',
  failed: 'pill pill-danger',
}

export default function IntegrationLogsPage() {
  const params = useParams()
  const id = params.id as string
  const integration = getIntegrationById(id)
  const logs = integration ? getSyncLogsForIntegration(integration.id) : []

  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin/integrations" className="hover:text-foreground transition-colors">
                Integrations Hub
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              {integration && (
                <>
                  <Link
                    href={`/system-admin/integrations/${integration.id}/configure`}
                    className="hover:text-foreground transition-colors"
                  >
                    {integration.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </>
              )}
              <span className="font-medium text-foreground">Sync Logs</span>
            </div>
            <PageHeader
              title={integration ? `${integration.name} — Sync Logs` : 'Sync Logs'}
              description="Append-only history of inbound and outbound sync operations."
              actions={
                integration ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/system-admin/integrations/${integration.id}/configure`}>
                      Configure
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {integration ? (
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Direction</TableHead>
                      <TableHead className="hidden md:table-cell">Operation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Records</TableHead>
                      <TableHead className="text-right hidden lg:table-cell">Duration</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'gap-1 text-[10px] h-5',
                                log.direction === 'inbound'
                                  ? 'border-blue-500/30 bg-blue-500/[0.06]'
                                  : 'border-brand/30 bg-brand/[0.06]',
                              )}
                            >
                              {log.direction === 'inbound' ? (
                                <ArrowDownLeft className="h-3 w-3" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3" />
                              )}
                              {log.direction}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs">
                            {log.operation}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('h-5 text-[10px] border-0', STATUS_PILL[log.status])}>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell tabular-nums">
                            {log.records}
                          </TableCell>
                          <TableCell className="text-right hidden lg:table-cell tabular-nums text-xs">
                            {log.duration_ms}ms
                          </TableCell>
                          <TableCell className="text-right caption-text whitespace-nowrap">
                            {formatRelativeTime(log.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          No sync logs yet. Run a sync from the Integrations Hub.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {logs.length > 0 && (
                <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
                  Latest: {logs[0].message}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="section-title">Integration not found</p>
              <Button asChild className="mt-4">
                <Link href="/system-admin/integrations">Back to Hub</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
