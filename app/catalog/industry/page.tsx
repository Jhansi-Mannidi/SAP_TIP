'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  FileText,
  Fuel,
  ShoppingBag,
  Factory,
  Car,
  FlaskConical,
  Pill,
  Building2,
  Zap,
  Code2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'

// ------------------------------------------------------------------
// Industry Solution definitions — neutral, on-brand. Per-industry
// colors removed; every industry uses the unified amber brand identity.
// ------------------------------------------------------------------
const industrySolutions = [
  {
    id: 'IS-OIL',
    name: 'Oil & Gas',
    icon: Fuel,
    description:
      'Downstream, upstream, and midstream oil and gas operations including hydrocarbon product management, exchange dealings, and JV accounting.',
  },
  {
    id: 'IS-RETAIL',
    name: 'Retail',
    icon: ShoppingBag,
    description:
      'Retail-specific processes including POS integration, markdown optimization, store operations, and omnichannel fulfillment.',
  },
  {
    id: 'IS-MILL',
    name: 'Mill Products',
    icon: Factory,
    description:
      'Process manufacturing for cement, steel, paper, textiles and other mill industries with batch management and quality control.',
  },
  {
    id: 'IS-AUTO',
    name: 'Automotive',
    icon: Car,
    description:
      'Automotive industry processes including vehicle management, JIT/JIS delivery, and sequential part delivery.',
  },
  {
    id: 'IS-CHEM',
    name: 'Chemicals',
    icon: FlaskConical,
    description:
      'Chemical industry processes including dangerous goods management, recipe management, and regulatory compliance.',
  },
  {
    id: 'IS-PHARMA',
    name: 'Pharmaceuticals',
    icon: Pill,
    description:
      'Pharmaceutical processes including batch traceability, GxP compliance, serialization, and clinical trial management.',
  },
  {
    id: 'IS-PUBSEC',
    name: 'Public Sector',
    icon: Building2,
    description:
      'Government and public sector processes including funds management, grants, and public procurement.',
  },
  {
    id: 'IS-UTILITIES',
    name: 'Utilities',
    icon: Zap,
    description:
      'Utilities industry processes including device management, meter reading, and billing for energy and water providers.',
  },
] as const

type IndustryContent = {
  suites: Array<{ id: string; name: string; scenarios: number; passRate: number }>
  scenarios: Array<{ id: string; name: string; tcodes: string[]; passRate: number }>
  tcodes: string[]
  zobjects: string[]
  stats: { scenarios: number; cases: number; tcodes: number; zobjects: number }
}

