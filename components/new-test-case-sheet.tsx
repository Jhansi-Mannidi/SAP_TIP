"use client"

import * as React from 'react'
import {
  Plus,
  Pencil,
  Copy,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
  Play,
  Database,
  CheckCircle2,
  Send,
  FileSignature,
  Camera,
  Settings2,
  ExternalLink,
  ShieldAlert,
  Bot,
  User as UserIcon,
  Globe2,
  Building2,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type TestCaseSheetMode = 'create' | 'edit' | 'duplicate'

export interface TestCaseDraft {
  id?: string
  code: string
  name: string
  task_type: string
  criticality: string
  default_assignee_class: string
  customer_scope: string
  has_ir: boolean
  evidence_profile: string
  state: string
  tcode?: string
  description?: string
  tags?: string[]
}

interface NewTestCaseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: TestCaseSheetMode
  initialData?: Partial<TestCaseDraft> | null
}

// Task type catalog — drives the picker grid
const TASK_TYPES = [
  {
    value: 'run_transaction',
    label: 'Run Transaction',
    description: 'Execute an SAP transaction (e.g. VA01, ME21N).',
    icon: Play,
  },
  {
    value: 'verify_master_data_exists',
    label: 'Verify Master Data',
    description: 'Check that referenced master data records exist.',
    icon: Database,
  },
  {
    value: 'assert_data_state',
    label: 'Assert Data State',
    description: 'Validate an expected data condition or value.',
    icon: CheckCircle2,
  },
  {
    value: 'release_document',
    label: 'Release Document',
    description: 'Approve or release a document for downstream flow.',
    icon: Send,
  },
  {
    value: 'sign_off_scenario',
    label: 'Sign-off',
    description: 'Require human sign-off before continuing the run.',
    icon: FileSignature,
  },
  {
    value: 'capture_evidence',
    label: 'Capture Evidence',
    description: 'Capture screenshots, logs, or output for audit.',
    icon: Camera,
  },
  {
    value: 'set_test_data',
    label: 'Set Test Data',
    description: 'Seed or override values in the test data fixture.',
    icon: Settings2,
  },
  {
    value: 'call_api',
    label: 'Call API',
    description: 'Invoke an OData / REST / RFC endpoint.',
    icon: ExternalLink,
  },
  {
    value: 'propose_ir_update',
    label: 'Propose IR Update',
    description: 'AI Agent proposes an Interaction Recipe update.',
    icon: Sparkles,
  },
]

const CRITICALITY_OPTIONS = [
  {
    value: 'critical',
    label: 'Critical',
    description: 'Blocks release if failing.',
    dot: 'bg-red-500',
  },
  {
    value: 'high',
    label: 'High',
    description: 'Major impact on regression.',
    dot: 'bg-amber-500',
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Standard regression coverage.',
    dot: 'bg-sky-500',
  },
  {
    value: 'low',
    label: 'Low',
    description: 'Informational / exploratory.',
    dot: 'bg-muted-foreground',
  },
]

const ASSIGNEE_OPTIONS = [
  { value: 'agent', label: 'AI Agent', description: 'Runs unattended.', icon: Bot },
  { value: 'human', label: 'Human', description: 'Requires user action.', icon: UserIcon },
]

const SCOPE_OPTIONS = [
  { value: 'Global', label: 'Global', description: 'All projects', icon: Globe2 },
  { value: 'Customer', label: 'Customer', description: 'Customer-specific', icon: Building2 },
  { value: 'Workspace', label: 'Workspace', description: 'Current workspace only', icon: FolderOpen },
]

const EVIDENCE_OPTIONS = [
  { value: 'full', label: 'Full', description: 'Screenshots + logs + payloads' },
  { value: 'minimal', label: 'Minimal', description: 'Logs only' },
  { value: 'none', label: 'None', description: 'No artifacts captured' },
]

const STATE_OPTIONS = [
  { value: 'Draft', label: 'Draft', description: 'Not yet ready to run.' },
  { value: 'Published', label: 'Published', description: 'Available to all suites.' },
]

const EMPTY_DRAFT: TestCaseDraft = {
  code: '',
  name: '',
  task_type: 'run_transaction',
  criticality: 'medium',
  default_assignee_class: 'agent',
  customer_scope: 'Global',
  has_ir: true,
  evidence_profile: 'minimal',
  state: 'Draft',
  tcode: '',
  description: '',
  tags: [],
}

