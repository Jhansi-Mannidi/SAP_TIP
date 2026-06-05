'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Cloud,
  Database,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Sparkles,
  Activity,
  X,
  ArrowRight,
} from 'lucide-react'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SourceSystem = {
  value: string
  code: string
  description: string
  region: string
  latency: string
  status: 'online' | 'degraded'
}

const SOURCE_SYSTEMS: SourceSystem[] = [
  {
    value: 'sta',
    code: 'STA/100',
    description: 'Development sandbox',
    region: 'EU-West',
    latency: '142ms',
    status: 'online',
  },
  {
    value: 'stq',
    code: 'STQ/200',
    description: 'Quality assurance — primary test bench',
    region: 'EU-West',
    latency: '98ms',
    status: 'online',
  },
  {
    value: 's4h',
    code: 'S4H/100',
    description: 'S/4HANA migration target',
    region: 'US-East',
    latency: '212ms',
    status: 'degraded',
  },
]

type SapObject = {
  value: string
  code: string
  label: string
  description: string
  category: 'Master' | 'Transactional'
}

const SAP_OBJECTS: SapObject[] = [
  {
    value: 'kna1',
    code: 'KNA1',
    label: 'Customer Master',
    description: 'General data segment',
    category: 'Master',
  },
  {
    value: 'lfa1',
    code: 'LFA1',
    label: 'Vendor Master',
    description: 'Supplier general data',
    category: 'Master',
  },
  {
    value: 'mara',
    code: 'MARA',
    label: 'Material Master',
    description: 'Material header',
    category: 'Master',
  },
  {
    value: 'vbak',
    code: 'VBAK',
    label: 'Sales Document Header',
    description: 'Sales order headers',
    category: 'Transactional',
  },
  {
    value: 'ekko',
    code: 'EKKO',
    label: 'Purchasing Document',
    description: 'Purchase order headers',
    category: 'Transactional',
  },
]

type PiiStrategy = 'mask' | 'exclude' | 'allow'

const PII_STRATEGIES: { value: PiiStrategy; label: string; description: string }[] = [
  {
    value: 'mask',
    label: 'Mask sensitive fields',
    description: 'Recommended — replaces PII with deterministic tokens',
  },
  {
    value: 'exclude',
    label: 'Exclude PII columns',
    description: 'Drops sensitive fields entirely from the fixture',
  },
  {
    value: 'allow',
    label: 'Allow PII (audited)',
    description: 'Requires data-officer approval, full audit trail',
  },
]

