'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, AlertCircle, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MOCK_TEST_SUITES, type TestSuiteState } from '@/lib/mock-data'

interface NewSuiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (suite: NewSuitePayload) => void
}

export interface NewSuitePayload {
  name: string
  code: string
  description: string
  business_processes: string[]
  modules: string[]
  state: TestSuiteState
  version: string
}

const AVAILABLE_MODULES = ['SD', 'MM', 'FI', 'CO', 'WM', 'PP', 'HCM', 'PM', 'QM', 'PS']
const AVAILABLE_BPS = ['OTC', 'PTP', 'RTR', 'HTR', 'ATR']

// Convert a free-form name into an UPPER_SNAKE_CASE code suggestion
function suggestCode(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s_-]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)
}

const INITIAL_STATE: NewSuitePayload = {
  name: '',
  code: '',
  description: '',
  business_processes: [],
  modules: [],
  state: 'Draft',
  version: '0.1.0',
}

export function NewSuiteDialog({ open, onOpenChange, onCreated }: NewSuiteDialogProps) {
  const router = useRouter()
  const [form, setForm] = React.useState<NewSuitePayload>(INITIAL_STATE)
  const [codeTouched, setCodeTouched] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<Partial<Record<keyof NewSuitePayload, string>>>({})

  // Reset state whenever the dialog is closed
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm(INITIAL_STATE)
        setCodeTouched(false)
        setIsSubmitting(false)
        setErrors({})
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open])

  // Auto-suggest code from name unless the user has manually edited it
  const handleNameChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      name: value,
      code: codeTouched ? prev.code : suggestCode(value),
    }))
    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
  }

  const toggleModule = (mod: string) => {
    setForm(prev => ({
      ...prev,
      modules: prev.modules.includes(mod)
        ? prev.modules.filter(m => m !== mod)
        : [...prev.modules, mod],
    }))
    if (errors.modules) setErrors(prev => ({ ...prev, modules: undefined }))
  }

  const toggleBP = (bp: string) => {
    setForm(prev => ({
      ...prev,
      business_processes: prev.business_processes.includes(bp)
        ? prev.business_processes.filter(b => b !== bp)
        : [...prev.business_processes, bp],
    }))
    if (errors.business_processes) setErrors(prev => ({ ...prev, business_processes: undefined }))
  }

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Suite name is required.'
    else if (form.name.trim().length < 4) next.name = 'Must be at least 4 characters.'

    if (!form.code.trim()) next.code = 'Suite code is required.'
    else if (!/^[A-Z][A-Z0-9_]{2,}$/.test(form.code))
      next.code = 'Use UPPER_SNAKE_CASE, starting with a letter.'
    else if (MOCK_TEST_SUITES.some(s => s.code === form.code))
      next.code = 'This code is already in use.'

    if (form.business_processes.length === 0)
      next.business_processes = 'Pick at least one business process.'
    if (form.modules.length === 0) next.modules = 'Pick at least one SAP module.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    setIsSubmitting(false)
    onCreated?.(form)
    toast.success('Test Suite created', {
      description: `${form.code} • ${form.name} is now in your repository.`,
      action: {
        label: 'Open',
        onClick: () => router.push(`/test-repository/suites/${form.code.toLowerCase()}`),
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold tracking-tight">
                Create New Test Suite
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Define a reusable container for scenarios, scheduled and run from the Assurance
                Console.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 sm:px-6 py-5 space-y-5">
            {/* Name */}
            <Field
              label="Suite Name"
              htmlFor="suite-name"
              required
              error={errors.name}
              hint="A descriptive name shown in lists and reports."
            >
              <Input
                id="suite-name"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Star Cement Cutover Validation Suite"
                className={cn(
                  'h-9 text-sm',
                  errors.name && 'border-destructive focus-visible:ring-destructive/30',
                )}
                autoFocus
              />
            </Field>

            {/* Code + Version */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
              <Field
                label="Suite Code"
                htmlFor="suite-code"
                required
                error={errors.code}
                hint={
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Auto-generated from name. UPPER_SNAKE_CASE.
                  </span>
                }
              >
                <Input
                  id="suite-code"
                  value={form.code}
                  onChange={e => {
                    setCodeTouched(true)
                    setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))
                    if (errors.code) setErrors(prev => ({ ...prev, code: undefined }))
                  }}
                  placeholder="e.g. SC_CUTOVER_VAL"
                  className={cn(
                    'h-9 text-sm font-mono',
                    errors.code && 'border-destructive focus-visible:ring-destructive/30',
                  )}
                />
              </Field>
              <Field label="Version" htmlFor="suite-version">
                <Input
                  id="suite-version"
                  value={form.version}
                  onChange={e => setForm(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="0.1.0"
                  className="h-9 text-sm font-mono"
                />
              </Field>
            </div>

            {/* Description */}
            <Field
              label="Description"
              htmlFor="suite-description"
              hint="Optional — explain the purpose and scope of this suite."
            >
              <Textarea
                id="suite-description"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What does this suite validate?"
                rows={3}
                className="text-sm resize-none"
              />
            </Field>

            {/* Business Processes */}
            <Field
              label="Business Processes"
              required
              error={errors.business_processes}
              hint="Which SAP processes does this suite cover?"
            >
              <ChipPicker
                options={AVAILABLE_BPS}
                selected={form.business_processes}
                onToggle={toggleBP}
                ariaLabel="Business Processes"
              />
            </Field>

            {/* SAP Modules */}
            <Field
              label="SAP Modules"
              required
              error={errors.modules}
              hint="Which SAP modules are exercised by this suite?"
            >
              <ChipPicker
                options={AVAILABLE_MODULES}
                selected={form.modules}
                onToggle={toggleModule}
                ariaLabel="SAP Modules"
                mono
              />
            </Field>

            {/* Initial State */}
            <Field label="Initial State" hint="Drafts are private; Published is visible to all.">
              <RadioGroup
                value={form.state}
                onValueChange={v => setForm(prev => ({ ...prev, state: v as TestSuiteState }))}
                className="grid grid-cols-2 gap-2"
              >
                {(['Draft', 'Published'] as const).map(state => {
                  const isActive = form.state === state
                  return (
                    <label
                      key={state}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border p-3 cursor-pointer transition-all',
                        isActive
                          ? 'border-brand bg-brand-soft/30 shadow-sm'
                          : 'border-border bg-card hover:border-brand/40',
                      )}
                    >
                      <RadioGroupItem value={state} id={`state-${state}`} className="shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {state}
                        </p>
                        <p className="section-description text-[11px] mt-0.5">
                          {state === 'Draft'
                            ? 'Hidden from execution lists'
                            : 'Available to all users'}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </RadioGroup>
            </Field>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-5 sm:px-6 py-3.5 border-t border-border bg-card gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-8 text-xs min-w-32"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Suite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------- Local building blocks --------

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-xs font-semibold text-foreground">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[11px] text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="page-description text-[11px]">{hint}</p>
      ) : null}
    </div>
  )
}

function ChipPicker({
  options,
  selected,
  onToggle,
  ariaLabel,
  mono = false,
}: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  ariaLabel: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map(opt => {
        const isActive = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={isActive}
            className={cn(
              'inline-flex items-center gap-1 h-7 px-2.5 rounded-md border text-xs font-semibold transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
              mono && 'font-mono',
              isActive
                ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground',
            )}
          >
            {opt}
            {isActive && <X className="h-3 w-3 opacity-80" />}
          </button>
        )
      })}
      {selected.length > 0 && (
        <Badge
          variant="outline"
          className="h-7 px-2 text-[10px] font-semibold border-border bg-muted text-muted-foreground"
        >
          {selected.length} selected
        </Badge>
      )}
    </div>
  )
}
