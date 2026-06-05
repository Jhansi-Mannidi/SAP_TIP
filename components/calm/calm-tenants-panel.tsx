'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Cloud,
  KeyRound,
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
  ExternalLink,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  MOCK_CALM_TENANTS,
  MOCK_CALM_PROJECTS,
  type CalmTenant,
  type CalmTenantStatus,
} from '@/lib/calm-mock-data'

const STATUS: Record<
  CalmTenantStatus,
  { icon: React.ElementType; pill: string; ring: string }
> = {
  connected: {
    icon: CheckCircle2,
    pill: 'pill pill-success',
    ring: 'ring-emerald-500/15',
  },
  warning: {
    icon: AlertCircle,
    pill: 'pill pill-warning',
    ring: 'ring-amber-500/15',
  },
  disconnected: {
    icon: XCircle,
    pill: 'pill pill-neutral',
    ring: 'ring-border/60',
  },
}

function TenantCard({ tenant }: { tenant: CalmTenant }) {
  const status = STATUS[tenant.status]
  const StatusIcon = status.icon
  const projects = MOCK_CALM_PROJECTS.filter((p) => p.tenant_id === tenant.id)

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: 'var(--card-shadow-hover)' }}
      className={cn(
        'rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-xs)]',
        'ring-1 ring-inset transition-colors hover:border-border/80',
        status.ring,
      )}
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center">
              <Cloud className="h-5 w-5 text-brand" />
            </div>
            <div className="min-w-0">
              <h3 className="card-title-text truncate">{tenant.name}</h3>
              <p className="caption-text font-mono truncate mt-0.5">{tenant.tenant_url}</p>
            </div>
          </div>
          <Badge className={cn('h-6 text-[11px] border-0 gap-1 shrink-0', status.pill)}>
            <StatusIcon className="h-3 w-3" />
            {tenant.status === 'connected'
              ? 'Connected'
              : tenant.status === 'warning'
                ? 'Warning'
                : 'Disconnected'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Meta label="Region" value={tenant.region} />
          <Meta label="SAP System" value={tenant.sap_system} mono />
          <Meta label="Projects" value={String(tenant.projects_count)} />
          <Meta label="Ready bindings" value={String(tenant.bindings_ready)} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={cn(
              'gap-1 text-[10px]',
              tenant.phase1_inbound && 'border-blue-500/30 bg-blue-500/[0.06]',
            )}
          >
            <ArrowDownLeft className="h-3 w-3" />
            Phase 1 Inbound
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'gap-1 text-[10px]',
              tenant.phase2_outbound
                ? 'border-brand/30 bg-brand/[0.06]'
                : 'opacity-60',
            )}
          >
            <ArrowUpRight className="h-3 w-3" />
            Phase 2 Outbound
          </Badge>
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="micro-label">OAuth Client (outbound)</span>
          </div>
          <p className="font-mono text-xs truncate">{tenant.oauth_client_id}</p>
          <div className="flex flex-wrap gap-1">
            {tenant.scopes.map((scope) => (
              <Badge key={scope} variant="secondary" className="text-[9px] h-5 font-mono">
                {scope}
              </Badge>
            ))}
          </div>
        </div>

        {projects.length > 0 && (
          <div className="space-y-2">
            <span className="micro-label">CALM Projects</span>
            <div className="space-y-1.5">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/40 px-2.5 py-2 text-xs"
                >
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-muted-foreground shrink-0">{p.bindings_count} bindings</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="caption-text">
            {tenant.last_sync ? `Synced ${formatRelativeTime(tenant.last_sync)}` : 'Never synced'}
          </span>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Configure
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-border/40 bg-muted/10 px-2.5 py-2">
      <span className="micro-label block">{label}</span>
      <span className={cn('text-sm font-medium truncate block mt-0.5', mono && 'font-mono text-xs')}>
        {value}
      </span>
    </div>
  )
}

export function CalmTenantsPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card/50 p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <Building2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Each row in <code className="text-[11px] font-mono">tip_calm_tenant</code> registers a
            CALM tenant with inbound provider endpoint and outbound OAuth client reference. Secrets
            are stored by reference only — never in plaintext.
          </p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {MOCK_CALM_TENANTS.map((tenant) => (
          <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </motion.div>
    </div>
  )
}
