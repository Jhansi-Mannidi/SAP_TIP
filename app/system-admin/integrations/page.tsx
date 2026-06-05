'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Puzzle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Settings,
  MoreHorizontal,
  MessageSquare,
  GitBranch,
  FileText,
  AlertTriangle,
  BarChart3,
  Mail,
  Webhook,
  Database,
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'

const INTEGRATION_CATEGORIES = [
  { id: 'itsm', label: 'ITSM', icon: MessageSquare },
  { id: 'cicd', label: 'CI/CD', icon: GitBranch },
  { id: 'docs', label: 'Documentation', icon: FileText },
  { id: 'alerts', label: 'Alerting', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'storage', label: 'Storage', icon: Database },
] as const

type IntegrationStatus = 'connected' | 'warning' | 'disconnected'

interface IntegrationItem {
  id: string
  name: string
  category: string
  description: string
  status: IntegrationStatus
  last_sync?: string
  warning?: string
  stats?: Record<string, number>
}

const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int_1',
    name: 'ServiceNow',
    category: 'itsm',
    description: 'Bi-directional sync with ServiceNow for incident and change management.',
    status: 'connected',
    last_sync: '2026-05-07T10:30:00+05:30',
    stats: { incidents_synced: 156, changes_synced: 42 },
  },
  {
    id: 'int_2',
    name: 'Jira',
    category: 'itsm',
    description: 'Create and track Jira issues from defects and test failures.',
    status: 'connected',
    last_sync: '2026-05-07T10:25:00+05:30',
    stats: { issues_created: 89, issues_resolved: 67 },
  },
  {
    id: 'int_3',
    name: 'Azure DevOps',
    category: 'cicd',
    description: 'Trigger test runs from Azure Pipelines and report results.',
    status: 'connected',
    last_sync: '2026-05-07T09:15:00+05:30',
    stats: { pipelines_triggered: 234, builds_monitored: 456 },
  },
  {
    id: 'int_4',
    name: 'Confluence',
    category: 'docs',
    description: 'Publish test documentation and evidence to Confluence spaces.',
    status: 'connected',
    last_sync: '2026-05-06T16:00:00+05:30',
    stats: { pages_published: 78, attachments: 312 },
  },
  {
    id: 'int_5',
    name: 'PagerDuty',
    category: 'alerts',
    description: 'Send critical test failure alerts to PagerDuty for on-call response.',
    status: 'connected',
    last_sync: '2026-05-07T08:00:00+05:30',
    stats: { alerts_sent: 23, acknowledged: 21 },
  },
  {
    id: 'int_6',
    name: 'Slack',
    category: 'alerts',
    description: 'Send notifications to Slack channels for test events.',
    status: 'warning',
    last_sync: '2026-05-05T12:00:00+05:30',
    stats: { messages_sent: 1245, channels: 4 },
    warning: 'Token expires in 7 days',
  },
  {
    id: 'int_7',
    name: 'Microsoft Teams',
    category: 'alerts',
    description: 'Post test results and alerts to Teams channels.',
    status: 'disconnected',
  },
  {
    id: 'int_8',
    name: 'Splunk',
    category: 'analytics',
    description: 'Export test telemetry and logs to Splunk for analysis.',
    status: 'connected',
    last_sync: '2026-05-07T10:00:00+05:30',
    stats: { events_exported: 125000, dashboards: 6 },
  },
  {
    id: 'int_9',
    name: 'Custom Webhook',
    category: 'webhooks',
    description: 'Send test events to custom webhook endpoints.',
    status: 'connected',
    last_sync: '2026-05-07T10:30:00+05:30',
    stats: { webhooks_sent: 3456, endpoints: 3 },
  },
  {
    id: 'int_10',
    name: 'SMTP Email',
    category: 'email',
    description: 'Send email notifications for test completions and reports.',
    status: 'connected',
    last_sync: '2026-05-07T06:00:00+05:30',
    stats: { emails_sent: 567, templates: 12 },
  },
]

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
    icon: Clock,
    pill: 'pill pill-neutral',
    ring: 'ring-border/60',
  },
}

function getCategoryMeta(categoryId: string) {
  return INTEGRATION_CATEGORIES.find((c) => c.id === categoryId) ?? {
    id: categoryId,
    label: categoryId,
    icon: Puzzle,
  }
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

function IntegrationCard({ integration }: { integration: IntegrationItem }) {
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
        {/* Header */}
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
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2 min-h-[2.25rem]">
          {integration.description}
        </p>

        {/* Status row */}
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

        {/* Alert slot — fixed height so cards stay equal */}
        <div className="min-h-[1.625rem] flex items-center">
          {integration.warning ? (
            <div className="flex items-center gap-1.5 w-full rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-2 py-1 text-[10px] text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">{integration.warning}</span>
            </div>
          ) : null}
        </div>

        {/* Stats — always 2 columns */}
        <div className="grid grid-cols-2 gap-1.5">
          {statEntries.map(([key, value]) => (
            <StatCell
              key={key}
              value={value}
              label={formatStatLabel(key)}
            />
          ))}
        </div>

        {/* Footer actions — fixed height */}
        <div className="pt-2 border-t border-border/60 mt-auto">
          {integration.status === 'disconnected' ? (
            <Button
              size="sm"
              className="w-full h-8 text-xs gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Connect
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                <RefreshCw className="h-3 w-3" />
                Sync
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                <Settings className="h-3 w-3" />
                Configure
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const filteredIntegrations = MOCK_INTEGRATIONS.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const connectedCount = MOCK_INTEGRATIONS.filter((i) => i.status === 'connected').length
  const warningCount = MOCK_INTEGRATIONS.filter((i) => i.status === 'warning').length

  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-3 space-y-3">
            <PageHeader
              title="Integrations Hub"
              description="Connect SAP Test Assurance to external systems for ITSM, CI/CD, alerting, and more."
              actions={
                <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                  <Link href="/system-admin/integrations/webhooks">
                    <Plus className="h-4 w-4" />
                    Add Integration
                  </Link>
                </Button>
              }
            />

            <StaggerGrid
              columns="grid-cols-2 lg:grid-cols-4"
              className="gap-3 w-full items-stretch"
              fast
            >
              <KpiStatCard
                label="Total"
                value={MOCK_INTEGRATIONS.length}
                icon={Puzzle}
                tone="brand"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Connected"
                value={connectedCount}
                icon={CheckCircle2}
                tone="success"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Warnings"
                value={warningCount}
                icon={AlertCircle}
                tone="warning"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Syncs Today"
                value={47}
                icon={RefreshCw}
                tone="info"
                className="min-h-[5rem] col-span-2 lg:col-span-1"
              />
            </StaggerGrid>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[170px] h-9 bg-background">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {INTEGRATION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-4">
          {filteredIntegrations.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 items-stretch w-full"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
              initial="hidden"
              animate="visible"
            >
              {filteredIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Puzzle className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <h3 className="section-title">No integrations found</h3>
              <p className="page-description mt-1.5 max-w-sm">
                Try adjusting your search or filters to find integrations.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
