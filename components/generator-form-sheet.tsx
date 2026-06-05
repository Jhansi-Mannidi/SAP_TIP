'use client'

import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type {
  DataGenerator,
  RandomizationStrategy,
} from '@/lib/mock-data'
import {
  ArrowDownUp,
  Copy,
  Database,
  Loader2,
  Plus,
  RefreshCw,
  Shuffle,
  Sparkles,
  Table2,
  X,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

export type GeneratorFormMode = 'create' | 'clone'

interface GeneratorFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: GeneratorFormMode
  initialData?: DataGenerator | null
}

interface StrategyOption {
  value: RandomizationStrategy
  label: string
  description: string
  icon: React.ElementType
}

const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    value: 'random',
    label: 'Random',
    description: 'Random selection from result set',
    icon: Shuffle,
  },
  {
    value: 'sequential',
    label: 'Sequential',
    description: 'Iterate through results in order',
    icon: ArrowDownUp,
  },
  {
    value: 'weighted',
    label: 'Weighted',
    description: 'Weighted by frequency or usage',
    icon: Zap,
  },
  {
    value: 'round_robin',
    label: 'Round Robin',
    description: 'Cycle through results evenly',
    icon: RefreshCw,
  },
]

export function GeneratorFormSheet({
  open,
  onOpenChange,
  mode,
  initialData,
}: GeneratorFormSheetProps) {
  // Form state
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [sourceTable, setSourceTable] = React.useState('')
  const [joinTable, setJoinTable] = React.useState('')
  const [joinOn, setJoinOn] = React.useState('')
  const [whereClause, setWhereClause] = React.useState('')
  const [projection, setProjection] = React.useState<string[]>([])
  const [projectionInput, setProjectionInput] = React.useState('')
  const [strategy, setStrategy] = React.useState<RandomizationStrategy>('random')
  const [isSaving, setIsSaving] = React.useState(false)

  // Seed form when the sheet opens or the source generator changes.
  React.useEffect(() => {
    if (!open) return

    if (mode === 'clone' && initialData) {
      setName(`${initialData.name} (Copy)`)
      setDescription(initialData.description)
      setSourceTable(initialData.source_table)
      const firstJoin = initialData.join_tables?.[0]
      setJoinTable(firstJoin?.table ?? '')
      setJoinOn(firstJoin?.on ?? '')
      setWhereClause(initialData.where_clause)
      setProjection([...initialData.projection])
      setProjectionInput('')
      setStrategy(initialData.randomization)
    } else {
      setName('')
      setDescription('')
      setSourceTable('')
      setJoinTable('')
      setJoinOn('')
      setWhereClause('')
      setProjection([])
      setProjectionInput('')
      setStrategy('random')
    }
  }, [open, mode, initialData])

  // Field-by-field completion for the header progress bar.
  const completion = React.useMemo(() => {
    const fields = [
      name.trim().length > 0,
      description.trim().length > 0,
      sourceTable.trim().length > 0,
      whereClause.trim().length > 0,
      projection.length > 0,
    ]
    const filled = fields.filter(Boolean).length
    return Math.round((filled / fields.length) * 100)
  }, [name, description, sourceTable, whereClause, projection])

  const canSubmit =
    name.trim().length > 0 &&
    sourceTable.trim().length > 0 &&
    projection.length > 0 &&
    !isSaving

  // --- Projection chip input ---
  const addProjectionChips = (raw: string) => {
    const next = raw
      .split(/[,\n]/)
      .map(s => s.trim().toUpperCase())
      .filter(Boolean)
      .filter(s => !projection.includes(s))
    if (next.length > 0) {
      setProjection(p => [...p, ...next].slice(0, 12))
    }
  }

  const handleProjectionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (projectionInput.trim().length > 0) {
        addProjectionChips(projectionInput)
        setProjectionInput('')
      }
    } else if (e.key === 'Backspace' && projectionInput.length === 0) {
      setProjection(p => p.slice(0, -1))
    }
  }

  // --- Submit ---
  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSaving(true)
    // Simulated persistence
    await new Promise(r => setTimeout(r, 700))
    setIsSaving(false)
    onOpenChange(false)
    toast.success(
      mode === 'clone'
        ? 'Generator cloned successfully'
        : 'Generator created successfully',
      { description: name },
    )
  }

  // Header icon + copy depending on mode.
  const HeaderIcon = mode === 'clone' ? Copy : Plus
  const heading = mode === 'clone' ? 'Clone Generator' : 'New Data Generator'
  const subheading =
    mode === 'clone'
      ? 'Duplicate this generator into a new editable copy. Settings can be tweaked before saving.'
      : 'Define a rule that produces on-demand test values from your SAP DDIC schema.'
  const submitLabel = mode === 'clone' ? 'Create Clone' : 'Create Generator'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0"
      >
        {/* Sticky header */}
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border space-y-3 text-left">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand ring-1 ring-inset ring-brand/20 shrink-0">
              <HeaderIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base sm:text-lg font-semibold text-foreground leading-tight">
                {heading}
              </SheetTitle>
              <SheetDescription className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {subheading}
              </SheetDescription>
            </div>
          </div>

          {/* Live completion bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              <span>Completion</span>
              <span className="tabular-nums text-foreground">
                {completion}%
              </span>
            </div>
            <Progress value={completion} className="h-1" />
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Source-of-truth banner in clone mode */}
          {mode === 'clone' && initialData && (
            <div className="rounded-lg border border-border bg-muted/40 p-3 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  Cloning from
                </p>
                <p className="caption-text truncate mt-0.5">
                  {initialData.name}
                </p>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-[10px] bg-background shrink-0"
              >
                {initialData.source_table}
              </Badge>
            </div>
          )}

          {/* Section 1: Identity */}
          <Section step={1} label="Identity">
            <div className="space-y-2">
              <Label
                htmlFor="gen-name"
                className="text-xs font-medium text-foreground"
              >
                Generator name
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="gen-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Valid Material Number for Plant 1000"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="gen-description"
                className="text-xs font-medium text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="gen-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this generator produces…"
                rows={3}
                className="resize-none text-sm leading-relaxed"
              />
            </div>
          </Section>

          {/* Section 2: Source */}
          <Section step={2} label="Source">
            <div className="space-y-2">
              <Label
                htmlFor="gen-source-table"
                className="text-xs font-medium text-foreground"
              >
                Source table
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                <Table2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="gen-source-table"
                  value={sourceTable}
                  onChange={e =>
                    setSourceTable(e.target.value.toUpperCase())
                  }
                  placeholder="MARA"
                  className="h-9 pl-8 font-mono uppercase tracking-wide"
                />
              </div>
              <p className="page-description text-[11px]">
                Primary SAP table to read records from.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2.5">
              <div className="space-y-2">
                <Label
                  htmlFor="gen-join-table"
                  className="text-xs font-medium text-foreground"
                >
                  Join table
                  <span className="text-muted-foreground font-normal ml-1">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="gen-join-table"
                  value={joinTable}
                  onChange={e => setJoinTable(e.target.value.toUpperCase())}
                  placeholder="MARC"
                  className="h-9 font-mono uppercase tracking-wide"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gen-join-on"
                  className="text-xs font-medium text-foreground"
                >
                  ON clause
                </Label>
                <Input
                  id="gen-join-on"
                  value={joinOn}
                  onChange={e => setJoinOn(e.target.value)}
                  placeholder="MARA~MATNR = MARC~MATNR"
                  disabled={joinTable.trim().length === 0}
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </Section>

          {/* Section 3: Selection */}
          <Section step={3} label="Selection">
            <div className="space-y-2">
              <Label
                htmlFor="gen-where"
                className="text-xs font-medium text-foreground"
              >
                WHERE clause
              </Label>
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
                  id="gen-where"
                  value={whereClause}
                  onChange={e => setWhereClause(e.target.value)}
                  placeholder={`-- e.g.\nMTART = 'FERT' AND MARC~WERKS = '1000'`}
                  className="font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/70 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[88px] resize-none rounded-none px-3 py-2.5"
                />
              </div>
              <p className="page-description text-[11px]">
                ABAP-style WHERE clause applied before randomization.
              </p>
            </div>
          </Section>

          {/* Section 4: Projection */}
          <Section step={4} label="Projection">
            <div className="space-y-2">
              <Label
                htmlFor="gen-projection"
                className="text-xs font-medium text-foreground"
              >
                Projection fields
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div
                className={cn(
                  'min-h-9 w-full rounded-md border border-input bg-background px-2 py-1.5',
                  'flex flex-wrap items-center gap-1.5',
                  'focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0',
                )}
                onClick={() => {
                  const input = document.getElementById(
                    'gen-projection',
                  ) as HTMLInputElement | null
                  input?.focus()
                }}
              >
                {projection.map(field => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-soft text-brand-soft-foreground border border-brand/20 px-1.5 py-0.5 text-[11px] font-mono font-medium"
                  >
                    {field}
                    <button
                      type="button"
                      onClick={() =>
                        setProjection(p => p.filter(f => f !== field))
                      }
                      className="text-brand/60 hover:text-brand transition-colors"
                      aria-label={`Remove ${field}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <input
                  id="gen-projection"
                  value={projectionInput}
                  onChange={e =>
                    setProjectionInput(e.target.value.toUpperCase())
                  }
                  onKeyDown={handleProjectionKeyDown}
                  onBlur={() => {
                    if (projectionInput.trim().length > 0) {
                      addProjectionChips(projectionInput)
                      setProjectionInput('')
                    }
                  }}
                  placeholder={
                    projection.length === 0
                      ? 'MATNR, MAKTX, MTART'
                      : 'Add another field…'
                  }
                  className="flex-1 min-w-[8ch] bg-transparent outline-none border-0 text-xs font-mono py-1 placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="page-description text-[11px]">
                  Press <kbd className="px-1 py-0 rounded bg-muted text-foreground font-mono text-[10px]">Enter</kbd> or comma to add.
                </p>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {projection.length} / 12
                </span>
              </div>
            </div>
          </Section>

          {/* Section 5: Strategy */}
          <Section step={5} label="Randomization Strategy">
            <div className="grid grid-cols-2 gap-2">
              {STRATEGY_OPTIONS.map(option => {
                const isSelected = strategy === option.value
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStrategy(option.value)}
                    className={cn(
                      'group relative flex flex-col gap-1 rounded-lg border p-3 text-left transition-all',
                      isSelected
                        ? 'border-brand bg-brand-soft/60 ring-1 ring-brand/30'
                        : 'border-border bg-background hover:border-foreground/30 hover:bg-muted/40',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-md ring-1 ring-inset transition-colors',
                          isSelected
                            ? 'bg-brand text-brand-foreground ring-brand/20'
                            : 'bg-muted text-muted-foreground ring-border',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="page-description text-[11px]">
                      {option.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </Section>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-border px-5 sm:px-6 py-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 bg-background">
          <p className="page-description text-[11px] inline-flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            Will be saved as state{' '}
            <span className="font-semibold text-foreground">Draft</span>
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  {mode === 'clone' ? (
                    <Copy className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Reusable numbered section header used by both this sheet and the rest
// of the Test Repository forms.
function Section({
  step,
  label,
  children,
}: {
  step: number
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-semibold text-foreground tabular-nums">
          {step}
        </span>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
          {label}
        </h4>
      </div>
      <div className="space-y-3 pl-7">{children}</div>
    </section>
  )
}
