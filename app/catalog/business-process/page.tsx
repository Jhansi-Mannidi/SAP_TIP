'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  CheckCircle2,
  FileText,
  Layers,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

type BPStatus = 'passing' | 'healing' | 'failing' | 'not_covered'

const BUSINESS_PROCESSES = [
  {
    id: 'OTC',
    name: 'Order to Cash',
    shortName: 'OTC',
    icon: ShoppingCart,
    description:
      'End-to-end sales process from sales order creation through delivery, billing, and customer payment collection.',
    narrative: `The Order to Cash (OTC) process is the backbone of Star Cement's revenue operations. It encompasses the complete lifecycle from customer order placement through final payment receipt. Our test coverage ensures seamless operation across sales order entry, credit management, delivery processing, billing, and accounts receivable.`,
    suiteCount: 3,
    scenarioCount: 12,
    bpScopeItems: [
      { code: 'BD9', name: 'Sales Order Create', status: 'passing' as BPStatus },
      { code: 'BD3', name: 'Sales Order Schedule Line', status: 'passing' as BPStatus },
      { code: 'BLG', name: 'Delivery Create', status: 'passing' as BPStatus },
      { code: 'BLI', name: 'Goods Issue Post', status: 'healing' as BPStatus },
      { code: 'BFD', name: 'Billing Document Create', status: 'passing' as BPStatus },
      { code: 'BD7', name: 'Credit Management', status: 'failing' as BPStatus },
    ],
  },
  {
    id: 'PTP',
    name: 'Procure to Pay',
    shortName: 'PTP',
    icon: Package,
    description:
      'Procurement lifecycle from purchase requisition through vendor payment, including goods receipt and invoice verification.',
    narrative: `The Procure to Pay (PTP) process manages Star Cement's procurement operations from requisition to vendor payment. Our test scenarios cover purchase order creation, goods receipt, invoice verification, and payment processing to ensure supply chain integrity.`,
    suiteCount: 2,
    scenarioCount: 8,
    bpScopeItems: [
      { code: 'PM1', name: 'Purchase Requisition', status: 'passing' as BPStatus },
      { code: 'PM2', name: 'Purchase Order Create', status: 'passing' as BPStatus },
      { code: 'PM3', name: 'Goods Receipt', status: 'passing' as BPStatus },
      { code: 'PM4', name: 'Invoice Verification', status: 'passing' as BPStatus },
      { code: 'PM5', name: 'Payment Processing', status: 'healing' as BPStatus },
    ],
  },
  {
    id: 'RTR',
    name: 'Record to Report',
    shortName: 'RTR',
    icon: Wallet,
    description:
      'Financial accounting and reporting processes including journal entries, period-end closing, and financial statements.',
    narrative: `Record to Report (RTR) encompasses Star Cement's financial accounting operations from transaction posting to financial statement generation. Our test coverage ensures accurate journal entries, proper period-end procedures, and reliable financial reporting.`,
    suiteCount: 2,
    scenarioCount: 6,
    bpScopeItems: [
      { code: 'FI1', name: 'Journal Entry Post', status: 'passing' as BPStatus },
      { code: 'FI2', name: 'Asset Depreciation', status: 'passing' as BPStatus },
      { code: 'FI3', name: 'Month-End Close', status: 'passing' as BPStatus },
      { code: 'FI4', name: 'Financial Statements', status: 'passing' as BPStatus },
    ],
  },
  {
    id: 'HTR',
    name: 'Hire to Retire',
    shortName: 'HTR',
    icon: Users,
    description:
      'Human capital management from employee onboarding through payroll processing and eventual separation.',
    narrative: `Hire to Retire (HTR) manages the complete employee lifecycle at Star Cement. Our test scenarios cover employee master data management, time recording, payroll processing, and benefits administration.`,
    suiteCount: 1,
    scenarioCount: 4,
    bpScopeItems: [
      { code: 'HR1', name: 'Employee Hire', status: 'passing' as BPStatus },
      { code: 'HR2', name: 'Time Recording', status: 'passing' as BPStatus },
      { code: 'HR3', name: 'Payroll Run', status: 'not_covered' as BPStatus },
    ],
  },
  {
    id: 'ATR',
    name: 'Acquire to Retire',
    shortName: 'ATR',
    icon: Box,
    description:
      'Asset lifecycle management from acquisition through depreciation and eventual asset retirement or disposal.',
    narrative: `Acquire to Retire (ATR) manages Star Cement's fixed asset lifecycle from capitalization through retirement. Our test coverage ensures proper asset acquisition, depreciation calculations, and disposal processing.`,
    suiteCount: 1,
    scenarioCount: 3,
    bpScopeItems: [
      { code: 'FA1', name: 'Asset Acquisition', status: 'passing' as BPStatus },
      { code: 'FA2', name: 'Depreciation Run', status: 'passing' as BPStatus },
      { code: 'FA3', name: 'Asset Retirement', status: 'not_covered' as BPStatus },
    ],
  },
]

