'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  GitBranch,
  Loader2,
  Sparkles,
  Target,
  User,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  MOCK_PAIRING_RULES,
  MOCK_SERVICE_ROLES,
  type PairingRule,
} from '@/lib/config-mock-data'

const STEPS = [
  { id: 'predicate', label: 'Match Condition', icon: Target },
  { id: 'role', label: 'Target Role', icon: Users },
  { id: 'assignment', label: 'Assignment', icon: User },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

const PREDICATE_TEMPLATES = [
  {
    id: 'scenario_module',
    label: 'Scenario module',
    display: 'For any Scenario in module {module}',
    predicate: 'scenario.module == "{module}"',
    fields: [{ key: 'module', label: 'Module', placeholder: 'SD' }],
  },
  {
    id: 'defect_severity',
    label: 'Defect severity',
    display: 'For any Defect with severity {severity}',
    predicate: 'defect.severity == "{severity}"',
    fields: [{ key: 'severity', label: 'Severity', placeholder: 'Critical' }],
  },
  {
    id: 'task_type',
    label: 'Task type',
    display: 'For any task of type {taskType}',
    predicate: 'task.type == "{taskType}"',
    fields: [{ key: 'taskType', label: 'Task Type', placeholder: 'test_execution' }],
  },
  {
    id: 'custom',
    label: 'Custom expression',
    display: '',
    predicate: '',
    fields: [],
  },
] as const

const ASSIGNEE_MODES: {
  id: PairingRule['assignee_mode']
  label: string
  description: string
}[] = [
  {
    id: 'specific',
    label: 'Specific Person',
    description: 'Always assign to a named team member when the rule matches.',
  },
  {
    id: 'first_available',
    label: 'First Available',
    description: 'Pick the first member of the target role who is available.',
  },
  {
    id: 'round_robin',
    label: 'Round Robin',
    description: 'Rotate assignment across role members for load balancing.',
  },
]

const FALLBACK_OPTIONS = [
  'Pradeep Sharma',
  'Jahnavi Rao',
  'Karthik Iyer',
  'Rajiv Menon',
  'migration_manager',
  'test_engineer',
  'qa_lead',
]

export interface PairingRuleRegisterForm {
  templateId: string
  templateValues: Record<string, string>
  predicateDisplay: string
  predicate: string
  targetRole: string
  assigneeMode: PairingRule['assignee_mode'] | ''
  assigneeName: string
  fallbackChain: string[]
  priority: number
  isActive: boolean
}

const INITIAL_FORM: PairingRuleRegisterForm = {
  templateId: '',
  templateValues: {},
  predicateDisplay: '',
  predicate: '',
  targetRole: '',
  assigneeMode: '',
  assigneeName: '',
  fallbackChain: [],
  priority: MOCK_PAIRING_RULES.length + 1,
  isActive: true,
}

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
                    'h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-background shrink-0 transition-colors',
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
                    isComplete && 'text-muted-foreground',
                    !isComplete && !isCurrent && 'text-muted-foreground/60',
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
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/50 last:border-0 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right break-all', mono && 'font-mono text-xs')}>
        {value || '—'}
      </span>
    </div>
  )
}

function applyTemplate(
  templateId: string,
  values: Record<string, string>,
): { predicateDisplay: string; predicate: string } {
  const template = PREDICATE_TEMPLATES.find((t) => t.id === templateId)
  if (!template || templateId === 'custom') {
    return { predicateDisplay: '', predicate: '' }
  }
  let display = template.display
  let predicate = template.predicate
  for (const [key, val] of Object.entries(values)) {
    display = display.replace(`{${key}}`, val)
    predicate = predicate.replace(`{${key}}`, val)
  }
  return { predicateDisplay: display, predicate }
}

