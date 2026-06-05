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
  Briefcase,
  Calculator,
  ClipboardCheck,
  Code,
  Cog,
  Factory,
  FileText,
  Layers,
  Package,
  ShoppingCart,
  Terminal,
  TrendingUp,
  Users,
  Warehouse,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

// -----------------------------------------------------------------------------
// SAP Module catalog data
// -----------------------------------------------------------------------------
type SapModule = {
  id: string
  name: string
  shortName: string
  icon: LucideIcon
  description: string
  scenarioCount: number
  caseCount: number
  tcodeCount: number
  tcodes: string[]
  zobjects: string[]
}

const SAP_MODULES: SapModule[] = [
  {
    id: 'SD',
    name: 'Sales & Distribution',
    shortName: 'SD',
    icon: ShoppingCart,
    description: 'Sales order processing, pricing, shipping, and billing operations.',
    scenarioCount: 12,
    caseCount: 47,
    tcodeCount: 23,
    tcodes: ['VA01', 'VA02', 'VA03', 'VA05', 'VL01N', 'VL02N', 'VL10A', 'VF01', 'VF02', 'VF03', 'VF11', 'VK11', 'VK12', 'VK13', 'VA42', 'VA43', 'VL06O', 'VL09', 'VF04', 'VF06', 'VF21', 'VF22', 'VF23'],
    zobjects: ['Z_SD_PRICING', 'Z_SD_OUTPUT', 'Z_DELIVERY_SPLIT'],
  },
  {
    id: 'MM',
    name: 'Materials Management',
    shortName: 'MM',
    icon: Package,
    description: 'Procurement, inventory management, and invoice verification.',
    scenarioCount: 8,
    caseCount: 32,
    tcodeCount: 18,
    tcodes: ['ME21N', 'ME22N', 'ME23N', 'ME51N', 'MIGO', 'MIRO', 'MB51', 'MM01', 'MM02', 'MM03', 'MB52', 'MB1A', 'MB1B', 'MB1C', 'ME2M', 'ME2N', 'MIR7', 'MRRL'],
    zobjects: ['Z_MM_PR_APPROVAL', 'Z_VENDOR_EVAL'],
  },
  {
    id: 'FI',
    name: 'Financial Accounting',
    shortName: 'FI',
    icon: Calculator,
    description: 'General ledger, accounts payable/receivable, and asset accounting.',
    scenarioCount: 6,
    caseCount: 28,
    tcodeCount: 15,
    tcodes: ['FB01', 'FB50', 'FB60', 'FB70', 'F-28', 'F-53', 'F110', 'AS01', 'AS02', 'AFAB', 'FAGL_FC', 'F.01', 'F.02', 'FK10N', 'FBL3N'],
    zobjects: ['Z_FI_TAX_CALC', 'Z_PAYMENT_BLOCK'],
  },
  {
    id: 'CO',
    name: 'Controlling',
    shortName: 'CO',
    icon: Briefcase,
    description: 'Cost center accounting, internal orders, and profitability analysis.',
    scenarioCount: 4,
    caseCount: 18,
    tcodeCount: 12,
    tcodes: ['KS01', 'KS02', 'KO01', 'KO02', 'KB21N', 'KE21N', 'KSB1', 'S_ALR_87013611', 'CO43', 'CK11N', 'CK40N', 'CKMLCP'],
    zobjects: ['Z_CO_SETTLEMENT'],
  },
  {
    id: 'PP',
    name: 'Production Planning',
    shortName: 'PP',
    icon: Factory,
    description: 'Manufacturing execution, MRP, and shop floor control.',
    scenarioCount: 5,
    caseCount: 22,
    tcodeCount: 14,
    tcodes: ['CO01', 'CO02', 'CO03', 'CO11N', 'CO15', 'MD01', 'MD02', 'MD04', 'CS01', 'CS02', 'CA01', 'CR01', 'MF42N', 'COHV'],
    zobjects: ['Z_PP_BATCH_SPLIT', 'Z_MRP_CUSTOM'],
  },
  {
    id: 'WM',
    name: 'Warehouse Management',
    shortName: 'WM',
    icon: Warehouse,
    description: 'Warehouse operations, storage bin management, and picking.',
    scenarioCount: 3,
    caseCount: 14,
    tcodeCount: 10,
    tcodes: ['LT01', 'LT02', 'LT03', 'LT10', 'LT11', 'LT12', 'LS01', 'LS02', 'LX01', 'LX02'],
    zobjects: ['Z_WM_PUTAWAY'],
  },
  {
    id: 'HCM',
    name: 'Human Capital Mgmt',
    shortName: 'HCM',
    icon: Users,
    description: 'Personnel administration, payroll, and organizational management.',
    scenarioCount: 4,
    caseCount: 16,
    tcodeCount: 12,
    tcodes: ['PA30', 'PA40', 'PA20', 'PA61', 'PT01', 'PT60', 'PC00_M99', 'PU03', 'PP01', 'PPOME', 'PA03', 'PA71'],
    zobjects: ['Z_HR_BONUS_CALC'],
  },
  {
    id: 'PM',
    name: 'Plant Maintenance',
    shortName: 'PM',
    icon: Wrench,
    description: 'Equipment management, maintenance orders, and notifications.',
    scenarioCount: 3,
    caseCount: 12,
    tcodeCount: 10,
    tcodes: ['IW21', 'IW22', 'IW31', 'IW32', 'IW38', 'IW39', 'IE01', 'IE02', 'IL01', 'IL02'],
    zobjects: ['Z_PM_WORK_ORDER'],
  },
  {
    id: 'QM',
    name: 'Quality Management',
    shortName: 'QM',
    icon: ClipboardCheck,
    description: 'Quality inspection, quality notifications, and certificates.',
    scenarioCount: 2,
    caseCount: 8,
    tcodeCount: 8,
    tcodes: ['QA01', 'QA02', 'QA11', 'QM01', 'QM02', 'QP01', 'QP02', 'QS21'],
    zobjects: ['Z_QM_INSPECTION'],
  },
  {
    id: 'PS',
    name: 'Project System',
    shortName: 'PS',
    icon: Box,
    description: 'Project planning, budgeting, and execution tracking.',
    scenarioCount: 2,
    caseCount: 10,
    tcodeCount: 8,
    tcodes: ['CJ01', 'CJ02', 'CJ20N', 'CN21', 'CN22', 'CJ30', 'CJ31', 'CJ40'],
    zobjects: ['Z_PS_MILESTONE'],
  },
]