// Generate a UPPER_SNAKE_CASE code from a free-form name
function suggestCode(name: string, tcode?: string) {
  const tokens = name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
  const base = tokens.join('_') || 'NEW_CASE'
  const prefix = 'TC'
  const tail = tcode?.trim() ? `_${tcode.trim().toUpperCase()}` : ''
  return `${prefix}_${base}${tail}`.slice(0, 48)
}

export function NewTestCaseSheet({
  open,
  onOpenChange,
  mode = 'create',
  initialData,
}: NewTestCaseSheetProps) {
  const [draft, setDraft] = React.useState<TestCaseDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = React.useState(false)
  const [codeManuallyEdited, setCodeManuallyEdited] = React.useState(false)
  const [tagInput, setTagInput] = React.useState('')

  // Reset draft when opening
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        const base = { ...EMPTY_DRAFT, ...initialData }
        // Duplicate mode — clone with a derived code
        if (mode === 'duplicate') {
          base.code = `${base.code}_COPY`
          base.state = 'Draft'
        }
        setDraft(base as TestCaseDraft)
        setCodeManuallyEdited(true) // existing record — don't auto-overwrite
      } else {
        setDraft(EMPTY_DRAFT)
        setCodeManuallyEdited(false)
      }
      setErrors({})
      setTagInput('')
    }
  }, [open, initialData, mode])

  // Auto-suggest code from name + tcode until user edits the code field
  React.useEffect(() => {
    if (!codeManuallyEdited && (draft.name || draft.tcode)) {
      setDraft(d => ({ ...d, code: suggestCode(d.name, d.tcode) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.name, draft.tcode, codeManuallyEdited])

  const titleConfig = {
    create: { title: 'New Test Case', description: 'Define an atomic, reusable test unit.', icon: Plus },
    edit: { title: 'Edit Test Case', description: 'Update test case configuration.', icon: Pencil },
    duplicate: {
      title: 'Duplicate Test Case',
      description: 'Create a new test case based on an existing one.',
      icon: Copy,
    },
  }[mode]
  const HeaderIcon = titleConfig.icon

  // Completion progress for the header bar
  const completionPct = React.useMemo(() => {
    let total = 5
    let filled = 0
    if (draft.code.trim()) filled++
    if (draft.name.trim()) filled++
    if (draft.task_type) filled++
    if (draft.criticality) filled++
    if (draft.default_assignee_class) filled++
    return Math.round((filled / total) * 100)
  }, [draft])

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const normalized = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!draft.tags?.includes(normalized) && (draft.tags?.length ?? 0) < 10) {
        setDraft(d => ({ ...d, tags: [...(d.tags ?? []), normalized] }))
      }
      setTagInput('')
    } else if (e.key === 'Backspace' && !tagInput && draft.tags?.length) {
      setDraft(d => ({ ...d, tags: d.tags?.slice(0, -1) }))
    }
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!draft.code.trim()) next.code = 'Code is required.'
    else if (!/^[A-Z][A-Z0-9_]{2,47}$/.test(draft.code.trim())) {
      next.code = 'Use UPPER_SNAKE_CASE, 3–48 chars (e.g. TC_VA01_CREATE).'
    }
    if (!draft.name.trim()) next.name = 'Name is required.'
    else if (draft.name.trim().length < 4) next.name = 'Name must be at least 4 characters.'
    if (!draft.task_type) next.task_type = 'Pick a task type.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      const verb =
        mode === 'create' ? 'created' : mode === 'duplicate' ? 'duplicated' : 'updated'
      toast.success(`Test case ${verb}`, {
        description: `${draft.code} — ${draft.name}`,
      })
      onOpenChange(false)
    }, 700)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col gap-0">
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 sm:px-6 pt-5 pb-4 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
              <HeaderIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base font-semibold leading-tight">
                {titleConfig.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {titleConfig.description}
              </SheetDescription>
            </div>
          </div>
          {/* Live completion bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              <span>Required fields</span>
              <span className="tabular-nums">{completionPct}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  completionPct === 100 ? 'bg-emerald-500' : 'bg-brand',
                )}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Identity */}
          <section className="space-y-4">
            <SectionHeading
              eyebrow="01"
              title="Identity"
              hint="A short code and a human-readable name."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                label="Name"
                required
                error={errors.name}
                htmlFor="tc-name"
              >
                <Input
                  id="tc-name"
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Create Sales Order via VA01"
                  className={cn('h-9 text-sm', errors.name && 'border-destructive')}
                />
              </Field>
              <Field
                label="Code"
                required
                error={errors.code}
                htmlFor="tc-code"
                hint="UPPER_SNAKE_CASE — auto-suggested from name."
              >
                <Input
                  id="tc-code"
                  value={draft.code}
                  onChange={e => {
                    setDraft(d => ({ ...d, code: e.target.value.toUpperCase() }))
                    setCodeManuallyEdited(true)
                  }}
                  placeholder="TC_VA01_CREATE"
                  className={cn(
                    'h-9 text-sm font-mono',
                    errors.code && 'border-destructive',
                  )}
                />
              </Field>
            </div>
            <Field label="T-Code / Transaction (optional)" htmlFor="tc-tcode">
              <Input
                id="tc-tcode"
                value={draft.tcode ?? ''}
                onChange={e =>
                  setDraft(d => ({ ...d, tcode: e.target.value.toUpperCase() }))
                }
                placeholder="VA01, ME21N, MIGO…"
                className="h-9 text-sm font-mono w-full sm:w-1/2"
              />
            </Field>
            <Field label="Description" htmlFor="tc-desc">
              <Textarea
                id="tc-desc"
                value={draft.description ?? ''}
                onChange={e =>
                  setDraft(d => ({ ...d, description: e.target.value }))
                }
                placeholder="What does this test case verify? Document inputs, outputs, and any prerequisites."
                rows={3}
                className="resize-none text-sm"
              />
            </Field>
          </section>

          {/* Task type */}
          <section className="space-y-3">
            <SectionHeading
              eyebrow="02"
              title="Task type"
              hint="What does this test case do?"
              error={errors.task_type}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TASK_TYPES.map(opt => {
                const Icon = opt.icon
                const selected = draft.task_type === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setDraft(d => ({ ...d, task_type: opt.value }))}
                    className={cn(
                      'group relative rounded-lg border p-3 text-left transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      selected
                        ? 'border-brand bg-brand-soft/40 shadow-sm'
                        : 'border-border bg-card hover:border-brand/40 hover:bg-muted/40',
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-md shrink-0 transition-colors',
                          selected
                            ? 'bg-brand text-brand-foreground'
                            : 'bg-muted text-muted-foreground group-hover:bg-brand-soft group-hover:text-brand',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold leading-tight">
                          {opt.label}
                        </p>
                        <p className="section-description text-[11px] mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Criticality + Assignee */}
          <section className="space-y-3">
            <SectionHeading
              eyebrow="03"
              title="Execution"
              hint="Criticality and who runs it."
            />
            <div>
              <p className="page-description text-[11px] mb-2">
                Criticality
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CRITICALITY_OPTIONS.map(opt => {
                  const selected = draft.criticality === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setDraft(d => ({ ...d, criticality: opt.value }))
                      }
                      className={cn(
                        'rounded-md border px-2.5 py-2 text-left transition-all',
                        selected
                          ? 'border-brand bg-brand-soft/40'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn('h-1.5 w-1.5 rounded-full', opt.dot)}
                        />
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </div>
                      <p className="section-description text-[10px] mt-0.5">
                        {opt.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="page-description text-[11px] mb-2">
                Default Assignee
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ASSIGNEE_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const selected = draft.default_assignee_class === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setDraft(d => ({ ...d, default_assignee_class: opt.value }))
                      }
                      className={cn(
                        'rounded-md border px-2.5 py-2 text-left transition-all flex items-center gap-2',
                        selected
                          ? 'border-brand bg-brand-soft/40'
                          : 'border-border bg-card hover:bg-muted/40',
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
                        <p className="text-xs font-semibold leading-tight">
                          {opt.label}
                        </p>
                        <p className="page-description text-[10px]">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Scope */}
          <section className="space-y-3">
            <SectionHeading
              eyebrow="04"
              title="Visibility"
              hint="Where can this test case be used?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SCOPE_OPTIONS.map(opt => {
                const Icon = opt.icon
                const selected = draft.customer_scope === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setDraft(d => ({ ...d, customer_scope: opt.value }))
                    }
                    className={cn(
                      'rounded-md border px-3 py-2.5 text-left transition-all flex items-center gap-2',
                      selected
                        ? 'border-brand bg-brand-soft/40'
                        : 'border-border bg-card hover:bg-muted/40',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        selected ? 'text-brand' : 'text-muted-foreground',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">
                        {opt.label}
                      </p>
                      <p className="page-description text-[10px]">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Evidence + IR */}
          <section className="space-y-3">
            <SectionHeading
              eyebrow="05"
              title="Evidence & Recording"
              hint="What gets captured during a run."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EVIDENCE_OPTIONS.map(opt => {
                const selected = draft.evidence_profile === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setDraft(d => ({ ...d, evidence_profile: opt.value }))
                    }
                    className={cn(
                      'rounded-md border px-3 py-2 text-left transition-all',
                      selected
                        ? 'border-brand bg-brand-soft/40'
                        : 'border-border bg-card hover:bg-muted/40',
                    )}
                  >
                    <p className="text-xs font-semibold leading-tight">{opt.label}</p>
                    <p className="section-description text-[10px] mt-0.5">
                      {opt.description}
                    </p>
                  </button>
                )
              })}
            </div>
            <div className="flex items-start justify-between rounded-md border border-border bg-muted/30 p-3 gap-3">
              <div className="min-w-0">
                <Label htmlFor="tc-has-ir" className="text-xs font-semibold cursor-pointer">
                  Attach an Interaction Recipe (IR)
                </Label>
                <p className="section-description text-[11px] mt-0.5">
                  IRs replay UI steps. Required for{' '}
                  <code className="font-mono">run_transaction</code> tasks.
                </p>
              </div>
              <Switch
                id="tc-has-ir"
                checked={draft.has_ir}
                onCheckedChange={c => setDraft(d => ({ ...d, has_ir: c }))}
              />
            </div>
          </section>

          {/* State + Tags */}
          <section className="space-y-3">
            <SectionHeading
              eyebrow="06"
              title="Lifecycle & Tags"
              hint="Initial state and discoverability."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STATE_OPTIONS.map(opt => {
                const selected = draft.state === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setDraft(d => ({ ...d, state: opt.value }))}
                    className={cn(
                      'rounded-md border px-3 py-2 text-left transition-all',
                      selected
                        ? 'border-brand bg-brand-soft/40'
                        : 'border-border bg-card hover:bg-muted/40',
                    )}
                  >
                    <p className="text-xs font-semibold leading-tight">{opt.label}</p>
                    <p className="section-description text-[10px] mt-0.5">
                      {opt.description}
                    </p>
                  </button>
                )
              })}
            </div>
            <Field label="Tags" htmlFor="tc-tags" hint="Enter or comma to add. Max 10.">
              <div
                className={cn(
                  'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 min-h-9',
                  'focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-background',
                )}
              >
                {draft.tags?.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="h-6 px-2 gap-1 bg-brand-soft text-brand border border-brand/30 font-medium text-[11px]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft(d => ({
                          ...d,
                          tags: d.tags?.filter(t => t !== tag),
                        }))
                      }
                      className="rounded-sm hover:bg-brand/20 -mr-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  id="tc-tags"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={
                    (draft.tags?.length ?? 0) === 0
                      ? 'sales, regression, smoke…'
                      : ''
                  }
                  className="flex-1 min-w-[8ch] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Field>
          </section>

          {/* Critical warning */}
          {draft.criticality === 'critical' && draft.state === 'Published' && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3 py-2.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                <span className="font-semibold">Critical + Published.</span>{' '}
                This case will block releases when failing. Make sure ownership and
                evidence settings are correct.
              </p>
            </div>
          )}
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
            size="sm"
            disabled={isSaving}
            className="h-9 gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <HeaderIcon className="h-3.5 w-3.5" />
                {mode === 'edit' ? 'Save Changes' : mode === 'duplicate' ? 'Duplicate Case' : 'Create Test Case'}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---- Helper components ----

function SectionHeading({
  eyebrow,
  title,
  hint,
  error,
}: {
  eyebrow: string
  title: string
  hint?: string
  error?: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-[10px] font-mono font-semibold text-brand tabular-nums">
          {eyebrow}
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
        {hint && (
          <p className="page-description text-[11px] truncate hidden sm:block">
            {hint}
          </p>
        )}
      </div>
      {error && (
        <span className="text-[10px] font-medium text-destructive flex items-center gap-1 shrink-0">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </div>
  )
}

function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-[11px] font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && (
          <span className="text-[10px] text-muted-foreground truncate">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-[10px] text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
