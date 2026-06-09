'use client'

import * as React from 'react'
import {
  Filter,
  X,
  Globe,
  Building2,
  FolderOpen,
  CheckCircle2,
  FileEdit,
  Archive,
  AlertTriangle,
  Play,
  Database,
  Send,
  FileSignature,
  Camera,
  Settings2,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Shield,
  FileCode2,
  XCircle,
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

export interface TestCaseAdvancedFilters {
  taskTypes: string[]
  criticalities: string[]
  hasIr: boolean | null
  states: string[]
  customerScopes: string[]
}

export const EMPTY_TEST_CASE_FILTERS: TestCaseAdvancedFilters = {
  taskTypes: [],
  criticalities: [],
  hasIr: null,
  states: [],
  customerScopes: [],
}

const TASK_TYPE_OPTIONS: {
  value: string
  label: string
  icon: React.ElementType
  selectedClass: string
}[] = [
  {
    value: 'run_transaction',
    label: 'Run Transaction',
    icon: Play,
    selectedClass: 'border-blue-500/40 bg-blue-500/[0.08] text-blue-800 dark:text-blue-300 ring-1 ring-blue-500/20',
  },
  {
    value: 'verify_master_data_exists',
    label: 'Verify Master Data',
    icon: Database,
    selectedClass: 'border-slate-500/40 bg-slate-500/[0.08] text-slate-800 dark:text-slate-300 ring-1 ring-slate-500/20',
  },
  {
    value: 'assert_data_state',
    label: 'Assert Data State',
    icon: CheckCircle2,
    selectedClass: 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/20',
  },
  {
    value: 'release_document',
    label: 'Release Document',
    icon: Send,
    selectedClass: 'border-amber-500/40 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/20',
  },
  {
    value: 'sign_off_scenario',
    label: 'Sign Off',
    icon: FileSignature,
    selectedClass: 'border-violet-500/40 bg-violet-500/[0.08] text-violet-800 dark:text-violet-300 ring-1 ring-violet-500/20',
  },
  {
    value: 'capture_evidence',
    label: 'Capture Evidence',
    icon: Camera,
    selectedClass: 'border-pink-500/40 bg-pink-500/[0.08] text-pink-800 dark:text-pink-300 ring-1 ring-pink-500/20',
  },
  {
    value: 'set_test_data',
    label: 'Set Test Data',
    icon: Settings2,
    selectedClass: 'border-indigo-500/40 bg-indigo-500/[0.08] text-indigo-800 dark:text-indigo-300 ring-1 ring-indigo-500/20',
  },
  {
    value: 'call_api',
    label: 'Call API',
    icon: ExternalLink,
    selectedClass: 'border-cyan-500/40 bg-cyan-500/[0.08] text-cyan-800 dark:text-cyan-300 ring-1 ring-cyan-500/20',
  },
  {
    value: 'propose_ir_update',
    label: 'Propose IR Update',
    icon: Sparkles,
    selectedClass: 'border-brand/40 bg-brand/[0.08] text-brand ring-1 ring-brand/20',
  },
]

const CRITICALITY_OPTIONS: {
  value: string
  label: string
  dot: string
  selectedClass: string
}[] = [
  {
    value: 'critical',
    label: 'Critical',
    dot: 'bg-red-500',
    selectedClass: 'border-red-500/40 bg-red-500/[0.08] text-red-800 dark:text-red-300 ring-1 ring-red-500/20',
  },
  {
    value: 'high',
    label: 'High',
    dot: 'bg-orange-500',
    selectedClass: 'border-orange-500/40 bg-orange-500/[0.08] text-orange-900 dark:text-orange-200 ring-1 ring-orange-500/20',
  },
  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-amber-500',
    selectedClass: 'border-amber-500/40 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/20',
  },
  {
    value: 'low',
    label: 'Low',
    dot: 'bg-slate-400',
    selectedClass: 'border-border bg-muted/40 text-muted-foreground ring-1 ring-border/60',
  },
]