// Sample suites & scenarios (currently uses SD content for any selected module — preserved from previous version)
const SD_SUITES = [
  { id: 'sui_1', name: 'Star Cement Cutover Validation Suite', code: 'SC_CUTOVER_VAL', modules: ['SD', 'MM', 'FI'], lastPassRate: 91, scenarioCount: 47 },
  { id: 'sui_2', name: 'SD Core Regression Suite', code: 'SD_CORE_REG', modules: ['SD'], lastPassRate: 96, scenarioCount: 18 },
  { id: 'sui_5', name: 'Hypercare Smoke Suite', code: 'HC_SMOKE', modules: ['SD', 'MM'], lastPassRate: 98, scenarioCount: 12 },
]

const SD_SCENARIOS = [
  { id: 'sc_1', name: 'OTC Happy Path Domestic', code: 'OTC_HP_DOM', tcodes: ['VA01', 'VL01N', 'VL02N', 'VF01'], lastPassRate: 96, taskCount: 7 },
  { id: 'sc_2', name: 'OTC with Credit Hold', code: 'OTC_CREDIT', tcodes: ['VA01', 'VA02', 'VKM1', 'VL01N', 'VF01'], lastPassRate: 88, taskCount: 9 },
  { id: 'sc_5', name: 'OTC Export with Letter of Credit', code: 'OTC_EXPORT_LC', tcodes: ['VA01', 'VL01N', 'VF01', 'VF02'], lastPassRate: 100, taskCount: 12 },
  { id: 'sc_6', name: 'Pricing Condition Maintenance', code: 'SD_PRICING', tcodes: ['VK11', 'VK12', 'VK13', 'VA01'], lastPassRate: 94, taskCount: 6 },
]

