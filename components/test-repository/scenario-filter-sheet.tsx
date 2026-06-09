'use client'

import * as React from 'react'
import {
  Filter,
  X,
  Globe,
  Building2,
  FolderOpen,
  Layers,
  Tag,
  CheckCircle2,
  FileEdit,
  Archive,
  AlertTriangle,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ScenarioState, CustomerScope } from '@/lib/mock-data'

export interface ScenarioAdvancedFilters {
  states: ScenarioState[]
  modules: string[]
  businessProcesses: string[]
  customerScopes: CustomerScope[]
  tags: string[]
}

export const EMPTY_SCENARIO_FILTERS: ScenarioAdvancedFilters = {
  states: [],
  modules: [],
  businessProcesses: [],
  customerScopes: [],
  tags: [],
}

const STATE_OPTIONS: {
  value: ScenarioState
  label: string
  icon: React.ElementType
  selectedClass: string
}[] = [
  {
    value: 'Published',
    label: 'Published',
    icon: CheckCircle2,
    selectedClass: 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/20',
  },
  {
    value: 'Draft',
    label: 'Draft',
    icon: FileEdit,
    selectedClass: 'border-amber-500/40 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/20',
  },
  {
    value: 'Deprecated',
    label: 'Deprecated',
    icon: AlertTriangle,
    selectedClass: 'border-orange-500/40 bg-orange-500/[0.08] text-orange-900 dark:text-orange-200 ring-1 ring-orange-500/20',
  },
  {
    value: 'Archived',
    label: 'Archived',
    icon: Archive,
    selectedClass: 'border-border bg-muted/40 text-muted-foreground ring-1 ring-border/60',
  },
]