// ------------------------------------------------------------------
// Industry-specific content (unchanged data — only presentation moved).
// ------------------------------------------------------------------
const industryContent: Record<string, IndustryContent> = {
  'IS-MILL': {
    stats: { scenarios: 8, cases: 32, tcodes: 15, zobjects: 4 },
    tcodes: ['COOIS', 'COR1', 'COR2', 'CO11N', 'CO15', 'MIGO', 'QA32', 'QE51N', 'MB52', 'MB51', 'MM60', 'MCBA', 'MCP1', 'CO03', 'CO02'],
    zobjects: ['Z_MILL_BATCH_SPLIT', 'Z_CEMENT_GRADE_CHECK', 'Z_KILN_TEMP_MONITOR', 'Z_SILO_INVENTORY'],
    suites: [
      { id: 'suite_mill_1', name: 'Cement Production Validation Suite', scenarios: 5, passRate: 94 },
      { id: 'suite_mill_2', name: 'Mill Quality Control Suite', scenarios: 3, passRate: 100 },
    ],
    scenarios: [
      { id: 'sc_mill_1', name: 'Cement Batch Production Order', tcodes: ['COR1', 'CO11N', 'CO15'], passRate: 96 },
      { id: 'sc_mill_2', name: 'Kiln Temperature Quality Check', tcodes: ['QA32', 'QE51N'], passRate: 100 },
      { id: 'sc_mill_3', name: 'Raw Material Batch Consumption', tcodes: ['MIGO', 'MB51'], passRate: 92 },
      { id: 'sc_mill_4', name: 'Silo Inventory Reconciliation', tcodes: ['MB52', 'MCBA'], passRate: 88 },
    ],
  },
  'IS-OIL': {
    stats: { scenarios: 6, cases: 28, tcodes: 12, zobjects: 3 },
    tcodes: ['OIAA', 'OIAB', 'OIAC', 'OIA1', 'OIA2', 'OIBP', 'OIBS', 'MIGO', 'VL01N', 'VF01', 'MB1C', 'MB1A'],
    zobjects: ['Z_HYDROCARBON_MGMT', 'Z_JV_ACCOUNTING', 'Z_PIPELINE_TRACK'],
    suites: [
      { id: 'suite_oil_1', name: 'Hydrocarbon Product Management Suite', scenarios: 4, passRate: 91 },
      { id: 'suite_oil_2', name: 'JV Accounting Validation Suite', scenarios: 2, passRate: 100 },
    ],
    scenarios: [
      { id: 'sc_oil_1', name: 'Hydrocarbon Inventory Movement', tcodes: ['OIAA', 'MB1C'], passRate: 94 },
      { id: 'sc_oil_2', name: 'Pipeline Receipt Processing', tcodes: ['OIBP', 'MIGO'], passRate: 88 },
      { id: 'sc_oil_3', name: 'Exchange Dealings Settlement', tcodes: ['OIBS', 'VF01'], passRate: 96 },
    ],
  },
  'IS-RETAIL': {
    stats: { scenarios: 5, cases: 22, tcodes: 10, zobjects: 2 },
    tcodes: ['WPMA', 'WPCR', 'WRF1', 'WRMA', 'VA01', 'VL01N', 'MIGO', 'MB52', 'WA01', 'WPUBON'],
    zobjects: ['Z_POS_INTEGRATION', 'Z_MARKDOWN_OPT'],
    suites: [
      { id: 'suite_ret_1', name: 'Store Operations Validation Suite', scenarios: 3, passRate: 97 },
      { id: 'suite_ret_2', name: 'POS Integration Suite', scenarios: 2, passRate: 92 },
    ],
    scenarios: [
      { id: 'sc_ret_1', name: 'Store Replenishment Order', tcodes: ['WPMA', 'VA01'], passRate: 98 },
      { id: 'sc_ret_2', name: 'POS Sales Upload', tcodes: ['WPCR', 'WPUBON'], passRate: 90 },
      { id: 'sc_ret_3', name: 'Markdown Processing', tcodes: ['WRF1', 'WRMA'], passRate: 95 },
    ],
  },
  'IS-AUTO': {
    stats: { scenarios: 4, cases: 18, tcodes: 9, zobjects: 2 },
    tcodes: ['VL06I', 'JITC', 'JITM', 'JITO', 'VA01', 'VL01N', 'MIGO', 'CO01', 'CO15'],
    zobjects: ['Z_JIT_CALL', 'Z_SEQ_DELIVERY'],
    suites: [
      { id: 'suite_auto_1', name: 'JIT/JIS Delivery Suite', scenarios: 2, passRate: 95 },
      { id: 'suite_auto_2', name: 'Vehicle Production Suite', scenarios: 2, passRate: 89 },
    ],
    scenarios: [
      { id: 'sc_auto_1', name: 'JIT Call Processing', tcodes: ['JITC', 'JITM'], passRate: 96 },
      { id: 'sc_auto_2', name: 'Sequential Part Delivery', tcodes: ['JITO', 'VL01N'], passRate: 92 },
    ],
  },
  'IS-CHEM': {
    stats: { scenarios: 5, cases: 24, tcodes: 11, zobjects: 3 },
    tcodes: ['VL01N', 'VL02N', 'MIGO', 'QA32', 'RCR1', 'RCR2', 'MB1C', 'CO01', 'CO15', 'EHSM', 'DGDC'],
    zobjects: ['Z_DG_CLASSIFICATION', 'Z_RECIPE_MGMT', 'Z_REG_COMPLIANCE'],
    suites: [
      { id: 'suite_chem_1', name: 'Dangerous Goods Handling Suite', scenarios: 3, passRate: 100 },
      { id: 'suite_chem_2', name: 'Recipe Management Suite', scenarios: 2, passRate: 94 },
    ],
    scenarios: [
      { id: 'sc_chem_1', name: 'DG Classification Check', tcodes: ['DGDC', 'EHSM'], passRate: 100 },
      { id: 'sc_chem_2', name: 'Recipe-Based Production', tcodes: ['RCR1', 'CO01'], passRate: 92 },
    ],
  },
  'IS-PHARMA': {
    stats: { scenarios: 6, cases: 30, tcodes: 13, zobjects: 4 },
    tcodes: ['QA32', 'QE51N', 'MIGO', 'MB1C', 'CO11N', 'CO15', 'VL01N', 'HU02', 'APTS', 'APTT', 'CBP1', 'CBP2', 'PHSN'],
    zobjects: ['Z_BATCH_GENEALOGY', 'Z_GXP_VALIDATION', 'Z_SERIALIZATION', 'Z_CLINICAL_TRIAL'],
    suites: [
      { id: 'suite_pharma_1', name: 'GxP Compliance Validation Suite', scenarios: 3, passRate: 100 },
      { id: 'suite_pharma_2', name: 'Serialization & Track Suite', scenarios: 3, passRate: 97 },
    ],
    scenarios: [
      { id: 'sc_pharma_1', name: 'Batch Genealogy Tracking', tcodes: ['QA32', 'HU02'], passRate: 100 },
      { id: 'sc_pharma_2', name: 'Serialization Assignment', tcodes: ['PHSN', 'VL01N'], passRate: 96 },
      { id: 'sc_pharma_3', name: 'Clinical Trial Material', tcodes: ['CBP1', 'CBP2'], passRate: 98 },
    ],
  },
  'IS-PUBSEC': {
    stats: { scenarios: 4, cases: 16, tcodes: 8, zobjects: 2 },
    tcodes: ['FMBB', 'FMBC', 'FMBD', 'FMRP', 'GM01', 'GM02', 'ME21N', 'MIGO'],
    zobjects: ['Z_FUNDS_RESERVATION', 'Z_GRANT_MGMT'],
    suites: [
      { id: 'suite_pub_1', name: 'Funds Management Suite', scenarios: 2, passRate: 100 },
      { id: 'suite_pub_2', name: 'Grant Processing Suite', scenarios: 2, passRate: 95 },
    ],
    scenarios: [
      { id: 'sc_pub_1', name: 'Budget Availability Check', tcodes: ['FMBB', 'FMBC'], passRate: 100 },
      { id: 'sc_pub_2', name: 'Grant-Funded Procurement', tcodes: ['GM01', 'ME21N'], passRate: 94 },
    ],
  },
  'IS-UTILITIES': {
    stats: { scenarios: 5, cases: 20, tcodes: 10, zobjects: 3 },
    tcodes: ['EL01', 'EL02', 'EL30', 'EL35', 'EA00', 'EA10', 'EC50', 'EC60', 'VKM1', 'FPE1'],
    zobjects: ['Z_METER_READING', 'Z_DEVICE_MGMT', 'Z_BILLING_CYCLE'],
    suites: [
      { id: 'suite_util_1', name: 'Meter-to-Cash Suite', scenarios: 3, passRate: 93 },
      { id: 'suite_util_2', name: 'Device Management Suite', scenarios: 2, passRate: 98 },
    ],
    scenarios: [
      { id: 'sc_util_1', name: 'Meter Reading Upload', tcodes: ['EL30', 'EL35'], passRate: 94 },
      { id: 'sc_util_2', name: 'Billing Document Creation', tcodes: ['EA00', 'EA10'], passRate: 92 },
      { id: 'sc_util_3', name: 'Device Installation', tcodes: ['EL01', 'EL02'], passRate: 100 },
    ],
  },
}

