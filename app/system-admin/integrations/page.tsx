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
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { IntegrationCard } from '@/components/integrations/integration-card'
import { IntegrationSyncDialog } from '@/components/integrations/integration-sync-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  INTEGRATION_CATEGORIES,
  MOCK_INTEGRATIONS,
  type IntegrationItem,
} from '@/lib/integrations-mock-data'

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [syncTarget, setSyncTarget] = React.useState<IntegrationItem | null>(null)
  const [syncOpen, setSyncOpen] = React.useState(false)

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

  const handleSync = (integration: IntegrationItem) => {
    setSyncTarget(integration)
    setSyncOpen(true)
  }

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
                  <Link href="/system-admin/integrations/add">
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
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onSync={handleSync}
                />
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
              <Button asChild className="mt-4 bg-brand text-brand-foreground hover:bg-brand/90">
                <Link href="/system-admin/integrations/add">Add Integration</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <IntegrationSyncDialog
        integration={syncTarget}
        open={syncOpen}
        onOpenChange={setSyncOpen}
      />
    </AppShell>
  )
}
