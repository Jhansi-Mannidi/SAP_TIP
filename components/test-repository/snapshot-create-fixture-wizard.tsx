'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Camera,
  Database,
  Shield,
  Settings2,
  Sparkles,
  Loader2,
  Server,
  HardDrive,
  Globe,
  Building2,
  Briefcase,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { MasterDataSnapshot } from '@/lib/mock-data'

const STEPS = [
  { id: 'snapshot', label: 'Snapshot', icon: Camera },
  { id: 'fixture', label: 'Fixture Details', icon: Database },
  { id: 'options', label: 'Restore Options', icon: Settings2 },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

type Scope = 'Global' | 'Customer' | 'Workspace'
type PiiLevel = 'none' | 'low' | 'medium' | 'high'

const SCOPES: { value: Scope; label: string; icon: React.ElementType }[] = [
  { value: 'Global', label: 'Global', icon: Globe },
  { value: 'Customer', label: 'Customer', icon: Building2 },
  { value: 'Workspace', label: 'Workspace', icon: Briefcase },
]

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="w-full">
      <div className="relative mb-4 hidden sm:block">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        <motion.div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand to-[#d4a04a]"
          animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isComplete = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-background shrink-0',
                    isComplete && 'bg-brand text-brand-foreground ring-brand/30',
                    isCurrent &&
                      'bg-brand text-brand-foreground ring-brand/50 shadow-[0_0_0_3px_rgba(184,134,46,0.15)]',
                    !isComplete && !isCurrent && 'bg-muted text-muted-foreground ring-transparent',
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight truncate w-full px-0.5',
                    isCurrent && 'font-semibold text-brand',
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <p className="sm:hidden text-sm text-muted-foreground">
        Step {currentIndex + 1} of {STEPS.length}:{' '}
        <span className="font-medium text-foreground">{STEPS[currentIndex].label}</span>
      </p>
    </div>
  )
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right break-all', mono && 'font-mono text-xs')}>
        {value || '—'}
      </span>
    </div>
  )
}

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

interface SnapshotCreateFixtureWizardProps {
  snapshot: MasterDataSnapshot
}