const OTC_SUITES = [
  { id: 'sui_1', name: 'Star Cement Cutover Validation Suite', code: 'SC_CUTOVER_VAL', modules: ['SD', 'MM', 'FI'], lastPassRate: 91, scenarioCount: 47 },
  { id: 'sui_2', name: 'SD Core Regression Suite', code: 'SD_CORE_REG', modules: ['SD'], lastPassRate: 96, scenarioCount: 18 },
  { id: 'sui_5', name: 'Hypercare Smoke Suite', code: 'HC_SMOKE', modules: ['SD', 'MM'], lastPassRate: 98, scenarioCount: 12 },
]

const OTC_SCENARIOS = [
  { id: 'sc_1', name: 'OTC Happy Path Domestic', code: 'OTC_HP_DOM', modules: ['SD', 'MM', 'FI'], lastPassRate: 96, taskCount: 7 },
  { id: 'sc_2', name: 'OTC with Credit Hold and Manual Release', code: 'OTC_CREDIT', modules: ['SD', 'FI'], lastPassRate: 88, taskCount: 9 },
  { id: 'sc_5', name: 'OTC Export with Letter of Credit', code: 'OTC_EXPORT_LC', modules: ['SD', 'FI'], lastPassRate: 100, taskCount: 12 },
  { id: 'sc_6', name: 'OTC Returns and Credit Memo', code: 'OTC_RETURNS', modules: ['SD', 'FI'], lastPassRate: 94, taskCount: 8 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const BP_STATUS_META: Record<
  BPStatus,
  { dot: string; ring: string; label: string }
> = {
  passing: { dot: 'bg-emerald-500', ring: 'border-emerald-200 dark:border-emerald-300/40', label: 'Passing' },
  healing: { dot: 'bg-amber-500', ring: 'border-amber-200 dark:border-amber-300/40', label: 'Healing' },
  failing: { dot: 'bg-red-500', ring: 'border-red-200 dark:border-red-300/40', label: 'Failing' },
  not_covered: { dot: 'bg-muted-foreground/50', ring: 'border-border', label: 'Not Covered' },
}

function getPassRateStyle(rate: number) {
  if (rate >= 95) {
    return {
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      barFill: 'bg-emerald-500',
      barTrack: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    }
  }
  if (rate >= 85) {
    return {
      iconColor: 'text-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      barFill: 'bg-amber-500',
      barTrack: 'bg-amber-500/15 dark:bg-amber-500/20',
    }
  }
  return {
    iconColor: 'text-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    barFill: 'bg-red-500',
    barTrack: 'bg-red-500/15 dark:bg-red-500/20',
  }
}

function StatusBar({ value, fill, track }: { value: number; fill: string; track: string }) {
  return (
    <div className={cn('h-1.5 w-full rounded-full overflow-hidden', track)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', fill)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function CatalogBusinessProcessPage() {
  const [selectedProcess, setSelectedProcess] = React.useState('OTC')
  const process =
    BUSINESS_PROCESSES.find((p) => p.id === selectedProcess) || BUSINESS_PROCESSES[0]
  const ProcessIcon = process.icon

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* ───────────── Hero Header ───────────── */}
        <header className="border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
          <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="page-title text-balance">
                  Browse by Business Process
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                  Discover Test Suites and Scenarios organized by SAP business process. Select a
                  process to explore coverage and test assets.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="self-start sm:self-auto shrink-0 h-8 text-xs"
              >
                <Link href="/catalog">
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  View Full Catalog
                </Link>
              </Button>
            </div>

            {/* Process Tabs — horizontally scrollable on mobile */}
            <div
              className="mt-6 sm:mt-8 -mx-4 sm:mx-0 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Business processes"
            >
              <div className="flex items-center gap-2 px-4 sm:px-0 w-max sm:w-full">
                {BUSINESS_PROCESSES.map((bp) => {
                  const Icon = bp.icon
                  const isSelected = selectedProcess === bp.id
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedProcess(bp.id)}
                      className={cn(
                        'group inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium transition-all shrink-0',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        isSelected
                          ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-semibold tracking-tight">{bp.shortName}</span>
                      <span
                        className={cn(
                          'hidden lg:inline text-[11px] font-normal',
                          isSelected ? 'text-brand-foreground/80' : 'text-muted-foreground/80',
                        )}
                      >
                        {bp.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="h-6 sm:h-8" />
        </header>

        {/* ───────────── Body ───────────── */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Hero Process Card */}
          <Card className="border-border bg-gradient-to-br from-brand-soft/30 via-card to-card">
            <CardContent className="sm: lg:">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                {/* Icon */}
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                  <ProcessIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      <span>{process.id}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground font-medium normal-case tracking-normal text-[11px]">
                        Business Process
                      </span>
                    </div>
                    <h2 className="section-title mt-1">
                      {process.name}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                      {process.description}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 text-pretty">
                    {process.narrative}
                  </p>
                </div>
              </div>

              {/* Stats — clean 3-col grid with vertical dividers via divide-x */}
              <div className="mt-5 rounded-xl border border-border bg-background/60 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                  <StatTile
                    icon={<Layers className="h-3.5 w-3.5" />}
                    value={process.suiteCount}
                    label="Suites"
                  />
                  <StatTile
                    icon={<FileText className="h-3.5 w-3.5" />}
                    value={process.scenarioCount}
                    label="Scenarios"
                  />
                  <StatTile
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    value={process.bpScopeItems.length}
                    label="BP Scope Items"
                  />
                </div>
              </div>

              {/* BP Scope Coverage */}
              <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-border">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    BP Scope Coverage
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {process.bpScopeItems.length} items
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {process.bpScopeItems.map((item) => {
                    const meta = BP_STATUS_META[item.status]
                    return (
                      <div
                        key={item.code}
                        className={cn(
                          'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border bg-card',
                          meta.ring,
                        )}
                      >
                        <div className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
                        <span className="font-mono text-[12px] font-semibold text-foreground">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          {item.name}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[11px] text-muted-foreground">
                  {(['passing', 'healing', 'failing', 'not_covered'] as BPStatus[]).map((s) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={cn('w-1.5 h-1.5 rounded-full', BP_STATUS_META[s].dot)} />
                      <span>{BP_STATUS_META[s].label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ───────────── Two-Column List ───────────── */}
          <StaggerGrid columns="grid-cols-1 lg:grid-cols-2" className="gap-6 lg:gap-8" fast>
            {/* Suites */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                Test Suites
              </h3>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Link href="/test-repository/suites">
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              </div>
              <div className="space-y-3">
                {OTC_SUITES.map((suite) => (
                  <ItemCard
                    key={suite.id}
                    href={`/test-repository/suites/${suite.id}`}
                    name={suite.name}
                    code={suite.code}
                    modules={suite.modules}
                    passRate={suite.lastPassRate}
                    count={suite.scenarioCount}
                    countLabel="scenarios"
                  />
                ))}
              </div>
            </section>

            {/* Scenarios */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                Test Scenarios
              </h3>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Link href="/test-repository/scenarios">
                  View All
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              </div>
              <div className="space-y-3">
                {OTC_SCENARIOS.map((scenario) => (
                  <ItemCard
                    key={scenario.id}
                    href={`/test-repository/scenarios/${scenario.id}`}
                    name={scenario.name}
                    code={scenario.code}
                    modules={scenario.modules}
                    passRate={scenario.lastPassRate}
                    count={scenario.taskCount}
                    countLabel="tasks"
                  />
                ))}
              </div>
            </section>
          </StaggerGrid>
        </main>
      </div>
    </AppShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatTile({
  icon,
  value,
  label,
  className,
}: {
  icon: React.ReactNode
  value: number
  label: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2.5 min-w-0 px-3.5 py-3 sm:px-4 sm:py-3.5', className)}>
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft/60 text-brand shrink-0">
        {icon}
      </div>
      <div className="min-w-0 leading-tight">
        <div className="text-base sm:text-lg font-bold text-foreground tabular-nums">{value}</div>
        <div className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5 truncate">
          {label}
        </div>
      </div>
    </div>
  )
}

function ItemCard({
  href,
  name,
  code,
  modules,
  passRate,
  count,
  countLabel,
}: {
  href: string
  name: string
  code: string
  modules: string[]
  passRate: number
  count: number
  countLabel: string
}) {
  const rate = getPassRateStyle(passRate)
  return (
    <Card className="group border-border hover:border-brand/50 hover:shadow-md transition-all duration-200">
      <CardContent className=".5 sm:">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Link
              href={href}
              className="group/link inline-flex items-start gap-1.5 font-semibold text-xs sm:text-sm text-foreground hover:text-brand transition-colors leading-snug"
            >
              <span className="line-clamp-2">{name}</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground group-hover/link:text-brand transition-colors" />
            </Link>
            <p className="page-description text-[10px] ]">
              {code}
            </p>
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {modules.map((mod) => (
                <Badge
                  key={mod}
                  variant="secondary"
                  className="h-4 px-1.5 text-[9px] font-mono font-semibold bg-muted text-muted-foreground hover:bg-muted"
                >
                  {mod}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <div className="flex items-center justify-end gap-1">
              <TrendingUp className={cn('h-3 w-3', rate.iconColor)} />
              <span className={cn('text-sm sm:text-base font-bold leading-none tabular-nums', rate.textColor)}>
                {passRate}%
              </span>
            </div>
            <p className="page-description text-[10px] whitespace-nowrap">
              {count} {countLabel}
            </p>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3">
          <StatusBar value={passRate} fill={rate.barFill} track={rate.barTrack} />
        </div>
      </CardContent>
    </Card>
  )
}
