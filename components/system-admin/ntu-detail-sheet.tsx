'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Copy,
  History,
  Key,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
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
  MOCK_SAP_SYSTEMS,
  type AuthorityProfile,
  type NTU,
  type NTUStatus,
} from '@/lib/config-mock-data'

export const STATUS_CONFIG: Record<
  NTUStatus,
  { icon: React.ElementType; label: string; pill: string }
> = {
  active: {
    icon: CheckCircle2,
    label: 'Active',
    pill: 'border-emerald-500/35 text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.06]',
  },
  rotating: {
    icon: RefreshCw,
    label: 'Rotating',
    pill: 'border-blue-500/35 text-blue-700 dark:text-blue-400 bg-blue-500/[0.06]',
  },
  expired: {
    icon: ShieldAlert,
    label: 'Expired',
    pill: 'border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/[0.06]',
  },
  disabled: {
    icon: Shield,
    label: 'Disabled',
    pill: 'text-muted-foreground border-border bg-muted/30',
  },
}

export const AUTHORITY_COLORS: Record<AuthorityProfile, string> = {
  READ_ONLY: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  TEST_EXECUTION: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
  FULL_AUTH: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25',
  DATA_MIGRATION: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
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

export type NTUWithSystem = NTU & {
  system_sid: string
  system_name: string
  is_productive: boolean
}

export function NtuDetailSheet({
  ntu,
  open,
  onOpenChange,
}: {
  ntu: NTUWithSystem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [copied, setCopied] = React.useState(false)

  if (!ntu) return null

  const status = STATUS_CONFIG[ntu.status]
  const StatusIcon = status.icon

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const copyVaultRef = async () => {
    await navigator.clipboard.writeText(ntu.vault_ref)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 [&>button.absolute]:hidden">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-card via-card to-brand/[0.04]">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
              <Key className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="font-mono text-base leading-tight">{ntu.name}</SheetTitle>
              <SheetDescription className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn('text-[11px] font-mono border', AUTHORITY_COLORS[ntu.authority_profile])}
                >
                  {ntu.authority_profile}
                </Badge>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border',
                    status.pill,
                  )}
                >
                  <StatusIcon className={cn('h-3 w-3', ntu.status === 'rotating' && 'animate-spin')} />
                  {status.label}
                </span>
              </SheetDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {ntu.is_productive && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25">
                <ShieldAlert className="h-3 w-3" />
                Productive system
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border bg-muted/50 text-muted-foreground border-border">
              Client {ntu.client}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <MetaCell label="SAP System" value={ntu.system_sid} mono icon={<Server className="h-3 w-3" />} />
            <MetaCell label="Last Rotation" value={formatDate(ntu.last_rotation)} icon={<History className="h-3 w-3" />} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vault Reference
            </span>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <code className="flex-1 text-xs font-mono break-all leading-relaxed">{ntu.vault_ref}</code>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copyVaultRef}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            {copied && <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Copied to clipboard</p>}
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Credentials are vault-mediated. The platform never displays secrets in the UI.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <p className="text-sm font-medium">Authority profile</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ntu.authority_profile === 'READ_ONLY' && 'Read-only access for discovery and validation tasks.'}
              {ntu.authority_profile === 'TEST_EXECUTION' && 'Scoped for automated test execution and evidence capture.'}
              {ntu.authority_profile === 'FULL_AUTH' && 'Elevated authority — restricted to non-productive landscapes.'}
              {ntu.authority_profile === 'DATA_MIGRATION' && 'Data migration and cutover operations.'}
            </p>
          </div>
        </div>

        <div className="border-t bg-background/95 backdrop-blur px-6 py-4 flex flex-col gap-2">
          <Button className="w-full gap-2" variant="default">
            <RefreshCw className="h-4 w-4" />
            Rotate Credentials
          </Button>
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link href={`/system-admin/systems/${ntu.system_id}`}>
              <Server className="h-4 w-4" />
              View SAP System
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function enrichNtu(ntu: NTU): NTUWithSystem {
  const system = MOCK_SAP_SYSTEMS.find((s) => s.id === ntu.system_id)
  return {
    ...ntu,
    system_sid: system?.sid ?? ntu.system_id,
    system_name: system?.display_name ?? ntu.system_id,
    is_productive: system?.is_productive ?? false,
  }
}