const STATE_OPTIONS: {
  value: string
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

const SCOPE_OPTIONS: {
  value: string
  label: string
  description: string
  icon: React.ElementType
}[] = [
  { value: 'Global', label: 'Global', description: 'All tenants', icon: Globe },
  { value: 'Customer', label: 'Customer', description: 'Tenant-specific', icon: Building2 },
  { value: 'Workspace', label: 'Workspace', description: 'Private workspace', icon: FolderOpen },
]

const IR_OPTIONS: {
  value: boolean | null
  label: string
  icon: React.ElementType
}[] = [
  { value: null, label: 'Any', icon: Shield },
  { value: true, label: 'Has IR', icon: FileCode2 },
  { value: false, label: 'No IR', icon: XCircle },
]

function countActiveFilters(filters: TestCaseAdvancedFilters): number {
  return (
    filters.taskTypes.length +
    filters.criticalities.length +
    (filters.hasIr !== null ? 1 : 0) +
    filters.states.length +
    filters.customerScopes.length
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
  fullWidth,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
        'hover:border-brand/30 hover:bg-muted/30',
        fullWidth && 'w-full justify-start',
        selected
          ? cn('shadow-[var(--shadow-xs)]', className)
          : 'border-border/60 bg-background text-muted-foreground',
      )}
    >
      {children}
    </button>
  )
}

interface TestCaseFilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: TestCaseAdvancedFilters
  onFiltersChange: (filters: TestCaseAdvancedFilters) => void
  totalCount: number
  countMatches: (filters: TestCaseAdvancedFilters) => number
}

export function TestCaseFilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  totalCount,
  countMatches,
}: TestCaseFilterSheetProps) {
  const [draft, setDraft] = React.useState(filters)
  const previewCount = countMatches(draft)
  const activeCount = countActiveFilters(draft)

  React.useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  const toggleList = (key: 'taskTypes' | 'criticalities' | 'states' | 'customerScopes', value: string) => {
    setDraft((prev) => {
      const list = prev[key]
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...prev, [key]: next }
    })
  }

  const handleApply = () => {
    onFiltersChange(draft)
    onOpenChange(false)
  }

  const handleClear = () => {
    setDraft(EMPTY_TEST_CASE_FILTERS)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-border/80 [&>button.absolute]:hidden"
      >
        <SheetHeader className="shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.07] via-card to-card px-5 py-4 space-y-3 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-brand text-brand-foreground flex items-center justify-center shadow-sm shrink-0">
                <Filter className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-semibold">Filter Test Cases</SheetTitle>
                <SheetDescription className="text-xs mt-1 leading-relaxed">
                  Narrow the list by task type, criticality, IR binding, and scope.
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
          <FilterSection title="Task Type" description="Atomic action category" icon={Play}>
            <div className="flex flex-col gap-2">
              {TASK_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = draft.taskTypes.includes(opt.value)
                return (
                  <TogglePill
                    key={opt.value}
                    selected={selected}
                    fullWidth
                    onClick={() => toggleList('taskTypes', opt.value)}
                    className={opt.selectedClass}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {opt.label}
                  </TogglePill>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Criticality" description="Business impact if this case fails" icon={ShieldAlert}>
            <div className="grid grid-cols-2 gap-2">
              {CRITICALITY_OPTIONS.map((opt) => {
                const selected = draft.criticalities.includes(opt.value)
                return (
                  <TogglePill
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleList('criticalities', opt.value)}
                    className={opt.selectedClass}
                  >
                    <span className={cn('h-2 w-2 rounded-full shrink-0', opt.dot)} />
                    {opt.label}
                  </TogglePill>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Has IR" description="Test Instruction Repository binding" icon={FileCode2}>
            <div className="grid grid-cols-3 gap-2">
              {IR_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = draft.hasIr === opt.value
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, hasIr: opt.value }))}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all',
                      selected
                        ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20 text-foreground'
                        : 'border-border/60 hover:bg-muted/20 text-muted-foreground',
                    )}
                  >
                    <Icon className={cn('h-4 w-4', selected && 'text-brand')} />
                    <span className="text-[10px] font-medium leading-tight">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="State" description="Lifecycle status" icon={CheckCircle2}>
            <div className="grid grid-cols-2 gap-2">
              {STATE_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const selected = draft.states.includes(opt.value)
                return (
                  <TogglePill
                    key={opt.value}
                    selected={selected}
                    onClick={() => toggleList('states', opt.value)}
                    className={opt.selectedClass}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {opt.label}
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
                    onClick={() => toggleList('customerScopes', opt.value)}
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

export function countTestCaseAdvancedFilters(filters: TestCaseAdvancedFilters): number {
  return countActiveFilters(filters)
}