// -----------------------------------------------------------------------------
// Helpers: pass-rate token sets (semantic only, themes correctly in dark mode)
// -----------------------------------------------------------------------------
function getRateTone(rate: number) {
  if (rate >= 95) {
    return {
      textColor: 'text-emerald-600 dark:text-emerald-400',
      iconColor: 'text-emerald-500',
      barFill: 'bg-emerald-500',
      barTrack: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    }
  }
  if (rate >= 85) {
    return {
      textColor: 'text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-500',
      barFill: 'bg-amber-500',
      barTrack: 'bg-amber-500/15 dark:bg-amber-500/20',
    }
  }
  return {
    textColor: 'text-red-600 dark:text-red-400',
    iconColor: 'text-red-500',
    barFill: 'bg-red-500',
    barTrack: 'bg-red-500/15 dark:bg-red-500/20',
  }
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------
export default function CatalogModulePage() {
  const [selectedModule, setSelectedModule] = React.useState('SD')
  const moduleData = SAP_MODULES.find((m) => m.id === selectedModule) || SAP_MODULES[0]
  const ModuleIcon = moduleData.icon

  return (
    <AppShell>
      <div className="min-h-screen bg-muted/30">
        {/* ─────────── Header ─────────── */}
        <div className="border-b border-border bg-card">
          <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h1 className="page-title text-balance">
                  Browse by SAP Module
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                  Discover Test Suites and Scenarios organized by SAP module. Select a module to
                  explore coverage, T-codes, and Z-objects.
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

            {/* Module pill tabs */}
            <div
              className="mt-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto"
              role="tablist"
              aria-label="SAP modules"
            >
              <div className="inline-flex items-center gap-1.5 pb-1">
                {SAP_MODULES.map((mod) => {
                  const Icon = mod.icon
                  const isSelected = selectedModule === mod.id
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedModule(mod.id)}
                      className={cn(
                        'group inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium transition-all shrink-0',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        isSelected
                          ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-semibold tracking-tight">{mod.shortName}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────── Content ─────────── */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
          {/* Hero card */}
          <Card className="border-border bg-gradient-to-br from-brand-soft/30 via-card to-card">
            <CardContent className="sm: lg:">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                  <ModuleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="flex-1 min-w-0 space-y-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      <span>{moduleData.id}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground font-medium normal-case tracking-normal text-[11px]">
                        SAP Module
                      </span>
                    </div>
                    <h2 className="section-title mt-1">
                      {moduleData.name}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                      {moduleData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-5 rounded-xl border border-border bg-background/60 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x divide-border [&>*:nth-child(odd)]:border-l-0 sm:[&>*:nth-child(odd)]:border-l">
                  <StatTile
                    icon={<FileText className="h-3.5 w-3.5" />}
                    value={moduleData.scenarioCount}
                    label="Scenarios"
                  />
                  <StatTile
                    icon={<ClipboardCheck className="h-3.5 w-3.5" />}
                    value={moduleData.caseCount}
                    label="Cases"
                  />
                  <StatTile
                    icon={<Terminal className="h-3.5 w-3.5" />}
                    value={moduleData.tcodeCount}
                    label="T-codes"
                  />
                  <StatTile
                    icon={<Code className="h-3.5 w-3.5" />}
                    value={moduleData.zobjects.length}
                    label="Z-objects"
                  />
                </div>
              </div>

              {/* T-codes */}
              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Covers {moduleData.tcodeCount} T-codes including
                  </h3>
                  {moduleData.tcodes.length > 12 && (
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {moduleData.tcodes.length} total
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {moduleData.tcodes.slice(0, 12).map((tcode) => (
                    <Badge
                      key={tcode}
                      variant="outline"
                      className="h-5 px-1.5 font-mono text-[10px] font-semibold border-border bg-card text-foreground"
                    >
                      {tcode}
                    </Badge>
                  ))}
                  {moduleData.tcodes.length > 12 && (
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-medium bg-muted text-muted-foreground"
                    >
                      +{moduleData.tcodes.length - 12} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Z-objects */}
              <div className="mt-4 pt-4 border-t border-border/60">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Z-objects Exercised
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {moduleData.zobjects.map((zobj) => (
                    <Badge
                      key={zobj}
                      variant="secondary"
                      className="h-5 px-1.5 gap-1 font-mono text-[10px] font-semibold bg-brand-soft/60 text-brand border border-brand/30 hover:bg-brand-soft/60"
                    >
                      <Cog className="h-2.5 w-2.5" />
                      {zobj}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-column suites / scenarios */}
          <StaggerGrid columns="grid-cols-1 lg:grid-cols-2" className="gap-5 lg:gap-6" fast>
            {/* Suites */}
            <section className="space-y-3">
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

              <div className="space-y-2.5">
                {SD_SUITES.map((suite) => (
                  <ItemCard
                    key={suite.id}
                    href={`/test-repository/suites/${suite.id}`}
                    name={suite.name}
                    code={suite.code}
                    chips={suite.modules}
                    chipKind="module"
                    passRate={suite.lastPassRate}
                    count={suite.scenarioCount}
                    countLabel="scenarios"
                  />
                ))}
              </div>
            </section>

            {/* Scenarios */}
            <section className="space-y-3">
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

              <div className="space-y-2.5">
                {SD_SCENARIOS.map((scenario) => (
                  <ItemCard
                    key={scenario.id}
                    href={`/test-repository/scenarios/${scenario.id}`}
                    name={scenario.name}
                    code={scenario.code}
                    chips={scenario.tcodes}
                    chipKind="tcode"
                    passRate={scenario.lastPassRate}
                    count={scenario.taskCount}
                    countLabel="tasks"
                  />
                ))}
              </div>
            </section>
          </StaggerGrid>
        </div>
      </div>
    </AppShell>
  )
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------
function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0 px-3.5 py-3 sm:px-4 sm:py-3.5">
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

function StatusBar({
  value,
  fill,
  track,
}: {
  value: number
  fill: string
  track: string
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full', track)}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', fill)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

function ItemCard({
  href,
  name,
  code,
  chips,
  chipKind,
  passRate,
  count,
  countLabel,
}: {
  href: string
  name: string
  code: string
  chips: string[]
  chipKind: 'module' | 'tcode'
  passRate: number
  count: number
  countLabel: string
}) {
  const rate = getRateTone(passRate)
  const visibleChips = chips.slice(0, 4)
  const overflow = chips.length - visibleChips.length

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
              {visibleChips.map((chip) => (
                <Badge
                  key={chip}
                  variant={chipKind === 'tcode' ? 'outline' : 'secondary'}
                  className={cn(
                    'h-4 px-1.5 text-[9px] font-mono font-semibold',
                    chipKind === 'tcode'
                      ? 'border-border bg-card text-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted',
                  )}
                >
                  {chip}
                </Badge>
              ))}
              {overflow > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[9px] font-medium bg-muted text-muted-foreground hover:bg-muted"
                >
                  +{overflow}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <div className="flex items-center justify-end gap-1">
              <TrendingUp className={cn('h-3 w-3', rate.iconColor)} />
              <span
                className={cn('text-sm sm:text-base font-bold leading-none tabular-nums', rate.textColor)}
              >
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
