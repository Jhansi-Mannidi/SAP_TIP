'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  History,
  Shield,
  ShieldCheck,
  Users,
  Download,
  Search,
  Bot,
  User,
} from 'lucide-react'

import { KpiStatCard, StaggerGrid } from '@/components/design-system'
import { AuditTrailTable, type AuditEvent } from '@/components/audit-trail-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { getTestCaseAuditEvents } from '@/lib/mock-data'

interface TestCaseAuditPanelProps {
  testCaseId: string
  testCaseCode: string
  testCaseName: string
}

function formatAction(action: string): string {
  return action.replace(/_/g, ' ')
}

export function TestCaseAuditPanel({
  testCaseId,
  testCaseCode,
  testCaseName,
}: TestCaseAuditPanelProps) {
  const events = React.useMemo(
    () => getTestCaseAuditEvents(testCaseId) as AuditEvent[],
    [testCaseId],
  )

  const verifiedCount = events.filter((e) => e.signatureStatus === 'verified').length
  const signedCount = events.filter((e) => e.signatureStatus === 'signed').length
  const uniqueActors = new Set(events.map((e) => e.actor.id)).size
  const latest = events[0]

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-gradient-to-br from-brand/[0.06] via-card to-card p-4 sm:p-5 shadow-[var(--shadow-xs)]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center shrink-0">
              <History className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="section-title">Audit Trail</h2>
              <p className="section-description mt-0.5">
                Immutable change history for{' '}
                <span className="font-mono text-foreground">{testCaseCode}</span>
              </p>
              <p className="caption-text mt-1 line-clamp-1">{testCaseName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="pill pill-success h-6 border-0 gap-1">
              <ShieldCheck className="h-3 w-3" />
              Cryptographically signed
            </Badge>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-3 w-full" fast>
        <KpiStatCard
          label="Total Events"
          value={events.length}
          icon={History}
          tone="brand"
          className="min-h-[5.5rem]"
        />
        <KpiStatCard
          label="Verified"
          value={verifiedCount}
          icon={ShieldCheck}
          tone="success"
          className="min-h-[5.5rem]"
        />
        <KpiStatCard
          label="Signed"
          value={signedCount}
          icon={Shield}
          tone="info"
          className="min-h-[5.5rem]"
        />
        <KpiStatCard
          label="Contributors"
          value={uniqueActors}
          icon={Users}
          tone="neutral"
          className="min-h-[5.5rem]"
        />
      </StaggerGrid>

      {latest && (
        <Card className="shadow-[var(--shadow-xs)] border-border/80">
          <CardContent className="py-4">
            <p className="micro-label mb-3">Recent activity</p>
            <div className="space-y-3">
              {events.slice(0, 3).map((event, index) => {
                const isAgent = event.actor.name.toLowerCase().includes('agent') || event.actor.name.toLowerCase().includes('voltus')
                const ActorIcon = isAgent ? Bot : User
                return (
                  <motion.div
                    key={event.id}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="flex gap-3"
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-2 ring-background',
                          isAgent ? 'bg-brand/10 text-brand' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <ActorIcon className="h-4 w-4" />
                      </div>
                      {index < 2 && <div className="w-px flex-1 bg-border mt-1 min-h-[12px]" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{event.actor.name}</span>
                        <Badge variant="outline" className="h-5 text-[10px] font-mono capitalize">
                          {formatAction(event.action)}
                        </Badge>
                        <span className="caption-text">{formatRelativeTime(event.timestamp)}</span>
                      </div>
                      {event.fieldChanged && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-mono text-foreground">{event.fieldChanged}</span>
                          {event.oldValue && event.newValue && (
                            <>
                              {' '}
                              <span className="text-red-600 dark:text-red-400 line-through">{event.oldValue}</span>
                              {' → '}
                              <span className="text-emerald-600 dark:text-emerald-400">{event.newValue}</span>
                            </>
                          )}
                        </p>
                      )}
                      {!event.fieldChanged && event.action === 'created' && (
                        <p className="text-xs text-muted-foreground mt-1">Test case created in repository</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Full audit log</h3>
        </div>
        <AuditTrailTable events={events} />
      </div>
    </div>
  )
}
