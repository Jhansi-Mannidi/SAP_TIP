'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Play,
  RefreshCw,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  MessageSquarePlus,
  Rocket,
  Eye,
  LayoutGrid,
  Layers,
  Code2,
  History,
  AlertTriangle,
  Monitor,
  Link2,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { KpiStatCard, StaggerGrid } from '@/components/design-system'
import {
  TransportOverviewPanel,
  TransportObjectsPanel,
  TransportPipelinePanel,
  TransportScreenDiffPanel,
  TransportImpactPanel,
  TransportLinkedTestsPanel,
  TransportAbapPanel,
  TransportAuditPanel,
} from '@/components/transports/transport-detail-tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { AnimatedNumber } from '@/lib/animations'

import {
  MOCK_TRANSPORTS,
  type Transport,
  type TransportState,
} from '@/lib/transport-mock-data'

const TAB_IDS = [
  'overview',
  'objects',
  'pipeline',
  'screen-diff',
  'impact',
  'linked-tests',
  'abap',
  'audit',
] as const

type TabId = (typeof TAB_IDS)[number]

function getStatePillClass(state: TransportState): string {
  switch (state) {
    case 'Test_Plan_Ready':
      return 'pill pill-brand'
    case 'Test_Plan_Approved':
    case 'Released_to_QAS':
    case 'Released_to_PROD':
      return 'pill pill-success'
    case 'Analyzed':
    case 'In_Test':
      return 'pill pill-info'
    default:
      return 'pill pill-neutral'
  }
}

function getRiskArcColor(band: string): string {
  if (band === 'critical') return '#dc2626'
  if (band === 'high') return '#ea580c'
  if (band === 'medium') return '#d97706'
  return '#16a34a'
}