export function SnapshotCreateFixtureWizard({ snapshot }: SnapshotCreateFixtureWizardProps) {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [creating, setCreating] = React.useState(false)

  const defaultCode = `${snapshot.ddic_table}_${snapshot.source_system}_${snapshot.source_client}_SET`
  const [fixtureName, setFixtureName] = React.useState(
    snapshot.name.replace(' from ', ' — ').replace(' Reference', ' Set'),
  )
  const [fixtureCode, setFixtureCode] = React.useState(defaultCode)
  const [description, setDescription] = React.useState(snapshot.description)
  const [scope, setScope] = React.useState<Scope>('Global')
  const [piiLevel, setPiiLevel] = React.useState<PiiLevel>(
    snapshot.ddic_table === 'KNA1' || snapshot.ddic_table === 'LFA1' ? 'medium' : 'none',
  )
  const [version, setVersion] = React.useState('1.0.0')
  const [anonymizePii, setAnonymizePii] = React.useState(true)
  const [includeAllRows, setIncludeAllRows] = React.useState(true)
  const [rowLimit, setRowLimit] = React.useState(String(Math.min(snapshot.row_count, 500)))
  const [publishAfterCreate, setPublishAfterCreate] = React.useState(false)

  const currentStep = STEPS[stepIndex].id

  const canNext = () => {
    switch (currentStep) {
      case 'snapshot':
        return true
      case 'fixture':
        return fixtureName.trim().length >= 3 && fixtureCode.trim().length >= 3 && description.trim().length >= 10
      case 'options':
        return includeAllRows || (Number(rowLimit) > 0 && Number(rowLimit) <= snapshot.row_count)
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1400))
    setCreating(false)
    router.push('/test-repository/data')
  }

  const recordCount = includeAllRows ? snapshot.row_count : Number(rowLimit)

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28 }}
          className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6"
        >
          {currentStep === 'snapshot' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Source Snapshot</h2>
                <p className="section-description mt-1">
                  Review the snapshot that will be restored as a reusable data fixture.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{snapshot.name}</p>
                    <p className="caption-text mt-0.5">{snapshot.description}</p>
                  </div>
                  <Badge variant="outline" className="font-mono shrink-0">
                    {snapshot.ddic_table}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
                    <p className="micro-label flex items-center gap-1">
                      <Server className="h-3 w-3" /> Source
                    </p>
                    <p className="font-mono text-xs font-medium mt-1">
                      {snapshot.source_system}-{snapshot.source_client}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
                    <p className="micro-label flex items-center gap-1">
                      <Database className="h-3 w-3" /> Rows
                    </p>
                    <p className="text-sm font-semibold mt-1 tabular-nums">
                      {snapshot.row_count.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
                    <p className="micro-label flex items-center gap-1">
                      <HardDrive className="h-3 w-3" /> Size
                    </p>
                    <p className="text-sm font-semibold mt-1">{formatSize(snapshot.size_kb)}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
                    <p className="micro-label">Status</p>
                    <p className="text-sm font-medium mt-1 capitalize">{snapshot.staleness}</p>
                  </div>
                </div>
                {snapshot.scope_filter && (
                  <div className="rounded-lg border border-border/50 bg-card px-3 py-2">
                    <p className="micro-label">Scope filter</p>
                    <p className="font-mono text-xs mt-1">{snapshot.scope_filter}</p>
                  </div>
                )}
              </div>

              {snapshot.staleness === 'stale' && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  This snapshot is over 7 days old. Consider refreshing before creating a fixture.
                </div>
              )}
            </div>
          )}

          {currentStep === 'fixture' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Fixture Details</h2>
                <p className="section-description mt-1">
                  Name and classify the data fixture for use in test scenarios.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fixtureName">Fixture Name</Label>
                  <Input
                    id="fixtureName"
                    value={fixtureName}
                    onChange={(e) => setFixtureName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixtureCode">Fixture Code</Label>
                  <Input
                    id="fixtureCode"
                    value={fixtureCode}
                    onChange={(e) => setFixtureCode(e.target.value.toUpperCase())}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] resize-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Customer Scope</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SCOPES.map((opt) => {
                    const Icon = opt.icon
                    const selected = scope === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setScope(opt.value)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                          selected
                            ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20 font-medium'
                            : 'border-border hover:bg-muted/20',
                        )}
                      >
                        <Icon className="h-4 w-4 text-brand shrink-0" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  PII Classification
                </Label>
                <Select value={piiLevel} onValueChange={(v) => setPiiLevel(v as PiiLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None — no personal data</SelectItem>
                    <SelectItem value="low">Low — non-sensitive identifiers</SelectItem>
                    <SelectItem value="medium">Medium — names, addresses</SelectItem>
                    <SelectItem value="high">High — financial or ID data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 'options' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Restore Options</h2>
                <p className="section-description mt-1">
                  Control how snapshot rows are imported into the fixture payload.
                </p>
              </div>

              <div className="space-y-4 rounded-xl border border-border/60 divide-y">
                <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Include all snapshot rows</p>
                    <p className="caption-text mt-0.5">
                      Import full {snapshot.row_count.toLocaleString()} row capture
                    </p>
                  </div>
                  <Switch checked={includeAllRows} onCheckedChange={setIncludeAllRows} />
                </label>

                {!includeAllRows && (
                  <div className="p-4 space-y-2">
                    <Label htmlFor="rowLimit">Row limit</Label>
                    <Input
                      id="rowLimit"
                      type="number"
                      min={1}
                      max={snapshot.row_count}
                      value={rowLimit}
                      onChange={(e) => setRowLimit(e.target.value)}
                      className="max-w-[200px] tabular-nums"
                    />
                  </div>
                )}

                <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Anonymize PII fields</p>
                    <p className="caption-text mt-0.5">
                      Mask names, tax IDs, and contact fields on import
                    </p>
                  </div>
                  <Switch checked={anonymizePii} onCheckedChange={setAnonymizePii} />
                </label>

                <label className="flex items-start gap-3 p-4 cursor-pointer">
                  <Checkbox
                    checked={publishAfterCreate}
                    onCheckedChange={(v) => setPublishAfterCreate(v === true)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">Publish immediately</p>
                    <p className="caption-text mt-0.5">
                      Skip Draft state and make available to scenarios right away
                    </p>
                  </div>
                </label>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs font-mono space-y-1">
                <p className="text-muted-foreground">Field mapping preview</p>
                <p>{snapshot.ddic_table}-KUNNR → customer_id</p>
                <p>{snapshot.ddic_table}-NAME1 → customer_name</p>
                <p>{snapshot.ddic_table}-LAND1 → country_code</p>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Review & Create</h2>
                <p className="section-description mt-1">
                  Confirm settings before restoring the snapshot as a data fixture.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <ReviewRow label="Snapshot" value={snapshot.name} />
                <ReviewRow label="DDIC Table" value={snapshot.ddic_table} mono />
                <ReviewRow label="Fixture Code" value={fixtureCode} mono />
                <ReviewRow label="Fixture Name" value={fixtureName} />
                <ReviewRow label="Scope" value={scope} />
                <ReviewRow label="PII Level" value={piiLevel} />
                <ReviewRow label="Records" value={recordCount.toLocaleString()} />
                <ReviewRow label="Anonymize PII" value={anonymizePii ? 'Yes' : 'No'} />
                <ReviewRow
                  label="Initial State"
                  value={publishAfterCreate ? 'Published' : 'Draft'}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => {
            if (stepIndex > 0) setStepIndex((i) => i - 1)
            else router.push('/test-repository/snapshots')
          }}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/test-repository/snapshots">Cancel</Link>
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button
              onClick={() => setStepIndex((i) => i + 1)}
              disabled={!canNext()}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Create Fixture
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
