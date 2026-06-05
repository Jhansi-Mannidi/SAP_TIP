'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe,
  Loader2,
  Plus,
  Tag,
  Users,
  X,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ScenarioState = 'Draft' | 'Published'
type CustomerScope = 'Global' | 'Customer' | 'Workspace'

// Available options drawn from the SAP catalog
const BUSINESS_PROCESSES = [
  { id: 'OTC', label: 'Order to Cash' },
  { id: 'PTP', label: 'Procure to Pay' },
  { id: 'RTR', label: 'Record to Report' },
  { id: 'HTR', label: 'Hire to Retire' },
  { id: 'ATR', label: 'Acquire to Retire' },
] as const

const SAP_MODULES = [
  'SD',
  'MM',
  'FI',
  'CO',
  'WM',
  'PP',
  'HR',
  'PM',
  'QM',
  'PS',
] as const

const SCOPE_OPTIONS: {
  value: CustomerScope
  label: string
  description: string
  icon: typeof Globe
}[] = [
  {
    value: 'Global',
    label: 'Global',
    description: 'Available to all workspaces and customers',
    icon: Globe,
  },
  {
    value: 'Customer',
    label: 'Customer',
    description: 'Visible to the current customer only',
    icon: Users,
  },
  {
    value: 'Workspace',
    label: 'Workspace',
    description: 'Private to this workspace',
    icon: FileText,
  },
]

const STATE_OPTIONS: {
  value: ScenarioState
  label: string
  description: string
}[] = [
  {
    value: 'Draft',
    label: 'Draft',
    description: 'Saved for editing — not runnable yet',
  },
  {
    value: 'Published',
    label: 'Published',
    description: 'Available for execution by all suites',
  },
]

interface NewScenarioSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Convert "Sales Order Block" -> "SALES_ORDER_BLOCK"
function toCode(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)
}

