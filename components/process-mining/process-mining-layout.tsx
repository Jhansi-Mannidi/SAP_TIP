'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  GitBranch,
  Workflow,
  Sparkles,
  Upload,
  RefreshCw,
  Target,
} from 'lucide-react'

import { PageHeader } from '@/components/design-system'
import { KPIStrip } from '@/components/kpi-strip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PROCESS_MINING_KPIS } from '@/lib/process-mining-mock-data'

export type ProcessMiningTab = 'discovery' | 'coverage' | 'suggestions' | 'variants'

const TABS: {
  id: ProcessMiningTab
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}[] = [
  { id: 'discovery', label: 'Process Discovery', href: '/process-mining', icon: Workflow },
  {
    id: 'coverage',
    label: 'Coverage Analysis',
    href: '/process-mining/coverage',
    icon: Target,
  },
  {
    id: 'suggestions',
    label: 'AI Suggestions',
    href: '/process-mining/suggestions',
    icon: Sparkles,
    badge: 3,
  },
  { id: 'variants', label: 'Variants', href: '/process-mining/variants', icon: GitBranch },
]

function resolveActiveTab(pathname: string): ProcessMiningTab {
  if (pathname.startsWith('/process-mining/coverage')) return 'coverage'
  if (pathname.startsWith('/process-mining/suggestions')) return 'suggestions'
  if (pathname.startsWith('/process-mining/variants')) return 'variants'
  return 'discovery'
}

interface ProcessMiningLayoutProps {
  children: React.ReactNode
}

export function ProcessMiningLayout({ children }: ProcessMiningLayoutProps) {
  const pathname = usePathname()
  const activeTab = resolveActiveTab(pathname)
  const isDetailPage =
    /^\/process-mining\/(suggestions|variants)\/[^/]+$/.test(pathname)

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
      <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4">
          <PageHeader
            title="Process Mining Bridge"
            description="Discover processes from production and generate test coverage"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                  <Upload className="h-3.5 w-3.5 sm:mr-2" />
                  <span className="hidden sm:inline">Import Log</span>
                  <span className="sm:hidden">Import</span>
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="h-3.5 w-3.5 sm:mr-2" />
                  <span className="hidden sm:inline">Sync Mining Data</span>
                  <span className="sm:hidden">Sync</span>
                </Button>
              </div>
            }
          />

          {activeTab !== 'suggestions' && !isDetailPage && (
            <KPIStrip
              kpis={PROCESS_MINING_KPIS}
              variant="flat"
              className="py-1 sm:py-2"
            />
          )}

          <nav
            aria-label="Process mining sections"
            className="flex lg:hidden gap-1 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                    'border border-transparent',
                    isActive
                      ? 'bg-background text-foreground shadow-[var(--shadow-xs)] border-border/60'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge != null && (
                    <Badge
                      variant="secondary"
                      className="h-4 min-w-4 px-1 text-[10px] font-semibold"
                    >
                      {tab.badge}
                    </Badge>
                  )}
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
