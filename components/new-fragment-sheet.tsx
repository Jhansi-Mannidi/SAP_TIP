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
import {
  Play,
  Settings2,
  Send,
  ArrowRight,
  Hash,
  Layers,
  CheckCircle2,
  Camera,
  Clock,
  Code2,
  Tag as TagIcon,
  Sparkles,
  AlertCircle,
  Loader2,
  X,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { IRStepType } from '@/lib/mock-data'

type StepTypeMeta = {
  value: IRStepType
  label: string
  icon: React.ElementType
  description: string
  /** theme-safe tinted background using rgba opacity on a solid hue */
  tone: string
}

const STEP_TYPES: StepTypeMeta[] = [
  {
    value: 'open_transaction',
    label: 'Open Transaction',
    icon: Play,
    description: 'Launch an SAP T-code with optional popup handling.',
    tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
  },
  {
    value: 'set_field',
    label: 'Set Field',
    icon: Settings2,
    description: 'Write a value into a screen field.',
    tone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20',
  },
  {
    value: 'press_button',
    label: 'Press Button',
    icon: Send,
    description: 'Click a button by name or shortcut.',
    tone: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  },
  {
    value: 'press_enter',
    label: 'Press Enter',
    icon: ArrowRight,
    description: 'Submit the current screen.',
    tone: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-slate-500/20',
  },
  {
    value: 'select_row',
    label: 'Select Row',
    icon: Hash,
    description: 'Pick a row in a grid by index or key.',
    tone: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20',
  },
  {
    value: 'click_menu',
    label: 'Click Menu',
    icon: Layers,
    description: 'Open a nested menu path.',
    tone: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-teal-500/20',
  },
  {
    value: 'assert_statusbar',
    label: 'Assert Statusbar',
    icon: CheckCircle2,
    description: 'Verify the status-bar message.',
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  },
  {
    value: 'assert_field',
    label: 'Assert Field',
    icon: CheckCircle2,
    description: 'Validate a field value.',
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  },
  {
    value: 'capture_field',
    label: 'Capture Field',
    icon: Camera,
    description: 'Extract a value into a variable.',
    tone: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-pink-500/20',
  },
  {
    value: 'wait',
    label: 'Wait',
    icon: Clock,
    description: 'Pause execution for a fixed or async window.',
    tone: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-slate-500/20',
  },
]

const STEP_TYPE_BY_VALUE = new Map(STEP_TYPES.map(s => [s.value, s]))

// Default JSON templates per step type so users start from a working shape
const TEMPLATE_DEFAULTS: Record<IRStepType, string> = {
  open_transaction: `{
  "tcode": "{{tcode}}",
  "handle_popup": true,
  "timeout_ms": 30000
}`,
  set_field: `{
  "field": "{{field_id}}",
  "value": "{{value}}"
}`,
  press_button: `{
  "button": "{{button_name}}"
}`,
  press_enter: `{
  "wait_ms": 500
}`,
  select_row: `{
  "row_index": 1,
  "key_field": "{{key}}"
}`,
  click_menu: `{
  "path": ["Edit", "Find", "Replace"]
}`,
  assert_statusbar: `{
  "expected_type": "success",
  "contains": "{{expected_text}}"
}`,
  assert_field: `{
  "field": "{{field_id}}",
  "expected": "{{expected_value}}"
}`,
  capture_field: `{
  "field": "{{field_id}}",
  "save_as": "{{variable_name}}"
}`,
  wait: `{
  "min_wait_ms": 1000,
  "max_wait_ms": 5000
}`,
}

interface NewFragmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewFragmentSheet({ open, onOpenChange }: NewFragmentSheetProps) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [stepType, setStepType] = React.useState<IRStepType>('open_transaction')
  const [parameterTemplate, setParameterTemplate] = React.useState(
    TEMPLATE_DEFAULTS.open_transaction,
  )
  const [tags, setTags] = React.useState<string[]>([])
  const [tagInput, setTagInput] = React.useState('')
  const [touched, setTouched] = React.useState(false)
  const [templateEdited, setTemplateEdited] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Reset internal state ~200ms after the sheet closes (after animation)
  React.useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setName('')
      setDescription('')
      setStepType('open_transaction')
      setParameterTemplate(TEMPLATE_DEFAULTS.open_transaction)
      setTags([])
      setTagInput('')
      setTouched(false)
      setTemplateEdited(false)
      setIsSaving(false)
    }, 200)
    return () => clearTimeout(t)
  }, [open])

  // Swap the JSON template when step type changes, unless the user has edited it
  const handleStepTypeChange = (value: string) => {
    const typed = value as IRStepType
    setStepType(typed)
    if (!templateEdited) {
      setParameterTemplate(TEMPLATE_DEFAULTS[typed])
    }
  }

  // Validate the parameter JSON inline
  const jsonError = React.useMemo(() => {
    try {
      JSON.parse(parameterTemplate)
      return null
    } catch (err: any) {
      return err.message?.replace(/^JSON\.parse: /i, '') ?? 'Invalid JSON'
    }
  }, [parameterTemplate])

  const paramCount = React.useMemo(() => {
    try {
      const parsed = JSON.parse(parameterTemplate)
      return parsed && typeof parsed === 'object' ? Object.keys(parsed).length : 0
    } catch {
      return 0
    }
  }, [parameterTemplate])

  const placeholderCount = React.useMemo(
    () => (parameterTemplate.match(/\{\{[^}]+\}\}/g) ?? []).length,
    [parameterTemplate],
  )

  const errors = {
    name: !name.trim() ? 'Name is required' : null,
    description:
      description.trim().length > 0 && description.trim().length < 10
        ? 'Description must be at least 10 characters'
        : null,
    template: jsonError,
  }

  const isValid = !errors.name && !errors.description && !errors.template

  // Live completion percentage for the header progress bar
  const completionPct = React.useMemo(() => {
    let score = 0
    if (name.trim()) score += 25
    if (description.trim().length >= 10) score += 20
    if (stepType) score += 15
    if (!jsonError && paramCount > 0) score += 25
    if (tags.length > 0) score += 15
    return Math.min(100, score)
  }, [name, description, stepType, jsonError, paramCount, tags])

  const addTag = (value: string) => {
    const cleaned = value.trim().toLowerCase().replace(/\s+/g, '-')
    if (!cleaned) return
    if (tags.includes(cleaned)) return
    if (tags.length >= 8) {
      toast.error('Maximum 8 tags allowed')
      return
    }
    setTags([...tags, cleaned])
    setTagInput('')
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(tags.slice(0, -1))
    }
  }

  const handleSubmit = () => {
    setTouched(true)
    if (!isValid) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Fragment created', {
        description: `"${name.trim()}" added to the Step Library.`,
      })
      onOpenChange(false)
    }, 700)
  }

  const meta = STEP_TYPE_BY_VALUE.get(stepType)!
  const StepIcon = meta.icon

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="space-y-3 border-b border-border px-5 sm:px-6 py-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
                <Plus className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <SheetTitle className="text-base font-semibold">
                  New Step Fragment
                </SheetTitle>
                <SheetDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Create a reusable step that can be dragged into any Intent Record.
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* Live completion progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-muted-foreground">Completion</span>
              <span
                className={cn(
                  'tabular-nums',
                  completionPct === 100 ? 'text-brand' : 'text-foreground',
                )}
              >
                {completionPct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Section 1 — Identity */}
          <section className="space-y-3">
            <SectionHeader index={1} title="Identity" />
            <div className="space-y-3">
              <FieldShell
                label="Name"
                required
                error={touched ? errors.name : null}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="e.g. Login to SAP GUI as NTU"
                  className={cn(
                    'h-9 text-sm',
                    touched && errors.name && 'border-destructive',
                  )}
                />
              </FieldShell>

              <FieldShell
                label="Description"
                hint="What does this fragment do? Be specific."
                error={touched ? errors.description : null}
              >
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Standard SAP GUI login sequence using NTU authentication with popup handling."
                  rows={3}
                  className={cn(
                    'text-sm resize-none',
                    touched && errors.description && 'border-destructive',
                  )}
                />
              </FieldShell>
            </div>
          </section>

          {/* Section 2 — Step Type */}
          <section className="space-y-3">
            <SectionHeader index={2} title="Step Type" />
            <FieldShell
              label="Type"
              hint="Determines what action this fragment performs at runtime."
            >
              <Select value={stepType} onValueChange={handleStepTypeChange}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STEP_TYPES.map((t) => {
                    const Icon = t.icon
                    return (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex h-5 w-5 items-center justify-center rounded ring-1 ring-inset',
                              t.tone,
                            )}
                          >
                            <Icon className="h-3 w-3" />
                          </span>
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FieldShell>

            {/* Selected-type preview card */}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset shrink-0',
                  meta.tone,
                )}
              >
                <StepIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{meta.label}</p>
                <p className="section-description text-[11px] mt-0.5">
                  {meta.description}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 — Parameter Template */}
          <section className="space-y-3">
            <SectionHeader index={3} title="Parameter Template" />

            <FieldShell
              label="JSON template"
              hint={
                <>
                  Use{' '}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                    {'{{variable}}'}
                  </code>{' '}
                  for placeholders that get filled when the fragment is used.
                </>
              }
              error={touched ? errors.template : null}
            >
              <div
                className={cn(
                  'relative rounded-lg border bg-zinc-950 dark:bg-zinc-900 ring-1 ring-inset',
                  touched && errors.template
                    ? 'border-destructive ring-destructive/30'
                    : 'border-border ring-transparent',
                )}
              >
                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
                    <Code2 className="h-3 w-3" />
                    JSON
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 tabular-nums">
                    <span>{paramCount} params</span>
                    <span className="h-2.5 w-px bg-zinc-700" />
                    <span>{placeholderCount} placeholders</span>
                  </div>
                </div>
                <Textarea
                  value={parameterTemplate}
                  onChange={(e) => {
                    setParameterTemplate(e.target.value)
                    setTemplateEdited(true)
                  }}
                  spellCheck={false}
                  rows={8}
                  className="font-mono text-[12px] leading-relaxed resize-none border-0 bg-transparent text-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </FieldShell>
          </section>

          {/* Section 4 — Tags */}
          <section className="space-y-3">
            <SectionHeader index={4} title="Tags" optional />
            <FieldShell
              label="Tags"
              hint="Press Enter or comma to add. Up to 8 tags."
            >
              <div
                className={cn(
                  'flex flex-wrap items-center gap-1.5 min-h-[40px] rounded-md border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                )}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-brand border border-brand/30 px-2 py-0.5 text-[11px] font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="rounded-full opacity-70 hover:opacity-100 transition-opacity"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={tags.length === 0 ? 'authentication, login, gui…' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
              {tags.length > 0 && (
                <p className="page-description mt-1.5 text-[10px] flex items-center gap-1">
                  <TagIcon className="h-2.5 w-2.5" />
                  {tags.length} of 8 tags
                </p>
              )}
            </FieldShell>
          </section>

          {/* Tip block */}
          <div className="flex items-start gap-2.5 rounded-md border border-brand/30 bg-brand-soft/40 px-3 py-2.5">
            <Sparkles className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
            <p className="text-[11px] text-foreground/80 leading-relaxed">
              <span className="font-semibold text-foreground">Reusable by design.</span>{' '}
              Once saved, this fragment can be dragged into any Intent Record and its
              placeholders will be filled at usage time.
            </p>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-9"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSaving}
            size="sm"
            className="h-9 gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Create Fragment
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// --- Small primitives used inside the sheet ---------------------------------

function SectionHeader({
  index,
  title,
  optional,
}: {
  index: number
  title: string
  optional?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-brand text-[10px] font-semibold ring-1 ring-inset ring-brand/30">
        {index}
      </span>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
        {title}
      </h3>
      {optional && (
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
          Optional
        </span>
      )}
    </div>
  )
}

function FieldShell({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: React.ReactNode
  error?: string | null
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-[11px] text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="page-description text-[11px]">{hint}</p>
      ) : null}
    </div>
  )
}
