'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  MoreHorizontal,
  Puzzle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { motion } from 'framer-motion'
import {
  getCategoryMeta,
  type IntegrationItem,
  type IntegrationStatus,
} from '@/lib/integrations-mock-data'

const STATUS_CONFIG: Record<
  IntegrationStatus,
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

function formatStatLabel(key: string): string {
  return key.replace(/_/g, ' ')
}

function StatCell({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-border/50 bg-muted/20 py-1.5 px-1.5 min-h-[2.75rem] text-center">
      <p className="text-sm font-bold tabular-nums leading-none">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5 capitalize line-clamp-1">{label}</p>
    </div>
  )
}

interface IntegrationCardProps {
  integration: IntegrationItem
  onSync: (integration: IntegrationItem) => void
}

export function IntegrationCard({ integration, onSync }: IntegrationCardProps) {
  const status = STATUS_CONFIG[integration.status]
  const StatusIcon = status.icon
  const category = getCategoryMeta(integration.category)
  const CategoryIcon = category.icon

  const statEntries = integration.stats
    ? Object.entries(integration.stats).slice(0, 2)
    : [
        ['metric_a', '—'],
        ['metric_b', '—'],
      ]

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: 'var(--card-shadow-hover)' }}
      className={cn(
        'group flex h-full min-h-[14.5rem] flex-col rounded-lg border border-border bg-card overflow-hidden',
        'shadow-[var(--shadow-xs)] transition-colors duration-200 hover:border-border/80',
        'ring-1 ring-inset',
        status.ring,
        integration.status === 'disconnected' && 'opacity-90',
      )}
    >
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center">
              <CategoryIcon className="h-4 w-4 text-brand" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate leading-tight">{integration.name}</h3>
              <Badge variant="secondary" className="h-4 text-[9px] mt-0.5 px-1.5">
                {category.label}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-70 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/system-admin/integrations/${integration.id}/configure`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSync(integration)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/system-admin/integrations/${integration.id}/logs`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Logs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-destructive">
                <Link href={`/system-admin/integrations/${integration.id}/configure`}>
                  Disconnect
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground leading-snug line-clamp-2 min-h-[2.25rem]">
          {integration.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Badge className={cn('h-5 text-[10px] border-0 gap-1 shrink-0', status.pill)}>
            <StatusIcon className="h-2.5 w-2.5" />
            {integration.status === 'connected'
              ? 'Connected'
              : integration.status === 'warning'
                ? 'Warning'
                : 'Disconnected'}
          </Badge>
          <span className="caption-text truncate">
            {integration.last_sync
              ? `Synced ${formatRelativeTime(integration.last_sync)}`
              : 'Never synced'}
          </span>
        </div>

        <div className="min-h-[1.625rem] flex items-center">
          {integration.warning ? (
            <div className="flex items-center gap-1.5 w-full rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-2 py-1 text-[10px] text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">{integration.warning}</span>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {statEntries.map(([key, value]) => (
            <StatCell key={key} value={value} label={formatStatLabel(key)} />
          ))}
        </div>

        <div className="pt-2 border-t border-border/60 mt-auto">
          {integration.status === 'disconnected' ? (
            <Button
              size="sm"
              className="w-full h-8 text-xs gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
              asChild
            >
              <Link href={`/system-admin/integrations/${integration.id}/connect`}>Connect</Link>
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => onSync(integration)}
              >
                <RefreshCw className="h-3 w-3" />
                Sync
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1" asChild>
                <Link href={`/system-admin/integrations/${integration.id}/configure`}>
                  <Settings className="h-3 w-3" />
                  Configure
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