export function PairingRuleRegisterWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<PairingRuleRegisterForm>(INITIAL_FORM)
  const [creating, setCreating] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const update = (patch: Partial<PairingRuleRegisterForm>) => setForm((f) => ({ ...f, ...patch }))

  const selectedRole = MOCK_SERVICE_ROLES.find((r) => r.code === form.targetRole)

  const selectTemplate = (templateId: string) => {
    const { predicateDisplay, predicate } = applyTemplate(templateId, form.templateValues)
    update({ templateId, predicateDisplay, predicate })
  }

  const updateTemplateValue = (key: string, value: string) => {
    const templateValues = { ...form.templateValues, [key]: value }
    const { predicateDisplay, predicate } = applyTemplate(form.templateId, templateValues)
    update({ templateValues, predicateDisplay, predicate })
  }

  const toggleFallback = (name: string) => {
    update({
      fallbackChain: form.fallbackChain.includes(name)
        ? form.fallbackChain.filter((n) => n !== name)
        : [...form.fallbackChain, name],
    })
  }

  const canNext = () => {
    switch (currentStep) {
      case 'predicate':
        return form.predicateDisplay.trim().length >= 10 && form.predicate.trim().length >= 5
      case 'role':
        return !!form.targetRole
      case 'assignment':
        return (
          !!form.assigneeMode &&
          (form.assigneeMode !== 'specific' || form.assigneeName.trim().length >= 2)
        )
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1)
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
    } else {
      router.push('/system-admin/pairing')
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1200))
    setCreating(false)
    const { toast } = await import('sonner')
    toast.success('Pairing rule created', {
      description: `Priority ${form.priority} — ${form.predicateDisplay.slice(0, 60)}…`,
    })
    router.push('/system-admin/pairing')
  }

  const assigneeModeLabel =
    ASSIGNEE_MODES.find((m) => m.id === form.assigneeMode)?.label ?? form.assigneeMode

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-[var(--shadow-sm)] overflow-hidden"
        >
          {currentStep === 'predicate' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Match condition</h2>
                <p className="page-description mt-1">
                  Define when this rule fires. Rules are evaluated by priority at task instantiation.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Condition Template
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PREDICATE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => selectTemplate(template.id)}
                      className={cn(
                        'rounded-xl border p-3 text-left transition-all',
                        form.templateId === template.id
                          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border hover:bg-muted/30 hover:border-brand/20',
                      )}
                    >
                      <p className="text-sm font-medium">{template.label}</p>
                      {template.display && (
                        <p className="caption-text mt-1 line-clamp-2">{template.display}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {form.templateId &&
                form.templateId !== 'custom' &&
                PREDICATE_TEMPLATES.find((t) => t.id === form.templateId)?.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {field.label}
                    </Label>
                    <Input
                      placeholder={field.placeholder}
                      value={form.templateValues[field.key] ?? ''}
                      onChange={(e) => updateTemplateValue(field.key, e.target.value)}
                    />
                  </div>
                ))}

              <div className="space-y-2">
                <Label
                  htmlFor="predicate-display"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Human-readable Description
                </Label>
                <Input
                  id="predicate-display"
                  placeholder="For any Scenario in module SD under Migration SC_S4_CUTOVER_2026"
                  value={form.predicateDisplay}
                  onChange={(e) => update({ predicateDisplay: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="predicate-expr"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Predicate Expression
                </Label>
                <Textarea
                  id="predicate-expr"
                  placeholder='scenario.module == "SD" && migration.code == "SC_S4_CUTOVER_2026"'
                  value={form.predicate}
                  onChange={(e) => update({ predicate: e.target.value })}
                  className="font-mono text-sm min-h-[88px] resize-none"
                />
                <p className="caption-text">Evaluated against task context at instantiation time</p>
              </div>
            </div>
          )}

          {currentStep === 'role' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Target service role</h2>
                <p className="page-description mt-1">
                  Select which service role is assigned when this rule matches.
                </p>
              </div>

              <div className="space-y-2 max-h-[min(48dvh,400px)] overflow-y-auto pr-1">
                {MOCK_SERVICE_ROLES.map((role) => {
                  const selected = form.targetRole === role.code
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => update({ targetRole: role.code })}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                        selected
                          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border hover:bg-muted/30 hover:border-brand/20',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-sm">{role.display_name}</span>
                          <Badge variant="outline" className="font-mono text-[10px] h-5">
                            {role.code}
                          </Badge>
                          <Badge variant="secondary" className="text-[9px] h-5">
                            {role.actor_class}
                          </Badge>
                        </div>
                        <p className="caption-text mt-1">
                          {role.member_count} members · {role.linked_rules_count} rules
                        </p>
                      </div>
                      {selected && <Check className="h-4 w-4 text-brand shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 'assignment' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Assignment strategy</h2>
                <p className="page-description mt-1">
                  Choose how the assignee is resolved when the rule matches.
                </p>
              </div>

              <div className="space-y-2">
                {ASSIGNEE_MODES.map((mode) => {
                  const selected = form.assigneeMode === mode.id
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => update({ assigneeMode: mode.id })}
                      className={cn(
                        'w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                        selected
                          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border hover:bg-muted/30',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{mode.label}</p>
                        <p className="caption-text mt-1">{mode.description}</p>
                      </div>
                      {selected && <Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />}
                    </button>
                  )
                })}
              </div>

              {form.assigneeMode === 'specific' && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Assignee Name
                  </Label>
                  <Select value={form.assigneeName} onValueChange={(v) => update({ assigneeName: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {FALLBACK_OPTIONS.filter((n) => !n.includes('_')).map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Fallback Chain <span className="normal-case font-normal">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {FALLBACK_OPTIONS.map((name) => {
                    const selected = form.fallbackChain.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleFallback(name)}
                        className={cn(
                          'rounded-lg border px-2.5 py-1.5 text-xs transition-all',
                          selected
                            ? 'border-brand/40 bg-brand/[0.08] text-brand font-medium'
                            : 'border-border hover:bg-muted/40',
                        )}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
                <p className="caption-text">Tried in order if primary assignee is unavailable</p>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Review & create</h2>
                <p className="page-description mt-1">
                  Confirm rule settings. Lower priority numbers are evaluated first.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{form.predicateDisplay}</p>
                    {selectedRole && (
                      <Badge variant="secondary" className="font-mono text-[10px] h-5 mt-1.5">
                        {selectedRole.code}
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="font-mono h-7 tabular-nums shrink-0">
                    P{form.priority}
                  </Badge>
                </div>

                <ReviewRow label="Priority" value={String(form.priority)} mono />
                <ReviewRow label="Target Role" value={form.targetRole} mono />
                <ReviewRow label="Assignee Mode" value={assigneeModeLabel} />
                {form.assigneeName && (
                  <ReviewRow label="Assignee" value={form.assigneeName} />
                )}
                <ReviewRow
                  label="Fallback"
                  value={form.fallbackChain.length > 0 ? form.fallbackChain.join(' → ') : 'None'}
                />
                <ReviewRow label="Active" value={form.isActive ? 'Yes' : 'No'} />
              </div>

              <div className="rounded-lg overflow-hidden ring-1 ring-inset ring-border bg-zinc-950 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                    Predicate
                  </span>
                  <FlaskConical className="h-3 w-3 text-zinc-500" />
                </div>
                <pre className="text-[11px] leading-relaxed text-zinc-100 font-mono p-3 overflow-x-auto">
                  {form.predicate}
                </pre>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-medium">Rule active</p>
                  <p className="caption-text mt-0.5">Inactive rules are skipped during evaluation</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => update({ isActive: v })}
                />
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  First matching rule by priority wins. Drag to reorder rules on the Pairing Rules list
                  after creation.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="ghost" asChild className="w-full sm:w-auto">
            <Link href="/system-admin/pairing">Cancel</Link>
          </Button>
          {currentStep !== 'review' ? (
            <Button
              onClick={handleNext}
              disabled={!canNext()}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 w-full sm:w-auto"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 w-full sm:w-auto"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Create Rule
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
