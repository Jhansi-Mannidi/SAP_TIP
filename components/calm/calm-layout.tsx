'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CloudCog,
  LayoutDashboard,
  Building2,
  Link2,
  Layers,
  Inbox,
  History,
  ArrowLeftRight,
  Plus,
  RefreshCw,
} from 'lucide-react'

import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CALM_KPIS } from '@/lib/calm-mock-data'

export type CalmTab =
  | 'overview'
  | 'tenants'
  | 'bindings'
  | 'projections'
  | 'outbox'
  | 'sync-log'
  | 'field-mapping'

const TABS: { id: CalmTab; label: string; href: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', href: '/system-admin/calm', icon: LayoutDashboard },
  { id: 'tenants', label: 'Tenants', href: '/system-admin/calm/tenants', icon: Building2 },
  { id: 'bindings', label: 'Bindings', href: '/system-admin/calm/bindings', icon: Link2 },
  { id: 'projections', label: 'Projections', href: '/system-admin/calm/projections', icon: Layers },
  { id: 'outbox', label: 'Outbox', href: '/system-admin/calm/outbox', icon: Inbox },
  { id: 'sync-log', label: 'Sync Log', href: '/system-admin/calm/sync-log', icon: History },
  {
    id: 'field-mapping',
    label: 'Field Mapping',
    href: '/system-admin/calm/field-mapping',
    icon: ArrowLeftRight,
  },
]

function resolveTab(pathname: string): CalmTab {
  if (pathname.startsWith('/system-admin/calm/tenants')) return 'tenants'
  if (pathname.startsWith('/system-admin/calm/bindings')) return 'bindings'
  if (pathname.startsWith('/system-admin/calm/projections')) return 'projections'
  if (pathname.startsWith('/system-admin/calm/outbox')) return 'outbox'
  if (pathname.startsWith('/system-admin/calm/sync-log')) return 'sync-log'
  if (pathname.startsWith('/system-admin/calm/field-mapping')) return 'field-mapping'
  return 'overview'
}

interface CalmLayoutProps {
  children: React.ReactNode
  showKpis?: boolean
}

export function CalmLayout({ children, showKpis = true }: CalmLayoutProps) {
  const pathname = usePathname()
  const activeTab = resolveTab(pathname)

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
      <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4">
          <PageHeader
            title="SAP Cloud ALM"
            description="Phase 1 inbound test automation and Phase 2 outbound defect enrichment"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                  <RefreshCw className="h-3.5 w-3.5 sm:mr-2" />
                  <span className="hidden sm:inline">Sync All</span>
                  <span className="sm:hidden">Sync</span>
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs sm:text-sm bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Plus className="h-3.5 w-3.5 sm:mr-2" />
                  <span className="hidden sm:inline">Register Tenant</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            }
          />

          {showKpis && (
            <StaggerGrid
              columns="grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
              className="gap-2 sm:gap-3 w-full items-stretch"
              fast
            >
              <KpiStatCard
                label="CALM Tenants"
                value={CALM_KPIS.tenants}
                icon={CloudCog}
                tone="brand"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Scenario Bindings"
                value={CALM_KPIS.scenario_bindings}
                icon={Link2}
                tone="info"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Case Bindings"
                value={CALM_KPIS.case_bindings}
                icon={Layers}
                tone="neutral"
                className="min-h-[5rem] col-span-2 lg:col-span-1"
              />
              <KpiStatCard
                label="Ready"
                value={CALM_KPIS.bound_ready}
                icon={Building2}
                tone="success"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Outbox Pending"
                value={CALM_KPIS.outbox_pending}
                icon={Inbox}
                tone="warning"
                className="min-h-[5rem]"
              />
              <KpiStatCard
                label="Defects Raised"
                value={CALM_KPIS.defects_raised}
                icon={History}
                tone="danger"
                className="min-h-[5rem] col-span-2 lg:col-span-1"
              />
              <KpiStatCard
                label="Sync Success"
                value={CALM_KPIS.sync_success_rate}
                icon={RefreshCw}
                tone="success"
                suffix="%"
                className="min-h-[5rem] col-span-2 lg:col-span-1"
              />
            </StaggerGrid>
          )}

          <nav
            aria-label="Cloud ALM sections"
            className="flex gap-1 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                    'border border-transparent',
                    isActive
                      ? 'bg-background text-foreground shadow-[var(--shadow-xs)] border-border/60'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {children}
      </div>
    </div>
  )
}