const BP_OPTIONS: Record<string, { label: string; selectedClass: string }> = {
  OTC: { label: 'Order to Cash', selectedClass: 'border-blue-500/40 bg-blue-500/[0.08] text-blue-800 dark:text-blue-300 ring-1 ring-blue-500/20' },
  PTP: { label: 'Procure to Pay', selectedClass: 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/20' },
  RTR: { label: 'Record to Report', selectedClass: 'border-violet-500/40 bg-violet-500/[0.08] text-violet-800 dark:text-violet-300 ring-1 ring-violet-500/20' },
  HTR: { label: 'Hire to Retire', selectedClass: 'border-rose-500/40 bg-rose-500/[0.08] text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/20' },
  ATR: { label: 'Acquire to Retire', selectedClass: 'border-cyan-500/40 bg-cyan-500/[0.08] text-cyan-800 dark:text-cyan-300 ring-1 ring-cyan-500/20' },
}

const SCOPE_OPTIONS: {
  value: CustomerScope
  label: string
  description: string
  icon: React.ElementType
}[] = [
  { value: 'Global', label: 'Global', description: 'All tenants', icon: Globe },
  { value: 'Customer', label: 'Customer', description: 'Tenant-specific', icon: Building2 },
  { value: 'Workspace', label: 'Workspace', description: 'Private workspace', icon: FolderOpen },
]

function countActiveFilters(filters: ScenarioAdvancedFilters): number {
  return (
    filters.states.length +
    filters.modules.length +
    filters.businessProcesses.length +
    filters.customerScopes.length +
    filters.tags.length
  )
}

function FilterSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border/70 bg-card shadow-[var(--shadow-xs)] overflow-hidden">
      <div className="flex items-start gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="h-7 w-7 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/15 flex items-center justify-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-brand" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          {description && <p className="caption-text mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function TogglePill({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
        'hover:border-brand/30 hover:bg-muted/30',
        selected
          ? cn('shadow-[var(--shadow-xs)]', className)
          : 'border-border/60 bg-background text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

interface ScenarioFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: ScenarioAdvancedFilters
  onFiltersChange: (filters: ScenarioAdvancedFilters) => void
  allModules: string[]
  allBusinessProcesses: string[]
  allTags: string[]
  matchCount: number
  totalCount: number
  countMatches: (filters: ScenarioAdvancedFilters) => number
}

export function ScenarioFilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  allModules,
  allBusinessProcesses,
  allTags,
  matchCount,
  totalCount,
  countMatches,
}: ScenarioFilterSheetProps) {
  const [draft, setDraft] = React.useState(filters)
  const previewCount = countMatches(draft)

  React.useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  const activeCount = countActiveFilters(draft)

  const toggle = <K extends keyof ScenarioAdvancedFilters>(
    key: K,
    value: ScenarioAdvancedFilters[K][number],
  ) => {
    setDraft((prev) => {
      const list = prev[key] as ScenarioAdvancedFilters[K][number][]
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
      return { ...prev, [key]: next }
    })
  }

  const handleApply = () => {
    onFiltersChange(draft)
    onOpenChange(false)
  }

  const handleClear = () => {
    setDraft(EMPTY_SCENARIO_FILTERS)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-border/80 [&>button.absolute]:hidden">
        <SheetHeader className="shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.07] via-card to-card px-5 py-4 space-y-3 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-brand text-brand-foreground flex items-center justify-center shadow-sm shrink-0">
                <Filter className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-semibold">Filter Test Scenarios</SheetTitle>
                <SheetDescription className="text-xs mt-1 leading-relaxed">
                  Refine the scenario list by lifecycle, process, modules, and tags.
                </SheetDescription>
              </div>
            </div>
            {activeCount > 0 && (
              <Badge className="pill pill-brand h-6 border-0 shrink-0">{activeCount} active</Badge>
            )}
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/25 px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Preview matches</span>
            <span className="text-sm font-semibold tabular-nums">
              <span className="text-brand">{previewCount}</span>
              <span className="text-muted-foreground font-normal"> / {totalCount}</span>
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <FilterSection title="State" description="Lifecycle status" icon={CheckCircle2}>
            <div className="grid grid-cols-2 gap-2">
              {STATE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = draft.states.includes(opt.value)
                return (
                  <TogglePill
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggle('states', opt.value)}
                    className={opt.selectedClass}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {opt.label}
                  </TogglePill>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Business Process" description="End-to-end SAP process" icon={Layers}>
            <div className="flex flex-col gap-2">
              {allBusinessProcesses.map((bp) => {
                const meta = BP_OPTIONS[bp] ?? {
                  label: bp,
                  selectedClass: 'border-brand/40 bg-brand/[0.08] text-brand ring-1 ring-brand/20',
                }
                const selected = draft.businessProcesses.includes(bp)
                return (
                  <TogglePill
                    key={bp}
                    selected={selected}
                    onClick={() => toggle('businessProcesses', bp)}
                    className={cn('w-full justify-between', meta.selectedClass)}
                  >
                    <span className="font-mono font-bold">{bp}</span>
                    <span className="font-normal opacity-80 truncate">{meta.label}</span>
                  </TogglePill>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="SAP Modules" description="Functional areas touched" icon={Layers}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allModules.map((mod) => {
                const selected = draft.modules.includes(mod)
                return (
                  <TogglePill
                    key={mod}
                    selected={selected}
                    onClick={() => toggle('modules', mod)}
                    className="justify-center font-mono border-brand/40 bg-brand/[0.08] text-brand ring-1 ring-brand/20"
                  >
                    {mod}
                  </TogglePill>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Customer Scope" description="Visibility boundary" icon={Globe}>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = draft.customerScopes.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle('customerScopes', opt.value)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                      selected
                        ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                        : 'border-border/60 hover:bg-muted/20',
                    )}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                        selected ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="caption-text">{opt.description}</p>
                    </div>
                    {selected && <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Tags" description="Classification labels" icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const selected = draft.tags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle('tags', tag)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-[11px] font-medium transition-all',
                      selected
                        ? 'border-brand/40 bg-brand text-brand-foreground shadow-[var(--shadow-xs)]'
                        : 'border-border/60 bg-background text-muted-foreground hover:border-brand/25 hover:text-foreground',
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </FilterSection>
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground hover:text-foreground gap-1.5"
            onClick={handleClear}
            disabled={activeCount === 0}
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 bg-brand text-brand-foreground hover:bg-brand/90 min-w-[7.5rem]"
              onClick={handleApply}
            >
              Apply filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function countScenarioAdvancedFilters(filters: ScenarioAdvancedFilters): number {
  return countActiveFilters(filters)
}
