'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  Clock,
  ExternalLink,
  Lock,
  Plug,
  RefreshCw,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Unlock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  LANDSCAPE_ROLE_COLORS,
  MOCK_RFC_DESTINATIONS,
  MOCK_SAP_SYSTEMS,
  type SAPClient,
} from '@/lib/config-mock-data'

export type ClientWithSystem = SAPClient & {
  system_sid: string
  system_name: string
}

function MetaCell({
  label,
  value,
  mono,
  icon,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <p className={cn('text-sm font-medium leading-snug', mono && 'font-mono')}>{value}</p>
    </div>
  )
}

function StatusPill({
  active,
  activeLabel,
  inactiveLabel,
  tone,
}: {
  active: boolean
  activeLabel: string
  inactiveLabel: string
  tone: 'productive' | 'locked'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border',
        active && tone === 'productive' && 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25',
        active && tone === 'locked' && 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25',
        !active && 'bg-muted/50 text-muted-foreground border-border',
      )}
    >
      {active ? (
        tone === 'productive' ? (
          <Shield className="h-3 w-3" />
        ) : (
          <Lock className="h-3 w-3" />
        )
      ) : tone === 'locked' ? (
        <Unlock className="h-3 w-3 opacity-60" />
      ) : null}
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}

export function ClientDetailSheet({
  client,
  open,
  onOpenChange,
}: {
  client: ClientWithSystem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const system = client ? MOCK_SAP_SYSTEMS.find((s) => s.id === client.system_id) : null
  const linkedRfcs = client
    ? MOCK_RFC_DESTINATIONS.filter(
        (r) => r.system_id === client.system_id && r.client === client.client_number,
      )
    : []

  const recentEvents = client
    ? [
        { label: 'Client metadata synced', time: client.recent_activity || '—', tone: 'default' as const },
        { label: 'SCC4 lock status verified', time: '3 hours ago', tone: 'default' as const },
        ...(client.is_productive
          ? [{ label: 'Productive guard policy applied', time: '1 day ago', tone: 'warning' as const }]
          : []),
      ]
    : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Client Details</SheetTitle>
          <SheetDescription>View and manage SAP client</SheetDescription>
        </SheetHeader>

        {client && (
          <div className="flex h-full flex-col min-h-0">
            <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.08] via-background to-background px-5 sm:px-6 pt-5 pb-4">
              <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold text-white shadow-sm',
                    client.is_productive ? 'bg-red-500' : 'bg-indigo-500',
                  )}
                >
                  {client.client_number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base leading-tight">
                      <span className="font-mono">{client.system_sid}</span>
                      <span className="text-muted-foreground mx-1.5">/</span>
                      <span className="font-mono">{client.client_number}</span>
                    </h3>
                    {client.is_productive && (
                      <Shield className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {client.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <StatusPill
                      active={client.is_productive}
                      activeLabel="Productive"
                      inactiveLabel="Non-productive"
                      tone="productive"
                    />
                    <StatusPill
                      active={client.is_locked}
                      activeLabel="Locked (SCC4)"
                      inactiveLabel="Unlocked"
                      tone="locked"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
              <section className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-xs)] space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-brand" />
                  System Context
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <MetaCell label="System" value={client.system_name} />
                  <MetaCell
                    label="SID"
                    value={
                      <Link
                        href={`/system-admin/systems/${client.system_id}`}
                        className="text-brand hover:underline inline-flex items-center gap-1"
                      >
                        {client.system_sid}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    }
                    mono
                  />
                  {system && (
                    <>
                      <MetaCell label="Region" value={system.region} />
                      <MetaCell
                        label="Landscape"
                        value={
                          <Badge
                            className={cn(
                              'text-white text-[10px] h-5 font-mono',
                              LANDSCAPE_ROLE_COLORS[system.landscape_role],
                            )}
                          >
                            {system.landscape_role}
                          </Badge>
                        }
                      />
                    </>
                  )}
                  <MetaCell label="Client Number" value={client.client_number} mono />
                  <MetaCell
                    label="Recent Activity"
                    value={client.recent_activity || '—'}
                    icon={<Clock className="h-3 w-3" />}
                  />
                </div>
              </section>

              {client.is_productive && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] px-4 py-3 flex items-start gap-3">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Productive clients require dual approval to change the productive flag or unlock
                    via SCC4. Destructive test operations are restricted.
                  </p>
                </div>
              )}

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                  Linked RFC Destinations
                  <Badge variant="secondary" className="h-4 text-[9px] ml-auto tabular-nums">
                    {linkedRfcs.length}
                  </Badge>
                </h4>
                {linkedRfcs.length > 0 ? (
                  <div className="space-y-2">
                    {linkedRfcs.map((rfc) => (
                      <div
                        key={rfc.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-medium truncate">{rfc.name}</p>
                          <p className="caption-text mt-0.5">Pool · {rfc.pool_size}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 text-[9px] shrink-0',
                            rfc.health === 'healthy' && 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
                            rfc.health === 'degraded' && 'border-amber-500/40 text-amber-700 dark:text-amber-400',
                          )}
                        >
                          {rfc.health}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center">
                    <Plug className="h-5 w-5 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No RFC destinations bound to this client yet.</p>
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  Recent Events
                </h4>
                <ul className="space-y-0 rounded-xl border border-border overflow-hidden divide-y divide-border">
                  {recentEvents.map((event, index) => (
                    <li
                      key={index}
                      className="flex items-start justify-between gap-3 px-3 py-2.5 bg-card text-sm"
                    >
                      <span className="text-foreground/90">{event.label}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                        {event.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="shrink-0 border-t border-border bg-muted/20 px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Sync from System
              </Button>
              <Button className="flex-1 gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                <Settings className="h-4 w-4" />
                Edit Client
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
