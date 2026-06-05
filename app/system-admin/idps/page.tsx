'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Users,
  RefreshCw,
  Settings,
  ExternalLink,
  Clock,
  Cloud,
  Building2,
  KeyRound,
  Link2,
  Globe,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'

import {
  MOCK_IDENTITY_PROVIDERS,
  IDP_KIND_LABELS,
  type IdentityProvider,
  type IdPStatus,
  type IdPKind,
} from '@/lib/config-mock-data'

const STATUS_CONFIG: Record<
  IdPStatus,
  { icon: React.ElementType; pill: string; ring: string }
> = {
  Connected: {
    icon: CheckCircle2,
    pill: 'pill pill-success',
    ring: 'ring-emerald-500/15',
  },
  Pending: {
    icon: AlertCircle,
    pill: 'pill pill-warning',
    ring: 'ring-amber-500/15',
  },
  Failed: {
    icon: XCircle,
    pill: 'pill pill-danger',
    ring: 'ring-red-500/15',
  },
}

const KIND_ICONS: Record<IdPKind, React.ElementType> = {
  COGNITO: Cloud,
  SAP_IAS: Building2,
  AZURE_AD: ShieldCheck,
  OKTA: KeyRound,
}

function MetaCell({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 min-h-[3.5rem]">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="micro-label">{label}</span>
      </div>
      <div className={cn('text-sm font-medium mt-1 truncate', mono && 'font-mono text-xs')}>
        {value}
      </div>
    </div>
  )
}

function IdPCard({ idp }: { idp: IdentityProvider }) {
  const status = STATUS_CONFIG[idp.status]
  const StatusIcon = status.icon
  const KindIcon = KIND_ICONS[idp.kind]

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: 'var(--card-shadow-hover)' }}
      className={cn(
        'group flex h-full min-h-[22rem] flex-col rounded-xl border border-border bg-card overflow-hidden',
        'shadow-[var(--shadow-xs)] transition-colors duration-200 hover:border-border/80',
        'ring-1 ring-inset',
        status.ring,
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center">
              <KindIcon className="h-5 w-5 text-brand" />
            </div>
            <div className="min-w-0">
              <h3 className="card-title-text line-clamp-2">{idp.display_name}</h3>
              <p className="caption-text mt-0.5">{IDP_KIND_LABELS[idp.kind]}</p>
            </div>
          </div>
          <Badge className={cn('h-6 text-[11px] border-0 gap-1 shrink-0', status.pill)}>
            <StatusIcon className="h-3 w-3" />
            {idp.status}
          </Badge>
        </div>

        {/* Meta grid — fixed 2×2 for equal card height */}
        <div className="grid grid-cols-2 gap-2.5 flex-1">
          <MetaCell
            icon={Link2}
            label="Protocol"
            value={<Badge variant="outline" className="h-5 text-[10px] font-mono">{idp.protocol}</Badge>}
          />
          <MetaCell
            icon={Users}
            label="Users"
            value={idp.user_count.toLocaleString()}
          />
          <MetaCell
            icon={Clock}
            label="Last Sync"
            value={
              idp.last_sync ? (
                formatRelativeTime(idp.last_sync)
              ) : (
                <span className="text-muted-foreground">Not synced</span>
              )
            }
          />
          <MetaCell
            icon={Globe}
            label="Endpoint"
            value={
              idp.endpoint ? (
                <span title={idp.endpoint} className="truncate block">
                  {idp.endpoint}
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )
            }
            mono
          />
        </div>

        {/* Actions — fixed footer height */}
        <div className="pt-3 border-t border-border/60 mt-auto">
          {idp.status === 'Connected' && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          )}
          {idp.status === 'Pending' && (
            <Button size="sm" className="w-full gap-2 h-9 bg-brand text-brand-foreground hover:bg-brand/90">
              <ExternalLink className="h-4 w-4" />
              Complete Setup
            </Button>
          )}
          {idp.status === 'Failed' && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="destructive" size="sm" className="gap-2 h-9">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function AddIdPCard() {
  return (
    <motion.div variants={staggerItem} whileHover={{ y: -2 }} className="h-full min-h-[22rem]">
    <Link
      href="/system-admin/idps/connect"
      className={cn(
        'flex h-full min-h-[22rem] w-full flex-col items-center justify-center rounded-xl',
        'border-2 border-dashed border-border bg-muted/10 hover:bg-muted/25 hover:shadow-[var(--card-shadow-hover)]',
        'transition-all duration-200 text-center p-6',
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-muted/60 ring-1 ring-inset ring-border flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="font-medium text-sm">Connect Identity Provider</p>
      <p className="caption-text mt-1.5 max-w-[14rem]">
        SAP IAS, Azure AD, Okta, or Cognito
      </p>
    </Link>
    </motion.div>
  )
}

export default function IdentityProvidersPage() {
  const connected = MOCK_IDENTITY_PROVIDERS.filter((i) => i.status === 'Connected').length
  const pending = MOCK_IDENTITY_PROVIDERS.filter((i) => i.status === 'Pending').length
  const totalUsers = MOCK_IDENTITY_PROVIDERS.reduce((sum, i) => sum + i.user_count, 0)

  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <PageHeader
              title="Identity Providers"
              description="SSO bridges for authentication. Connect external identity providers for seamless access."
              actions={
                <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                  <Link href="/system-admin/idps/connect">
                    <Plus className="h-4 w-4" />
                    Connect IdP
                  </Link>
                </Button>
              }
            />

            <StaggerGrid
              columns="grid-cols-2 lg:grid-cols-3"
              className="gap-3 w-full items-stretch"
              fast
            >
              <KpiStatCard
                label="Connected"
                value={connected}
                icon={CheckCircle2}
                tone="success"
                className="min-h-[5.5rem]"
              />
              <KpiStatCard
                label="Total Users"
                value={totalUsers}
                icon={Users}
                tone="brand"
                className="min-h-[5.5rem]"
              />
              <KpiStatCard
                label="Pending Setup"
                value={pending}
                icon={AlertCircle}
                tone="warning"
                className="min-h-[5.5rem] col-span-2 lg:col-span-1"
              />
            </StaggerGrid>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch w-full">
            {MOCK_IDENTITY_PROVIDERS.map((idp) => (
              <IdPCard key={idp.id} idp={idp} />
            ))}
            <AddIdPCard />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
