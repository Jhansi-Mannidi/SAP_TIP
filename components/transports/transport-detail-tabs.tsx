'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Check,
  Clock,
  Circle,
  ArrowRight,
  Download,
  Upload,
  LayoutGrid,
  Layers,
  ExternalLink,
  FileCode2,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Bot,
  User,
  Mail,
  Rocket,
  Box,
  Link2,
  Monitor,
  Code2,
  History,
  Search,
  Play,
  Plus,
  TestTube2,
  AlertCircle,
  Info,
  MessageSquare,
  FileText,
  ChevronDown,
  Gavel,
} from 'lucide-react'

import { KpiStatCard, StaggerGrid } from '@/components/design-system'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'

import {
  TRANSPORT_PIPELINE_STAGES,
  TRANSPORT_STATES,
  type Transport,
  type TransportState,
  type ImpactVerdict,
  type ScreenDiff,
  type ScreenField,
} from '@/lib/transport-mock-data'
import { ScreenDiffViewer, type ScreenModel } from '@/components/screen-diff-viewer'

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

export function TabPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('space-y-4', className)}
    >
      {children}
    </motion.div>
  )
}

function TabEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-card/50">
      <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-muted-foreground/50" />
      </div>
      <h3 className="section-title">{title}</h3>
      <p className="page-description mt-1.5 max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

function SectionHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-description mt-0.5">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Overview (exported pieces used by main page)                               */
/* -------------------------------------------------------------------------- */