export function GenerateFromSystemSheet({ open, onOpenChange }: Props) {
  const [sourceSystem, setSourceSystem] = React.useState('stq')
  const [sapObject, setSapObject] = React.useState('kna1')
  const [whereClause, setWhereClause] = React.useState('')
  const [maxRecords, setMaxRecords] = React.useState(100)
  const [piiStrategy, setPiiStrategy] = React.useState<PiiStrategy>('mask')
  const [isGenerating, setIsGenerating] = React.useState(false)

  const selectedSystem = SOURCE_SYSTEMS.find(s => s.value === sourceSystem) ?? SOURCE_SYSTEMS[1]
  const selectedObject = SAP_OBJECTS.find(o => o.value === sapObject) ?? SAP_OBJECTS[0]

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('Fixture generation queued', {
        description: `${selectedObject.code} · up to ${maxRecords} records from ${selectedSystem.code} · ${piiStrategy} strategy`,
      })
      onOpenChange(false)
    }, 1400)
  }

  // Reset state shortly after close so reopen feels fresh
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSourceSystem('stq')
        setSapObject('kna1')
        setWhereClause('')
        setMaxRecords(100)
        setPiiStrategy('mask')
        setIsGenerating(false)
      }, 220)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 sm:px-6 py-4 space-y-1.5 text-left">
          <SheetTitle className="flex items-center gap-2.5 text-base font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
              <Cloud className="h-4 w-4" />
            </span>
            Generate from System
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Pull live records from a target SAP system through iHub and seed a new data fixture
            with automatic PII handling.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* 1. Source System */}
          <Section
            number={1}
            title="Source System"
            hint="iHub will route the request through this system's RFC connection."
          >
            <Select value={sourceSystem} onValueChange={setSourceSystem}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_SYSTEMS.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{s.code}</span>
                      <span className="text-muted-foreground">— {s.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* System status card */}
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-1 inline-flex h-2.5 w-2.5 rounded-full shrink-0',
                    selectedSystem.status === 'online'
                      ? 'bg-emerald-500 shadow-[0_0_0_3px] shadow-emerald-500/20'
                      : 'bg-amber-500 shadow-[0_0_0_3px] shadow-amber-500/20',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {selectedSystem.code}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset',
                        selectedSystem.status === 'online'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
                      )}
                    >
                      <Activity className="h-2.5 w-2.5" />
                      {selectedSystem.status === 'online' ? 'Connected' : 'Degraded'}
                    </span>
                  </div>
                  <p className="caption-text mt-0.5">
                    {selectedSystem.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      {selectedSystem.region}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      RTT {selectedSystem.latency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 2. SAP Object */}
          <Section
            number={2}
            title="SAP Object"
            hint="The table or business object that will be read into the fixture."
          >
            <Select value={sapObject} onValueChange={setSapObject}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SAP_OBJECTS.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{o.code}</span>
                      <span className="text-muted-foreground">— {o.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <ObjectMeta label="Code" value={selectedObject.code} mono />
              <ObjectMeta label="Type" value={selectedObject.category} />
              <ObjectMeta label="Source" value="iHub RFC" />
            </div>
          </Section>

          {/* 3. Selection criteria */}
          <Section
            number={3}
            title="Selection Criteria"
            hint="Optional ABAP-style WHERE clause to filter records before they are pulled."
          >
            <div className="rounded-lg overflow-hidden ring-1 ring-inset ring-border bg-muted/40">
              <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
                  WHERE
                </span>
                {whereClause.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setWhereClause('')}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                    Clear
                  </button>
                )}
              </div>
              <Textarea
                value={whereClause}
                onChange={e => setWhereClause(e.target.value)}
                placeholder={`-- e.g.\nKUNNR LIKE '10%' AND LAND1 = 'DE'`}
                className="font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/70 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[96px] resize-none rounded-none px-3 py-2.5"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                Supports standard ABAP operators:{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">=</code>{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">LIKE</code>{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">IN</code>{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">BETWEEN</code>
              </span>
              <span className="tabular-nums">{whereClause.length} chars</span>
            </div>
          </Section>

          {/* 4. Limits */}
          <Section
            number={4}
            title="Record Limit"
            hint="Hard cap on the number of rows pulled. Larger fixtures take longer to generate."
          >
            <div className="space-y-3">
              <Input
                type="number"
                min={1}
                max={10000}
                value={maxRecords}
                onChange={e => setMaxRecords(Number(e.target.value) || 0)}
                className="h-10 font-mono text-sm tabular-nums"
              />
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 500, 1000].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMaxRecords(preset)}
                    className={cn(
                      'h-7 rounded-md border text-[11px] font-medium transition-colors tabular-nums',
                      maxRecords === preset
                        ? 'border-brand bg-brand-soft text-foreground'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* 5. PII handling */}
          <Section
            number={5}
            title="PII Handling"
            hint="How sensitive fields detected during the scan should be treated in the fixture."
          >
            <div className="space-y-2">
              {PII_STRATEGIES.map(strategy => {
                const selected = piiStrategy === strategy.value
                return (
                  <label
                    key={strategy.value}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      selected
                        ? 'border-brand bg-brand-soft/40 ring-1 ring-inset ring-brand/30'
                        : 'border-border bg-background hover:bg-muted/30',
                    )}
                  >
                    <input
                      type="radio"
                      name="pii-strategy"
                      checked={selected}
                      onChange={() => setPiiStrategy(strategy.value)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border shrink-0 transition-colors',
                        selected
                          ? 'border-brand bg-brand'
                          : 'border-muted-foreground/40 bg-background',
                      )}
                      aria-hidden="true"
                    >
                      {selected ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-foreground" />
                      ) : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{strategy.label}</p>
                      <p className="section-description text-[11px] mt-0.5">
                        {strategy.description}
                      </p>
                    </div>
                  </label>
                )
              })}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Compliance.</span>{' '}
                A PII scan runs before the fixture is committed. You will be asked to confirm any
                fields flagged as high-risk.
              </p>
            </div>
          </Section>

          {/* Summary */}
          <div className="rounded-lg border border-brand/30 bg-brand-soft/30 p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <p className="micro-label text-[11px]">
                Generation Summary
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11px]">
              <SummaryRow label="System" value={selectedSystem.code} mono />
              <SummaryRow label="Object" value={selectedObject.code} mono />
              <SummaryRow label="Filter" value={whereClause ? 'Custom' : 'None'} />
              <SummaryRow label="Max rows" value={maxRecords.toLocaleString()} mono />
              <SummaryRow
                label="PII"
                value={
                  PII_STRATEGIES.find(s => s.value === piiStrategy)?.label.split(' ')[0] ?? '—'
                }
              />
              <SummaryRow label="Est. duration" value="~30s" />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleGenerate}
            disabled={isGenerating || maxRecords < 1}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Database className="h-3.5 w-3.5" />
                Generate Fixture
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ---------- helpers ---------- */

function Section({
  number,
  title,
  hint,
  children,
}: {
  number: number
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-foreground border border-border tabular-nums">
          {number}
        </span>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h4>
      </div>
      {hint ? (
        <p className="page-description text-[11px]">{hint}</p>
      ) : null}
      <div>{children}</div>
    </section>
  )
}

function ObjectMeta({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-2.5 py-1.5">
      <p className="page-description text-[9px]">
        {label}
      </p>
      <p
        className={cn(
          'text-xs font-semibold text-foreground mt-0.5 truncate',
          mono && 'font-mono',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          'font-semibold text-foreground truncate text-right',
          mono && 'font-mono',
        )}
      >
        {value}
      </span>
    </div>
  )
}

/* Suppress unused warning */
void Label