function getRiskTextClass(band: string): string {
  if (band === 'critical') return 'text-red-600 dark:text-red-400'
  if (band === 'high') return 'text-orange-600 dark:text-orange-400'
  if (band === 'medium') return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

function RiskGauge({ score, band }: { score: number; band: string }) {
  const percentage = score * 100
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-8 shrink-0">
        <svg viewBox="0 0 48 24" className="w-full h-full">
          <path
            d="M 4 20 A 20 20 0 0 1 44 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/60"
          />
          <path
            d="M 4 20 A 20 20 0 0 1 44 20"
            fill="none"
            stroke={getRiskArcColor(band)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 0.63} 100`}
          />
        </svg>
      </div>
      <div>
        <p className="micro-label">Risk Score</p>
        <p className={cn('text-2xl font-bold tabular-nums leading-none', getRiskTextClass(band))}>
          <AnimatedNumber value={Math.round(percentage)} suffix="%" duration={0.85} className="inline" />
        </p>
      </div>
    </div>
  )
}

function TransportDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const transportId = params.id as string
  const transport: Transport =
    MOCK_TRANSPORTS.find((t) => t.id === transportId) || MOCK_TRANSPORTS[0]

  const tabParam = searchParams.get('tab')
  const activeTab: TabId = TAB_IDS.includes(tabParam as TabId) ? (tabParam as TabId) : 'overview'

  const setTab = (tab: string) => {
    const url = tab === 'overview' ? pathname : `${pathname}?tab=${tab}`
    router.replace(url, { scroll: false })
  }

  const abapFindings = transport.objects.reduce((sum, o) => sum + o.abap_findings_count, 0)

  const canRunImpactAnalysis = ['Captured', 'Classified'].includes(transport.state)
  const canTriggerRegeneration = transport.state === 'Analyzed'
  const canApproveTestPlan = transport.state === 'Test_Plan_Ready'
  const canPromoteToQAS = transport.state === 'In_Test'
  const canPromoteToPROD = transport.state === 'Released_to_QAS'

  const tabTriggerClass =
    'data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:text-foreground rounded-none h-11 px-2 sm:px-3 text-xs sm:text-sm shrink-0 gap-1.5'

  return (
    <Tabs value={activeTab} onValueChange={setTab} className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
      <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/transports" className="hover:text-foreground transition-colors">
              Transports
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="font-mono font-medium text-foreground">{transport.tr_number}</span>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="page-title font-mono">{transport.tr_number}</h1>
                <Badge className={cn('h-6 text-[11px] border-0', getStatePillClass(transport.state))}>
                  {transport.state.replace(/_/g, ' ')}
                </Badge>
                <Badge variant="outline" className="font-mono h-6 text-[11px]">
                  {transport.source_system}
                </Badge>
                {transport.risk_band === 'critical' && (
                  <Badge className="pill pill-danger h-6 text-[11px] border-0 gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Critical Risk
                  </Badge>
                )}
              </div>
              <p className="page-description">{transport.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">
                      {transport.owner.avatar_initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{transport.owner.name}</span>
                  <span className="caption-text">({transport.owner.role})</span>
                </div>
                {transport.linked_migration_name && (
                  <Badge variant="outline" className="h-6 gap-1 text-[11px]">
                    <Rocket className="h-3 w-3" />
                    {transport.linked_migration_name}
                  </Badge>
                )}
              </div>
            </div>
            <RiskGauge score={transport.risk_score} band={transport.risk_band} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canRunImpactAnalysis && (
              <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => setTab('impact')}>
                <Play className="h-4 w-4" />
                Run Impact Analysis
              </Button>
            )}
            {canTriggerRegeneration && (
              <Button size="sm" variant="secondary" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
            {canApproveTestPlan && (
              <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                <CheckCircle className="h-4 w-4" />
                Approve Test Plan
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Suite
            </Button>
            {canPromoteToQAS && (
              <Button size="sm" variant="secondary" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Promote to QAS
              </Button>
            )}
            {canPromoteToPROD && (
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Rocket className="h-4 w-4" />
                Promote to PROD
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              Comment
            </Button>
          </div>

          {activeTab === 'overview' && (
            <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-2.5 w-full" fast>
              <KpiStatCard label="Objects" value={transport.objects.length} icon={Layers} tone="brand" className="min-h-[5rem]" />
              <KpiStatCard label="Linked Tests" value={transport.linked_tests_count} icon={Link2} tone="info" className="min-h-[5rem]" />
              <KpiStatCard label="Screen Diffs" value={transport.screen_diffs.length} icon={Monitor} tone="warning" className="min-h-[5rem]" />
              <KpiStatCard label="ABAP Findings" value={abapFindings} icon={Code2} tone={abapFindings > 0 ? 'danger' : 'neutral'} className="min-h-[5rem]" />
            </StaggerGrid>
          )}
        </div>

        <div className="border-t border-border px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <TabsList className="h-11 bg-transparent justify-start p-0 gap-1 min-w-max w-full">
            <TabsTrigger value="overview" className={tabTriggerClass}>
              <Eye className="h-4 w-4 shrink-0" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="objects" className={tabTriggerClass}>
              <Layers className="h-4 w-4 shrink-0" />
              Objects
              <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{transport.objects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pipeline" className={tabTriggerClass}>
              <LayoutGrid className="h-4 w-4 shrink-0" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="screen-diff" className={tabTriggerClass}>
              <Monitor className="h-4 w-4 shrink-0" />
              Screen Diff
            </TabsTrigger>
            <TabsTrigger value="impact" className={tabTriggerClass}>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Impact
              {transport.impact_verdicts.length > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">{transport.impact_verdicts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="linked-tests" className={tabTriggerClass}>
              <Link2 className="h-4 w-4 shrink-0" />
              Linked Tests
            </TabsTrigger>
            <TabsTrigger value="abap" className={tabTriggerClass}>
              <Code2 className="h-4 w-4 shrink-0" />
              ABAP
            </TabsTrigger>
            <TabsTrigger value="audit" className={tabTriggerClass}>
              <History className="h-4 w-4 shrink-0" />
              Audit
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
              {activeTab === 'overview' && <TransportOverviewPanel transport={transport} />}
            </TabsContent>
            <TabsContent value="objects" className="mt-0 focus-visible:outline-none">
              {activeTab === 'objects' && (
                <TransportObjectsPanel transport={transport} onTabChange={setTab} />
              )}
            </TabsContent>
            <TabsContent value="pipeline" className="mt-0 focus-visible:outline-none">
              {activeTab === 'pipeline' && <TransportPipelinePanel transport={transport} />}
            </TabsContent>
            <TabsContent value="screen-diff" className="mt-0 focus-visible:outline-none">
              {activeTab === 'screen-diff' && <TransportScreenDiffPanel transport={transport} />}
            </TabsContent>
            <TabsContent value="impact" className="mt-0 focus-visible:outline-none">
              {activeTab === 'impact' && <TransportImpactPanel transport={transport} />}
            </TabsContent>
            <TabsContent value="linked-tests" className="mt-0 focus-visible:outline-none">
              {activeTab === 'linked-tests' && <TransportLinkedTestsPanel transport={transport} />}
            </TabsContent>
            <TabsContent value="abap" className="mt-0 focus-visible:outline-none">
              {activeTab === 'abap' && <TransportAbapPanel transport={transport} />}
            </TabsContent>
            <TabsContent value="audit" className="mt-0 focus-visible:outline-none">
              {activeTab === 'audit' && <TransportAuditPanel transport={transport} />}
            </TabsContent>
          </AnimatePresence>
        </div>
      </div>
    </Tabs>
  )
}

export default function TransportDetailPage() {
  return (
    <AppShell currentApp="transport-intelligence">
      <Suspense fallback={<div className="p-8 text-muted-foreground text-sm">Loading transport…</div>}>
        <TransportDetailContent />
      </Suspense>
    </AppShell>
  )
}