export function NewScenarioSheet({ open, onOpenChange }: NewScenarioSheetProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [codeManuallyEdited, setCodeManuallyEdited] = useState(false)
  const [businessProcess, setBusinessProcess] = useState<string>('')
  const [modules, setModules] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [scope, setScope] = useState<CustomerScope>('Workspace')
  const [state, setState] = useState<ScenarioState>('Draft')
  const [version, setVersion] = useState('1.0.0')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-derive code from name unless the user has typed in the code field
  useEffect(() => {
    if (!codeManuallyEdited) {
      setCode(toCode(name))
    }
  }, [name, codeManuallyEdited])

  // Reset the form a moment after closing
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setName('')
        setCode('')
        setCodeManuallyEdited(false)
        setBusinessProcess('')
        setModules([])
        setDescription('')
        setTagInput('')
        setTags([])
        setScope('Workspace')
        setState('Draft')
        setVersion('1.0.0')
        setErrors({})
        setIsSubmitting(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open])

  const toggleModule = (m: string) => {
    setModules((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    )
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (!t) return
    if (tags.includes(t)) {
      setTagInput('')
      return
    }
    if (tags.length >= 8) {
      toast.error('Maximum 8 tags allowed')
      return
    }
    setTags([...tags, t])
    setTagInput('')
  }

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t))
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Scenario name is required'
    else if (name.trim().length < 3) next.name = 'Name must be at least 3 characters'
    if (!code.trim()) next.code = 'Code is required'
    else if (!/^[A-Z0-9_]+$/.test(code)) {
      next.code = 'Code must use UPPER_SNAKE_CASE (A–Z, 0–9, _)'
    }
    if (!businessProcess) next.businessProcess = 'Select a business process'
    if (modules.length === 0) next.modules = 'Select at least one SAP module'
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      next.version = 'Use semver format (e.g. 1.0.0)'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the highlighted fields')
      return
    }
    setIsSubmitting(true)
    // Simulate save
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`Scenario "${name}" created`, {
        description: `Saved as ${code} in ${state} state`,
      })
      onOpenChange(false)
    }, 900)
  }

  const completion = useMemo(() => {
    let filled = 0
    const total = 5
    if (name.trim()) filled++
    if (code.trim()) filled++
    if (businessProcess) filled++
    if (modules.length > 0) filled++
    if (description.trim()) filled++
    return Math.round((filled / total) * 100)
  }, [name, code, businessProcess, modules, description])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col gap-0"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-border px-5 sm:px-6 py-4 space-y-2 text-left">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
                <Plus className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base font-semibold tracking-tight">
                  Create New Test Scenario
                </SheetTitle>
                <SheetDescription className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  Define a reusable atomic test flow that can be composed into Test Suites and
                  executed by the Assurance Console.
                </SheetDescription>
              </div>
            </div>

            {/* Completion bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <span>Completion</span>
                <span className="text-foreground tabular-nums">{completion}%</span>
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            {/* Name + Code row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-3 space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Scenario Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. OTC Happy Path Domestic"
                  className={cn(
                    'h-9 text-sm',
                    errors.name && 'border-destructive focus-visible:ring-destructive/40',
                  )}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="code" className="text-xs font-medium">
                  Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase())
                    setCodeManuallyEdited(true)
                  }}
                  placeholder="OTC_HP_DOM"
                  className={cn(
                    'h-9 text-sm font-mono',
                    errors.code && 'border-destructive focus-visible:ring-destructive/40',
                  )}
                  aria-invalid={!!errors.code}
                />
                {errors.code ? (
                  <p className="flex items-center gap-1 text-[11px] text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.code}
                  </p>
                ) : (
                  <p className="page-description text-[11px]">
                    {codeManuallyEdited ? 'Custom code' : 'Auto-derived from name'}
                  </p>
                )}
              </div>
            </div>

            {/* Business Process — single select chips */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Business Process <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {BUSINESS_PROCESSES.map((bp) => {
                  const selected = businessProcess === bp.id
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => setBusinessProcess(bp.id)}
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-xs font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        selected
                          ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                      )}
                    >
                      <span className="font-semibold font-mono">{bp.id}</span>
                      <span
                        className={cn(
                          'hidden sm:inline text-[11px] font-normal',
                          selected ? 'text-brand-foreground/80' : 'text-muted-foreground/80',
                        )}
                      >
                        {bp.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.businessProcess && (
                <p className="flex items-center gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.businessProcess}
                </p>
              )}
            </div>

            {/* SAP Modules — multi-select chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">
                  SAP Modules <span className="text-destructive">*</span>
                </Label>
                {modules.length > 0 && (
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {modules.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAP_MODULES.map((m) => {
                  const selected = modules.includes(m)
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleModule(m)}
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex items-center gap-1 h-7 px-2.5 rounded-md border text-[11px] font-mono font-semibold transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        selected
                          ? 'border-brand bg-brand text-brand-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                      )}
                    >
                      {m}
                      {selected && <X className="h-2.5 w-2.5 opacity-70" />}
                    </button>
                  )
                })}
              </div>
              {errors.modules && (
                <p className="flex items-center gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.modules}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the business intent, master data prerequisites, and any edge cases this scenario covers…"
                className="min-h-[100px] resize-none text-sm"
              />
              <p className="page-description text-[11px]">
                {description.length}/500 — clear descriptions help teammates re-use this scenario.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-xs font-medium">
                Tags
              </Label>
              <div
                className={cn(
                  'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 min-h-9',
                  'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
                )}
              >
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 h-5 px-1.5 rounded bg-brand-soft/60 text-brand text-[10px] font-medium border border-brand/30"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="ml-0.5 hover:text-foreground"
                      aria-label={`Remove tag ${t}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      addTag()
                    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
                      removeTag(tags[tags.length - 1])
                    }
                  }}
                  onBlur={addTag}
                  placeholder={tags.length ? '' : 'e.g. smoke, regression, best-path'}
                  className="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="page-description text-[11px]">
                Press Enter or comma to add. Up to 8 tags.
              </p>
            </div>

            {/* Version */}
            <div className="space-y-1.5">
              <Label htmlFor="version" className="text-xs font-medium">
                Version
              </Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className={cn(
                  'h-9 text-sm font-mono w-32',
                  errors.version && 'border-destructive focus-visible:ring-destructive/40',
                )}
                aria-invalid={!!errors.version}
              />
              {errors.version && (
                <p className="flex items-center gap-1 text-[11px] text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.version}
                </p>
              )}
            </div>

            {/* Scope — radio cards */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Visibility Scope</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SCOPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon
                  const selected = scope === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setScope(opt.value)}
                      aria-pressed={selected}
                      className={cn(
                        'group relative flex items-start gap-2 rounded-lg border p-2.5 text-left transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        selected
                          ? 'border-brand bg-brand-soft/40'
                          : 'border-border bg-card hover:border-foreground/20 hover:bg-muted/40',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-6 w-6 items-center justify-center rounded-md shrink-0',
                          selected
                            ? 'bg-brand text-brand-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground">{opt.label}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {opt.description}
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle2 className="absolute top-1.5 right-1.5 h-3 w-3 text-brand" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Initial state — radio cards */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Initial State</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STATE_OPTIONS.map((opt) => {
                  const selected = state === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setState(opt.value)}
                      aria-pressed={selected}
                      className={cn(
                        'relative flex items-start gap-2 rounded-lg border p-2.5 text-left transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                        selected
                          ? 'border-brand bg-brand-soft/40'
                          : 'border-border bg-card hover:border-foreground/20 hover:bg-muted/40',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 transition-colors',
                          selected
                            ? 'border-brand bg-brand'
                            : 'border-muted-foreground/40 bg-background',
                        )}
                      >
                        {selected && (
                          <span className="block h-full w-full rounded-full bg-brand-foreground/40 scale-50" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground">{opt.label}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {opt.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Info alert */}
            <div className="flex items-start gap-2 rounded-md border border-brand/30 bg-brand-soft/40 px-3 py-2.5">
              <AlertCircle className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Next step.</span> After creating
                the scenario, you can add Tasks, link Test Data Sets, and set Success Criteria from
                the scenario detail page.
              </p>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 gap-1.5" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Create Scenario
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