export function LifecycleTimeline({ currentState }: { currentState: TransportState }) {
  const currentIndex = TRANSPORT_STATES.indexOf(currentState)
  const progressPct =
    TRANSPORT_STATES.length > 1 ? (currentIndex / (TRANSPORT_STATES.length - 1)) * 100 : 0

  return (
    <div className="w-full">
      <div className="relative mb-3 hidden lg:block">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        <motion.div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand to-[#d4a04a]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
        <div className="relative flex justify-between gap-1">
          {TRANSPORT_STATES.map((state, index) => {
            const isComplete = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <div key={state} className="flex flex-col items-center gap-1.5 min-w-0 flex-1" title={state.replace(/_/g, ' ')}>
                <div
                  className={cn(
                    'h-3 w-3 rounded-full ring-2 ring-background shrink-0',
                    isComplete && 'bg-brand ring-brand/30',
                    isCurrent && 'bg-brand ring-brand/50 shadow-[0_0_0_3px_rgba(184,134,46,0.2)]',
                    !isComplete && !isCurrent && 'bg-muted-foreground/25 ring-transparent',
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight truncate w-full px-0.5',
                    isCurrent && 'font-semibold text-brand',
                    isComplete && 'text-muted-foreground',
                    !isComplete && !isCurrent && 'text-muted-foreground/60',
                  )}
                >
                  {state.replace(/_/g, ' ')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 lg:hidden">
        {TRANSPORT_STATES.map((state, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          return (
            <Badge
              key={state}
              className={cn(
                'h-6 text-[10px] border-0 gap-1',
                isComplete && 'pill pill-brand',
                isCurrent && 'bg-brand text-brand-foreground',
                !isComplete && !isCurrent && 'pill pill-neutral',
              )}
            >
              {isComplete && <Check className="h-3 w-3" />}
              {isCurrent && <Clock className="h-3 w-3" />}
              {state.replace(/_/g, ' ')}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Objects                                                                    */
/* -------------------------------------------------------------------------- */

const objectTypeDescriptions: Record<string, string> = {
  PROG: 'ABAP Program',
  FUGR: 'Function Group',
  TRAN: 'Transaction',
  CUS0: 'Customizing IMG Activity',
  CUS1: 'Customizing Table Entry',
  TABL: 'Table',
}

const categoryPill: Record<string, string> = {
  functional: 'pill pill-info',
  customizing: 'pill pill-brand',
  'z-config': 'pill pill-success',
  'z-program': 'pill pill-success',
  'dialog-transaction': 'pill pill-info',
}

export function TransportObjectsPanel({
  transport,
  onTabChange,
}: {
  transport: Transport
  onTabChange?: (tab: string) => void
}) {
  const zCount = transport.objects.filter((o) => o.object_name.startsWith('Z')).length
  const screensTouched = transport.objects.reduce((s, o) => s + o.screen_models_touched, 0)
  const abapCount = transport.objects.reduce((s, o) => s + o.abap_findings_count, 0)

  return (
    <TabPanel>
      <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-3 w-full" fast>
        <KpiStatCard label="Total Objects" value={transport.objects.length} icon={Box} tone="brand" className="min-h-[5.5rem]" />
        <KpiStatCard label="Z-Objects" value={zCount} icon={Code2} tone="info" className="min-h-[5.5rem]" />
        <KpiStatCard label="Screens Touched" value={screensTouched} icon={Monitor} tone="warning" className="min-h-[5.5rem]" />
        <KpiStatCard label="ABAP Findings" value={abapCount} icon={AlertTriangle} tone={abapCount > 0 ? 'danger' : 'neutral'} className="min-h-[5.5rem]" />
      </StaggerGrid>

      <Card className="shadow-[var(--shadow-xs)] overflow-hidden" padding="flush">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[110px]">Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[140px]">Classification</TableHead>
                <TableHead className="w-[100px] text-center">Screens</TableHead>
                <TableHead className="w-[100px] text-center">ABAP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transport.objects.map((obj) => (
                <TableRow key={obj.id} className="hover:bg-muted/20">
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-brand">{obj.object_type}</span>
                    <p className="caption-text">{objectTypeDescriptions[obj.object_type] || obj.object_type}</p>
                  </TableCell>
                  <TableCell className="font-mono text-sm font-medium">{obj.object_name}</TableCell>
                  <TableCell>
                    <Badge className={cn('h-5 text-[10px] border-0 capitalize', categoryPill[obj.classification_category] || 'pill pill-neutral')}>
                      {obj.classification_category.replace(/-/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {obj.screen_models_touched > 0 ? (
                      <button
                        type="button"
                        onClick={() => onTabChange?.('screen-diff')}
                        className="inline-flex items-center gap-1 text-brand hover:underline text-sm"
                      >
                        {obj.screen_models_touched}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {obj.abap_findings_count > 0 ? (
                      <button
                        type="button"
                        onClick={() => onTabChange?.('abap')}
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline text-sm"
                      >
                        {obj.abap_findings_count}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Pipeline                                                                   */
/* -------------------------------------------------------------------------- */

type StageStatus = 'done' | 'in-progress' | 'pending'

function getStageStatus(index: number, current: number): StageStatus {
  if (index < current) return 'done'
  if (index === current) return 'in-progress'
  return 'pending'
}

const stateToStageIndex: Record<string, number> = {
  Captured: 0,
  Classified: 1,
  Analyzed: 2,
  Test_Plan_Ready: 3,
  Test_Plan_Approved: 4,
  In_Test: 5,
  Released_to_QAS: 6,
  Released_to_PROD: 7,
  Closed: 8,
}

export function TransportPipelinePanel({ transport }: { transport: Transport }) {
  const [selectedStage, setSelectedStage] = React.useState<(typeof TRANSPORT_PIPELINE_STAGES)[0] & { status: StageStatus; details?: Record<string, unknown> } | null>(null)
  const currentStageIndex = stateToStageIndex[transport.state] ?? 3

  const stages = TRANSPORT_PIPELINE_STAGES.map((stage, index) => ({
    ...stage,
    status: getStageStatus(index, currentStageIndex),
    details: {
      summary:
        index === 0
          ? `Extracted ${transport.objects.length} objects from E070/E071/E071K`
          : index === 1
            ? `Classified ${transport.objects.length} objects by type`
            : index === 2
              ? `Analyzed ${transport.linked_tests_count} linked test cases`
              : index === 3
                ? `Generated regeneration plan for impacted tests`
                : index === 4
                  ? `Regenerated test IRs for verdicts marked regenerate`
                  : index === 5
                    ? `Test suite execution in progress`
                    : undefined,
      artifacts:
        index === 0
          ? [{ name: 'Objects', count: transport.objects.length }]
          : index === 2
            ? [
                { name: 'Safe', count: transport.impact_verdicts.filter((v) => v.verdict === 'safe').length },
                { name: 'Regenerate', count: transport.impact_verdicts.filter((v) => v.verdict === 'regenerate').length },
              ]
            : undefined,
    },
  }))

  return (
    <TabPanel>
      <SectionHeader
        title="SATIP Processing Pipeline"
        description="9-stage transport intelligence flow — click a stage for details"
      />

      <Card className="shadow-[var(--shadow-xs)]">
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="pill pill-success h-6 border-0 gap-1"><Check className="h-3 w-3" />Completed</Badge>
            <Badge className="pill pill-info h-6 border-0 gap-1"><Clock className="h-3 w-3" />In Progress</Badge>
            <Badge className="pill pill-neutral h-6 border-0 gap-1"><Circle className="h-3 w-3" />Pending</Badge>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-max gap-1 py-2">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <motion.button
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    whileHover={{ y: -2 }}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-xl border min-w-[150px] max-w-[170px] text-left transition-shadow',
                      stage.status === 'done' && 'border-brand/30 bg-brand/[0.06] hover:shadow-[var(--shadow-sm)]',
                      stage.status === 'in-progress' && 'border-brand ring-2 ring-brand/20 bg-brand/[0.1] shadow-[var(--shadow-sm)]',
                      stage.status === 'pending' && 'border-border bg-muted/20',
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center mb-2',
                        stage.status === 'done' && 'bg-brand text-brand-foreground',
                        stage.status === 'in-progress' && 'bg-brand text-brand-foreground',
                        stage.status === 'pending' && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {stage.status === 'done' && <Check className="h-4 w-4" />}
                      {stage.status === 'in-progress' && <Clock className="h-4 w-4" />}
                      {stage.status === 'pending' && <Circle className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-semibold text-center leading-snug">{stage.name}</span>
                    <span className="caption-text mt-1 text-center line-clamp-1">{stage.output}</span>
                  </motion.button>
                  {index < stages.length - 1 && (
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 mx-0.5',
                        index < currentStageIndex ? 'text-brand' : 'text-muted-foreground/30',
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Current Stage', value: stages[currentStageIndex]?.name || '—', tone: 'text-brand' },
          { label: 'Transport State', value: transport.state.replace(/_/g, ' '), tone: 'text-foreground' },
          { label: 'Linked Tests', value: String(transport.linked_tests_count), tone: 'text-foreground' },
        ].map((item) => (
          <Card key={item.label} className="shadow-[var(--shadow-xs)]">
            <CardContent className="py-3">
              <p className="micro-label">{item.label}</p>
              <p className={cn('text-sm font-semibold mt-1 truncate', item.tone)}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedStage?.name}</SheetTitle>
            <SheetDescription>Stage input, output, and artifacts</SheetDescription>
          </SheetHeader>
          {selectedStage && (
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Input:</span>
                <span>{selectedStage.input}</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Output:</span>
                <span>{selectedStage.output}</span>
              </div>
              {selectedStage.details?.summary && (
                <p className="text-muted-foreground leading-relaxed">{String(selectedStage.details.summary)}</p>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Screen Diff                                                                */
/* -------------------------------------------------------------------------- */

function severityPill(severity: ScreenDiff['severity']): string {
  switch (severity) {
    case 'breaking':
      return 'pill pill-danger'
    case 'minor':
      return 'pill pill-warning'
    case 'cosmetic':
      return 'pill pill-info'
    default:
      return 'pill pill-neutral'
  }
}

function transportFieldsToModel(
  program: string,
  dynpro: string,
  fields: ScreenField[],
  tcode?: string,
): ScreenModel {
  return {
    screenId: `${program}/${dynpro}`,
    title: program,
    tcode,
    fields: fields.map((f) => ({
      id: f.id,
      name: f.name,
      label: f.label,
      type: f.type === 'label' || f.type === 'table' ? 'text' : f.type,
      required: f.required,
    })),
  }
}

const SCREEN_TCODE_MAP: Record<string, string> = {
  'SAPMV45A/4100': 'VA01',
  'SAPLZSDTJ/0100': 'ZSDTJ',
  'SAPMV60A/0200': 'VF01',
  'SAPLFTXP/0100': 'FTXP',
}

function collectFieldChanges(diff: ScreenDiff) {
  const afterById = new Map(diff.after_model.map((f) => [f.id, f]))
  const beforeById = new Map(diff.before_model.map((f) => [f.id, f]))
  const changes: { field: string; change: string; detail: string }[] = []

  for (const field of diff.after_model) {
    const before = beforeById.get(field.id)
    if (!before) {
      changes.push({ field: field.name, change: 'Added', detail: field.label })
      continue
    }
    if (before.required !== field.required) {
      changes.push({
        field: field.name,
        change: 'Modified',
        detail: `Required: ${before.required ? 'yes' : 'no'} → ${field.required ? 'yes' : 'no'}`,
      })
    }
    if (field.changed === 'modified' && before.required === field.required) {
      changes.push({ field: field.name, change: 'Modified', detail: field.label })
    }
  }

  for (const field of diff.before_model) {
    if (!afterById.has(field.id)) {
      changes.push({ field: field.name, change: 'Removed', detail: field.label })
    }
  }

  return changes
}

export function TransportScreenDiffPanel({ transport }: { transport: Transport }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (transport.screen_diffs.length > 0) {
      setSelectedId(transport.screen_diffs[0].id)
    }
  }, [transport.id, transport.screen_diffs])

  if (transport.screen_diffs.length === 0) {
    return (
      <TabPanel>
        <TabEmptyState
          icon={Monitor}
          title="No screen diffs detected"
          description="This transport contains customizing objects with no screen model changes. Screen diff analysis applies when programs or dynpros are modified."
        />
      </TabPanel>
    )
  }

  const selected =
    transport.screen_diffs.find((d) => d.id === selectedId) ?? transport.screen_diffs[0]
  const breaking = transport.screen_diffs.filter((d) => d.severity === 'breaking').length
  const fieldsChanged = transport.screen_diffs.reduce(
    (sum, d) => sum + d.fields_added + d.fields_modified + d.fields_removed,
    0,
  )
  const screenKey = `${selected.program}/${selected.dynpro}`

  return (
    <TabPanel>
      <SectionHeader
        title="Screen Diff Analysis"
        description={`${transport.screen_diffs.length} dynpro screens with model changes detected`}
      />

      <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-3 w-full" fast>
        <KpiStatCard label="Screens Changed" value={transport.screen_diffs.length} icon={Monitor} tone="brand" className="min-h-[5.5rem]" />
        <KpiStatCard label="Breaking" value={breaking} icon={AlertTriangle} tone="danger" className="min-h-[5.5rem]" />
        <KpiStatCard label="Field Changes" value={fieldsChanged} icon={LayoutGrid} tone="warning" className="min-h-[5.5rem]" />
        <KpiStatCard label="Programs" value={new Set(transport.screen_diffs.map((d) => d.program)).size} icon={Code2} tone="info" className="min-h-[5.5rem]" />
      </StaggerGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {transport.screen_diffs.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedId(diff.id)}
              className={cn(
                'w-full text-left rounded-xl border p-3 transition-colors',
                selected.id === diff.id
                  ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                  : 'border-border bg-card hover:bg-muted/20',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold">{diff.program}/{diff.dynpro}</span>
                <Badge className={cn('h-5 text-[10px] border-0 capitalize', severityPill(diff.severity))}>
                  {diff.severity}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{diff.summary}</p>
              <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                <span>{diff.fields_modified} mod</span>
                <span>{diff.fields_added} add</span>
                <span>{diff.fields_removed} rem</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-[var(--shadow-xs)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono">{selected.program} / {selected.dynpro}</CardTitle>
              <CardDescription>{selected.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected.before_model.length > 0 && selected.after_model.length > 0 && (
                <ScreenDiffViewer
                  beforeModel={transportFieldsToModel(
                    selected.program,
                    selected.dynpro,
                    selected.before_model,
                    SCREEN_TCODE_MAP[screenKey],
                  )}
                  afterModel={transportFieldsToModel(
                    selected.program,
                    selected.dynpro,
                    selected.after_model,
                    SCREEN_TCODE_MAP[screenKey],
                  )}
                />
              )}

              {collectFieldChanges(selected).length > 0 && (
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Field</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead>Detail</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {collectFieldChanges(selected).map((row) => (
                        <TableRow key={`${row.field}-${row.change}`}>
                          <TableCell className="font-mono text-xs">{row.field}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                'h-5 text-[10px] border-0',
                                row.change === 'Added'
                                  ? 'pill pill-success'
                                  : row.change === 'Removed'
                                    ? 'pill pill-danger'
                                    : 'pill pill-warning',
                              )}
                            >
                              {row.change}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.detail}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Impact Analysis                                                            */
/* -------------------------------------------------------------------------- */

function verdictPill(verdict: ImpactVerdict): string {
  switch (verdict) {
    case 'safe':
      return 'pill pill-success'
    case 'needs_healing':
      return 'pill pill-warning'
    case 'regenerate':
      return 'pill pill-info'
    case 'broken':
      return 'pill pill-danger'
    default:
      return 'pill pill-neutral'
  }
}

function verdictLabel(verdict: ImpactVerdict): string {
  const labels: Record<ImpactVerdict, string> = {
    safe: 'Safe',
    needs_healing: 'Needs Healing',
    regenerate: 'Regenerate',
    broken: 'Broken',
  }
  return labels[verdict] || verdict
}

export function TransportImpactPanel({ transport }: { transport: Transport }) {
  const verdicts = transport.impact_verdicts

  if (verdicts.length === 0) {
    return (
      <TabPanel>
        <TabEmptyState
          icon={AlertTriangle}
          title="Impact analysis not yet run"
          description="Run impact analysis to generate per-test verdicts for this transport."
          action={
            <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
              <Play className="h-4 w-4" />
              Run Impact Analysis
            </Button>
          }
        />
      </TabPanel>
    )
  }

  const counts = {
    safe: verdicts.filter((v) => v.verdict === 'safe').length,
    needs_healing: verdicts.filter((v) => v.verdict === 'needs_healing').length,
    regenerate: verdicts.filter((v) => v.verdict === 'regenerate').length,
    broken: verdicts.filter((v) => v.verdict === 'broken').length,
  }
  const pending = verdicts.filter((v) => !v.approved).length

  return (
    <TabPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Impact Analysis"
          description={`${verdicts.length} test cases analyzed by Impact Analysis Agent`}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Approve All Safe
          </Button>
          <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
            <RefreshCw className="h-4 w-4" />
            Trigger Regenerations
          </Button>
        </div>
      </div>

      <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-3 w-full" fast>
        <KpiStatCard label="Safe" value={counts.safe} icon={CheckCircle} tone="success" className="min-h-[5.5rem]" />
        <KpiStatCard label="Needs Healing" value={counts.needs_healing} icon={AlertTriangle} tone="warning" className="min-h-[5.5rem]" />
        <KpiStatCard label="Regenerate" value={counts.regenerate} icon={RefreshCw} tone="info" className="min-h-[5.5rem]" />
        <KpiStatCard label="Broken" value={counts.broken} icon={XCircle} tone="danger" className="min-h-[5.5rem]" />
      </StaggerGrid>

      {pending > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {pending} verdict{pending > 1 ? 's' : ''} pending approval
            </p>
            <p className="caption-text mt-0.5">
              All verdicts must be approved before the transport can advance.
            </p>
          </div>
        </div>
      )}

      <Card className="shadow-[var(--shadow-xs)] overflow-hidden" padding="flush">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Test Case</TableHead>
                <TableHead className="hidden md:table-cell">Scenario</TableHead>
                <TableHead className="w-[80px] text-center">Pass %</TableHead>
                <TableHead className="w-[120px]">Verdict</TableHead>
                <TableHead className="w-[80px] text-center">Approved</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verdicts.map((v) => (
                <TableRow key={v.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono text-xs">{v.test_case_code}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{v.test_case_name}</p>
                    <p className="caption-text md:hidden">{v.test_scenario}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell caption-text">{v.test_scenario}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        'text-sm font-semibold tabular-nums',
                        v.last_pass_rate >= 95
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : v.last_pass_rate >= 85
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {v.last_pass_rate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('h-5 text-[10px] border-0', verdictPill(v.verdict))}>
                      {verdictLabel(v.verdict)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {v.approved ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/50 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!v.approved && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Linked Tests                                                               */
/* -------------------------------------------------------------------------- */

interface LinkedTest {
  id: string
  scenario_name: string
  suite_name: string
  link_type: 'auto' | 'manual'
  last_run_status: 'passed' | 'failed' | 'running' | 'pending'
  pass_rate_30d: number
}

const TAX_LINKED_TESTS: LinkedTest[] = [
  { id: 'lt_t1', scenario_name: 'VA01 Sales Order Tax Calc', suite_name: 'Star Cement Cutover Validation Suite', link_type: 'auto', last_run_status: 'passed', pass_rate_30d: 91 },
  { id: 'lt_t2', scenario_name: 'Intercompany Billing Tax', suite_name: 'SD Core Regression Suite', link_type: 'auto', last_run_status: 'failed', pass_rate_30d: 78 },
  { id: 'lt_t3', scenario_name: 'FI Tax Posting Verification', suite_name: 'RTR Core Suite', link_type: 'auto', last_run_status: 'passed', pass_rate_30d: 96 },
  { id: 'lt_t4', scenario_name: 'Export Sales Tax Exemption', suite_name: 'OTC Export Suite', link_type: 'manual', last_run_status: 'pending', pass_rate_30d: 88 },
  { id: 'lt_t5', scenario_name: 'Credit Memo Tax Reversal', suite_name: 'OTC Returns Suite', link_type: 'auto', last_run_status: 'running', pass_rate_30d: 85 },
]

export function TransportLinkedTestsPanel({ transport }: { transport: Transport }) {
  const [search, setSearch] = React.useState('')
  const tests = TAX_LINKED_TESTS
  const filtered = tests.filter((t) => t.scenario_name.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: transport.linked_tests_count,
    passed: tests.filter((t) => t.last_run_status === 'passed').length,
    failed: tests.filter((t) => t.last_run_status === 'failed').length,
    auto: tests.filter((t) => t.link_type === 'auto').length,
  }

  const statusIcon = (status: string) => {
    if (status === 'passed') return <CheckCircle className="h-4 w-4 text-emerald-500" />
    if (status === 'failed') return <XCircle className="h-4 w-4 text-red-500" />
    if (status === 'running') return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
    return <Clock className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <TabPanel>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionHeader
          title="Linked Tests"
          description={`${stats.total} scenarios linked to this transport`}
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Plus className="h-4 w-4" />Link</Button>
          <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"><Play className="h-4 w-4" />Run All</Button>
        </div>
      </div>

      <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-3 w-full" fast>
        <KpiStatCard label="Total Linked" value={stats.total} icon={Link2} tone="brand" className="min-h-[5.5rem]" />
        <KpiStatCard label="Passed" value={stats.passed} icon={CheckCircle} tone="success" className="min-h-[5.5rem]" />
        <KpiStatCard label="Failed" value={stats.failed} icon={XCircle} tone="danger" className="min-h-[5.5rem]" />
        <KpiStatCard label="Auto-Linked" value={stats.auto} icon={TestTube2} tone="info" className="min-h-[5.5rem]" />
      </StaggerGrid>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search scenarios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>

      <Card className="shadow-[var(--shadow-xs)] overflow-hidden" padding="flush">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Scenario</TableHead>
                <TableHead className="hidden md:table-cell">Suite</TableHead>
                <TableHead className="w-[80px]">Link</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">30d Pass Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((test) => (
                <TableRow key={test.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium text-sm">{test.scenario_name}</TableCell>
                  <TableCell className="hidden md:table-cell caption-text">{test.suite_name}</TableCell>
                  <TableCell>
                    <Badge className={cn('h-5 text-[10px] border-0', test.link_type === 'auto' ? 'pill pill-info' : 'pill pill-neutral')}>
                      {test.link_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 capitalize text-sm">
                      {statusIcon(test.last_run_status)}
                      {test.last_run_status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={test.pass_rate_30d} className="h-1.5 w-14" indicatorClassName="bg-brand" />
                      <span className="text-xs tabular-nums">{test.pass_rate_30d}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="caption-text px-4 py-2 border-t border-border/60">
          Showing {filtered.length} representative scenarios of {stats.total} linked tests
        </p>
      </Card>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* ABAP Analysis                                                              */
/* -------------------------------------------------------------------------- */

interface ABAPFinding {
  id: string
  object_name: string
  finding_type: 'error' | 'warning' | 'info'
  message: string
  recommendation: string
}

const TAX_ABAP_FINDINGS: ABAPFinding[] = [
  { id: 'af_t1', object_name: 'ZSD_TAX_JURIS', finding_type: 'warning', message: 'SELECT on ZTAX_JURIS missing client authority check', recommendation: 'Add AUTHORITY-CHECK or use standard tax jurisdiction API' },
  { id: 'af_t2', object_name: 'ZSD_TAX_JURIS', finding_type: 'error', message: 'Deprecated FM TAX_JURISDICTION_READ used for interstate lookup', recommendation: 'Replace with CL_TXS_CONTROLLER=>GET_JURISDICTION in S/4HANA' },
  { id: 'af_t3', object_name: 'ZCL_TAX_JURIS', finding_type: 'warning', message: 'Class method missing exception handling for invalid state codes', recommendation: 'Add CX_STATIC_CHECK and map to user-friendly VA message' },
  { id: 'af_t4', object_name: 'ZSD_TAX', finding_type: 'info', message: 'Function group contains 2 obsolete PERFORM includes', recommendation: 'Review includes ZSD_TAX_F01 and ZSD_TAX_F02 for cleanup' },
  { id: 'af_t5', object_name: 'ZSDTJ', finding_type: 'warning', message: 'Dynpro 0100 PBO module references unreleased OSS note field', recommendation: 'Validate GST region dropdown against note 3124567' },
  { id: 'af_t6', object_name: 'ZTAX_JURIS', finding_type: 'info', message: 'Custom table ZTAX_JURIS has no append structure for extensibility', recommendation: 'Consider append for future state code additions' },
]

export function TransportAbapPanel({ transport }: { transport: Transport }) {
  const objectFindings = transport.objects.reduce((s, o) => s + o.abap_findings_count, 0)
  const hasCustomizing =
    transport.classification_summary.some((t) =>
      ['tax', 'customizing', 'z-config'].some((k) => t.toLowerCase().includes(k)),
    ) || transport.objects.some((o) => ['CUS0', 'CUS1'].includes(o.object_type))
  const findings = objectFindings > 0 || hasCustomizing ? TAX_ABAP_FINDINGS : []

  if (findings.length === 0) {
    return (
      <TabPanel>
        <TabEmptyState
          icon={Code2}
          title="No ABAP findings"
          description="Static code analysis found no compatibility issues for objects in this transport."
        />
      </TabPanel>
    )
  }

  return (
    <TabPanel>
      <SectionHeader title="ABAP Analysis" description="S/4HANA compatibility findings from static code review" />
      <div className="space-y-3">
        {findings.map((f) => (
          <Card key={f.id} className="shadow-[var(--shadow-xs)]">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                {f.finding_type === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                ) : f.finding_type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold">{f.object_name}</span>
                    <Badge className={cn('h-5 text-[10px] border-0 capitalize', f.finding_type === 'error' ? 'pill pill-danger' : f.finding_type === 'warning' ? 'pill pill-warning' : 'pill pill-info')}>
                      {f.finding_type}
                    </Badge>
                  </div>
                  <p className="text-sm">{f.message}</p>
                  <p className="caption-text mt-2">{f.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Audit                                                                      */
/* -------------------------------------------------------------------------- */

interface AuditEvent {
  id: string
  timestamp: string
  actor: { type: 'human' | 'agent'; name: string; role?: string }
  action: string
  action_type: string
  details: string
}

function buildAuditEvents(transport: Transport): AuditEvent[] {
  const objectCount = transport.objects.length
  const screenCount = transport.screen_diffs.length
  const verdictCount = transport.impact_verdicts.length
  const regenerateCount = transport.impact_verdicts.filter((v) => v.verdict === 'regenerate').length

  if (verdictCount > 0 || screenCount > 0) {
    return [
      { id: 'ae_t1', timestamp: '2026-05-06T12:00:00+05:30', actor: { type: 'agent', name: 'Test Plan Generator' }, action: 'Test Plan Ready', action_type: 'analysis', details: `Generated regeneration plan for ${regenerateCount} test cases affected by tax jurisdiction changes.` },
      { id: 'ae_t2', timestamp: '2026-05-06T11:00:00+05:30', actor: { type: 'agent', name: 'Impact Analysis Agent' }, action: 'Impact Analysis Complete', action_type: 'analysis', details: `Analyzed ${verdictCount || transport.linked_tests_count} linked tests across OTC and RTR scenarios.` },
      { id: 'ae_t3', timestamp: '2026-05-06T10:30:00+05:30', actor: { type: 'agent', name: 'Screen Diff Agent' }, action: 'Screen Models Compared', action_type: 'analysis', details: `Detected ${screenCount} dynpro changes including TXJCD required flag on VA01.` },
      { id: 'ae_t4', timestamp: '2026-05-06T09:30:00+05:30', actor: { type: 'agent', name: 'Classification Agent' }, action: 'Objects Classified', action_type: 'analysis', details: `Classified ${objectCount} objects: customizing, Z-programs, DDIC, and dialog transaction.` },
      { id: 'ae_t5', timestamp: '2026-05-06T09:00:00+05:30', actor: { type: 'human', name: 'P.Sharma', role: 'Migration Manager' }, action: 'Transport Captured', action_type: 'system', details: `Transport ${transport.tr_number} captured from SD1 with ${objectCount} objects.` },
    ]
  }

  return [
    { id: 'ae_t4', timestamp: '2026-05-06T09:00:00+05:30', actor: { type: 'human', name: 'P.Sharma', role: 'Migration Manager' }, action: 'Transport Captured', action_type: 'system', details: `Transport ${transport.tr_number} captured from SD1 with ${objectCount} objects.` },
  ]
}

export function TransportAuditPanel({ transport }: { transport: Transport }) {
  const [search, setSearch] = React.useState('')

  const events = buildAuditEvents(transport)

  const filtered = events.filter(
    (e) =>
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <TabPanel>
      <SectionHeader title="Audit Trail" description="Complete activity history for this transport" />
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>
      <div className="space-y-3">
        {filtered.map((event, index) => (
          <motion.div
            key={event.id}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            custom={index}
            className="flex gap-3"
          >
            <div
              className={cn(
                'h-9 w-9 shrink-0 rounded-full flex items-center justify-center ring-1 ring-inset',
                event.actor.type === 'agent'
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20'
                  : 'bg-muted ring-border/50',
              )}
            >
              {event.actor.type === 'agent' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <Card className="flex-1 shadow-[var(--shadow-xs)]">
              <CardContent className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.action}</span>
                    <Badge variant="secondary" className="h-5 text-[10px] capitalize">
                      {event.action_type}
                    </Badge>
                  </div>
                  <span className="caption-text">{formatRelativeTime(event.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.details}</p>
                <p className="caption-text mt-1.5">
                  {event.actor.name}
                  {event.actor.role && ` · ${event.actor.role}`}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </TabPanel>
  )
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

export function TransportOverviewPanel({ transport }: { transport: Transport }) {
  const classificationCounts = transport.objects.reduce(
    (acc, obj) => {
      acc[obj.object_type] = (acc[obj.object_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const recentTransitions = [
    { from: 'Analyzed', to: 'Test_Plan_Ready', time: '27h ago', actor: 'Test Plan Generator', type: 'agent' as const },
    { from: 'Classified', to: 'Analyzed', time: '28h ago', actor: 'Impact Analysis Agent', type: 'agent' as const },
    { from: 'Captured', to: 'Classified', time: '29h ago', actor: 'Classification Agent', type: 'agent' as const },
  ]

  return (
    <TabPanel>
      <Card className="shadow-[var(--shadow-xs)] border-l-[3px] border-l-brand">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Transport Lifecycle</CardTitle>
          <CardDescription>Current position in the release pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <LifecycleTimeline currentState={transport.state} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-[var(--shadow-xs)] h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Classification Breakdown</CardTitle>
              <CardDescription>Objects by type in this transport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(classificationCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-brand">{type}</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold tabular-nums leading-none">{count}</p>
                      <p className="caption-text">objects</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/60">
                {transport.classification_summary.map((tag) => (
                  <Badge key={tag} variant="secondary" className="h-5 text-[10px]">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-xs)] h-full ring-1 ring-red-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Risk Factors
              </CardTitle>
              <CardDescription>
                Contributing to {Math.round(transport.risk_score * 100)}% risk score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transport.risk_factors.map((factor) => (
                <div key={factor.id} className="space-y-1.5">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="leading-snug">{factor.description}</span>
                    <span className="text-xs font-bold tabular-nums shrink-0">+{Math.round(factor.weight * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-[#d4a04a]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(factor.weight * 250, 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-xs)] md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest state transitions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 divide-y divide-border/50">
              {recentTransitions.map((t, i) => (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-medium">{t.actor}</span>
                      <span className="caption-text">{t.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="h-5 text-[10px]">{t.from.replace(/_/g, ' ')}</Badge>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <Badge className="h-5 text-[10px] pill pill-brand border-0">{t.to.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-4">
          <Card className="shadow-[var(--shadow-xs)]">
            <CardHeader className="pb-2"><CardTitle className="text-base">Owner</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-brand/20">
                  <AvatarFallback className="text-sm bg-brand/10 text-brand">{transport.owner.avatar_initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{transport.owner.name}</p>
                  <p className="caption-text">{transport.owner.role}</p>
                </div>
              </div>
              <a href={`mailto:${transport.owner.email}`} className="flex items-center gap-2 mt-3 text-xs text-muted-foreground hover:text-foreground truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {transport.owner.email}
              </a>
            </CardContent>
          </Card>

          {transport.linked_migration_name && transport.linked_migration_id && (
            <Card className="shadow-[var(--shadow-xs)]">
              <CardHeader className="pb-2"><CardTitle className="text-base">Linked Migration</CardTitle></CardHeader>
              <CardContent>
                <Link
                  href={`/migration-cockpit/${transport.linked_migration_id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <Rocket className="h-4 w-4 text-brand shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">{transport.linked_migration_name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-[var(--shadow-xs)]">
            <CardHeader className="pb-2"><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-0 text-sm">
              {[
                ['Captured', transport.captured_at],
                ['Classified', transport.classified_at],
                ['Analyzed', transport.analyzed_at],
                ['Test Plan Ready', transport.test_plan_ready_at],
              ]
                .filter(([, v]) => v)
                .map(([label, date]) => (
                  <div key={String(label)} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums">{formatRelativeTime(date as string)}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </TabPanel>
  )
}