// ------------------------------------------------------------------
// Pass-rate → visual treatment (status-aware progress + percentage).
// ------------------------------------------------------------------
function passRateStyle(value: number) {
  if (value >= 95) {
    return {
      textColor: 'text-emerald-600 dark:text-emerald-400',
      iconColor: 'text-emerald-500',
      barFill: 'bg-emerald-500',
      barTrack: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    }
  }
  if (value >= 85) {
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

export default function CatalogByIndustryPage() {
  const [selectedIndustry, setSelectedIndustry] = React.useState('IS-MILL')

  const industry = industrySolutions.find((i) => i.id === selectedIndustry)!
  const content = industryContent[selectedIndustry] || industryContent['IS-MILL']
  const IndustryIcon = industry.icon

  return (
    <AppShell currentApp="catalog">
      <div className="space-y-5">
        {/* ---------- Page header ---------- */}
        <Card className="border-border">
          <CardContent className="sm:">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <h1 className="page-title text-balance">
                  Browse by Industry Solution
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                  Discover Test Suites and Scenarios tailored for SAP Industry Solutions with
                  industry-specific T-codes and custom objects.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="self-start sm:self-auto shrink-0 h-8 text-xs"
              >
                <Link href="/catalog">
                  View Full Catalog
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Industry pill tabs ---------- */}
        <Card className="border-border">
          <CardContent className="sm:.5">
            <div
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin"
              role="tablist"
              aria-label="SAP Industry Solutions"
            >
              {industrySolutions.map((ind) => {
                const Icon = ind.icon
                const isSelected = selectedIndustry === ind.id
                return (
                  <button
                    key={ind.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedIndustry(ind.id)}
                    className={cn(
                      'group inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-medium transition-all shrink-0',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                      isSelected
                        ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-semibold tracking-tight font-mono">{ind.id}</span>
                    <span
                      className={cn(
                        'hidden lg:inline text-[11px] font-normal',
                        isSelected ? 'text-brand-foreground/80' : 'text-muted-foreground/80',
                      )}
                    >
                      {ind.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ---------- Hero (selected industry) ---------- */}
        <Card className="border-border bg-gradient-to-br from-brand-soft/30 via-card to-card">
          <CardContent className="sm: lg:">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
              {/* Brand icon tile */}
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <IndustryIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              {/* Title + description */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    <span className="font-mono">{industry.id}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground font-medium normal-case tracking-normal text-[11px]">
                      SAP Industry Solution
                    </span>
                  </div>
                  <h2 className="section-title mt-1">
                    {industry.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                    {industry.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats — clean 4-col grid with vertical dividers via divide-x */}
            <div className="mt-5 rounded-xl border border-border bg-background/60 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y divide-x sm:divide-y-0 divide-border">
                <StatTile icon={<FileText className="h-3.5 w-3.5" />} value={content.stats.scenarios} label="Scenarios" />
                <StatTile icon={<Layers className="h-3.5 w-3.5" />} value={content.stats.cases} label="Test Cases" />
                <StatTile icon={<Code2 className="h-3.5 w-3.5" />} value={content.stats.tcodes} label="T-Codes" />
                <StatTile icon={<Sparkles className="h-3.5 w-3.5" />} value={content.stats.zobjects} label="Z-Objects" />
              </div>
            </div>

            {/* T-Codes */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Code2 className="h-3.5 w-3.5" />
                  Industry T-Codes Covered
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/70">
                  {content.tcodes.length} total
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {content.tcodes.slice(0, 12).map((tcode) => (
                  <Badge
                    key={tcode}
                    variant="secondary"
                    className="h-5 px-1.5 font-mono text-[10px] font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted"
                  >
                    {tcode}
                  </Badge>
                ))}
                {content.tcodes.length > 12 && (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground"
                  >
                    +{content.tcodes.length - 12} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Z-Objects */}
            {content.zobjects.length > 0 && (
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-brand" />
                    Custom Z-Objects Exercised
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/70">
                    {content.zobjects.length} total
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {content.zobjects.map((zobj) => (
                    <Badge
                      key={zobj}
                      className="h-5 px-1.5 gap-1 font-mono text-[10px] font-semibold bg-brand-soft/60 text-brand border border-brand/30 hover:bg-brand-soft/60"
                    >
                      {zobj}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------- Suites + Scenarios two-column grid ---------- */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
          {/* Suites */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                Test Suites
                <span className="ml-1 text-[10px] font-mono text-muted-foreground/70">
                  {content.suites.length}
                </span>
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
              {content.suites.map((suite) => (
                <ItemCard
                  key={suite.id}
                  name={suite.name}
                  href={`/test-repository/suites/${suite.id}`}
                  count={suite.scenarios}
                  countLabel="scenarios"
                  passRate={suite.passRate}
                />
              ))}
              {content.suites.length === 0 && <EmptyState />}
            </div>
          </section>

          {/* Scenarios */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                Test Scenarios
                <span className="ml-1 text-[10px] font-mono text-muted-foreground/70">
                  {content.scenarios.length}
                </span>
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
              {content.scenarios.map((scenario) => (
                <ItemCard
                  key={scenario.id}
                  name={scenario.name}
                  href={`/test-repository/scenarios/${scenario.id}`}
                  tcodes={scenario.tcodes}
                  passRate={scenario.passRate}
                />
              ))}
              {content.scenarios.length === 0 && <EmptyState />}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

// ------------------------------------------------------------------
// Inline components
// ------------------------------------------------------------------
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
      className={cn('h-1.5 w-full rounded-full overflow-hidden', track)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', fill)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

function ItemCard({
  name,
  href,
  count,
  countLabel,
  tcodes,
  passRate,
}: {
  name: string
  href: string
  count?: number
  countLabel?: string
  tcodes?: string[]
  passRate: number
}) {
  const rate = passRateStyle(passRate)

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
            {typeof count === 'number' && (
              <p className="page-description text-[10px] ]">
                {count} {countLabel}
              </p>
            )}
            {tcodes && tcodes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {tcodes.map((tc) => (
                  <Badge
                    key={tc}
                    variant="secondary"
                    className="h-4 px-1.5 text-[9px] font-mono font-semibold bg-muted text-muted-foreground hover:bg-muted"
                  >
                    {tc}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="text-right shrink-0 space-y-0.5">
            <div className="flex items-center justify-end gap-1">
              <TrendingUp className={cn('h-3 w-3', rate.iconColor)} />
              <span
                className={cn(
                  'text-sm sm:text-base font-bold leading-none tabular-nums',
                  rate.textColor,
                )}
              >
                {passRate}%
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3">
          <StatusBar value={passRate} fill={rate.barFill} track={rate.barTrack} />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed border-border">
      <CardContent className="text-center text-xs text-muted-foreground">
        No items available for this industry solution yet.
      </CardContent>
    </Card>
  )
}
