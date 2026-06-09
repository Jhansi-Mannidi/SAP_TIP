'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Loader2,
  Lock,
  Plus,
  ScrollText,
  Shield,
  Sparkles,
  Trash2,
  Workflow,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export type PolicyCategory = 'execution' | 'data' | 'access' | 'healing' | 'promotion'

const POLICY_CATEGORIES: {
  id: PolicyCategory
  label: string
  icon: React.ElementType
  description: string
  color: string
  ring: string
}[] = [
  {
    id: 'execution',
    label: 'Execution',
    icon: Workflow,
    description: 'Control test execution behavior, timeouts, and concurrency limits.',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    ring: 'ring-blue-500/25',
  },
  {
    id: 'data',
    label: 'Data',
    icon: Database,
    description: 'Data handling, retention, masking, and fixture lifecycle rules.',
    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    ring: 'ring-violet-500/25',
  },
  {
    id: 'access',
    label: 'Access Control',
    icon: Lock,
    description: 'Permissions, approvals, and boundary enforcement for sensitive operations.',
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ring: 'ring-amber-500/25',
  },
  {
    id: 'healing',
    label: 'Healing',
    icon: Shield,
    description: 'Auto-healing confidence thresholds and rate limits.',
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    ring: 'ring-emerald-500/25',
  },
  {
    id: 'promotion',
    label: 'Promotion',
    icon: Layers,
    description: 'IR promotion governance and published asset protection.',
    color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
    ring: 'ring-rose-500/25',
  },
]

const CATEGORY_CONFIG_SUGGESTIONS: Record<PolicyCategory, { key: string; value: string; hint: string }[]> = {
  execution: [
    { key: 'limit', value: '10', hint: 'Max concurrent executions' },
    { key: 'scope', value: 'per_system', hint: 'per_system | per_tenant' },
    { key: 'timeout_mins', value: '120', hint: 'Execution timeout in minutes' },
  ],
  data: [
    { key: 'retention_days', value: '90', hint: 'Evidence retention period' },
    { key: 'archive_before_delete', value: 'true', hint: 'true | false' },
    { key: 'mask_char', value: '*', hint: 'PII mask character' },
  ],
  access: [
    { key: 'require_approval', value: 'true', hint: 'true | false' },
    { key: 'min_approvals', value: '1', hint: 'Required approver count' },
    { key: 'enforce', value: 'true', hint: 'Enforce boundary rules' },
  ],
  healing: [
    { key: 'min_confidence', value: '85', hint: 'Minimum confidence (0–100)' },
    { key: 'require_human_review_below', value: '70', hint: 'Review threshold' },
    { key: 'max_heals_per_execution', value: '5', hint: 'Rate limit per run' },
  ],
  promotion: [
    { key: 'min_confidence', value: '95', hint: 'Auto-promote confidence' },
    { key: 'min_occurrences', value: '10', hint: 'Minimum heal occurrences' },
    { key: 'require_lead_approval', value: 'true', hint: 'true | false' },
  ],
}

const STEPS = [
  { id: 'category', label: 'Category & Name', icon: ScrollText },
  { id: 'details', label: 'Description', icon: Shield },
  { id: 'config', label: 'Configuration', icon: Workflow },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

export interface ConfigEntry {
  id: string
  key: string
  value: string
}

export interface PolicyRegisterForm {
  name: string
  category: PolicyCategory | ''
  description: string
  enabled: boolean
  config: ConfigEntry[]
}

const INITIAL_FORM: PolicyRegisterForm = {
  name: '',
  category: '',
  description: '',
  enabled: true,
  config: [],
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

function parseConfigValue(value: string): string | number | boolean | string[] {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return JSON.parse(trimmed) as string[]
    } catch {
      return trimmed
    }
  }
  return trimmed
}

function applyCategorySuggestions(category: PolicyCategory): ConfigEntry[] {
  return CATEGORY_CONFIG_SUGGESTIONS[category].map((s, i) => ({
    id: `cfg_${i}`,
    key: s.key,
    value: s.value,
  }))
}

export function PolicyRegisterWizard() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [form, setForm] = React.useState<PolicyRegisterForm>(INITIAL_FORM)
  const [submitting, setSubmitting] = React.useState(false)

  const update = <K extends keyof PolicyRegisterForm>(key: K, value: PolicyRegisterForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const selectCategory = (category: PolicyCategory) => {
    setForm((prev) => ({
      ...prev,
      category,
      config: prev.config.length === 0 ? applyCategorySuggestions(category) : prev.config,
    }))
  }

  const addConfigRow = () => {
    update('config', [...form.config, { id: `cfg_${Date.now()}`, key: '', value: '' }])
  }

  const updateConfigRow = (id: string, field: 'key' | 'value', val: string) => {
    update(
      'config',
      form.config.map((row) => (row.id === id ? { ...row, [field]: val } : row)),
    )
  }

  const removeConfigRow = (id: string) => {
    update(
      'config',
      form.config.filter((row) => row.id !== id),
    )
  }

  const resetConfigToSuggestions = () => {
    if (form.category) {
      update('config', applyCategorySuggestions(form.category))
    }
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length >= 3 && form.category !== ''
    if (step === 1) return form.description.trim().length >= 10
    if (step === 2) {
      return (
        form.config.length > 0 &&
        form.config.every((row) => row.key.trim().length > 0 && row.value.trim().length > 0)
      )
    }
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    const { toast } = await import('sonner')
    toast.success('Policy created', {
      description: `"${form.name}" is now active${form.enabled ? '' : ' (disabled)'}.`,
    })
    router.push('/system-admin/policies')
  }

  const categoryMeta = POLICY_CATEGORIES.find((c) => c.id === form.category)
  const configPreview = Object.fromEntries(
    form.config.filter((r) => r.key.trim()).map((r) => [r.key, parseConfigValue(r.value)]),
  )

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="border-b bg-muted/30 px-5 sm:px-8 py-5">
          <StepIndicator currentIndex={step} />
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 min-h-[24rem]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="policy-name">Policy name</Label>
                  <Input
                    id="policy-name"
                    placeholder="e.g. Auto-Heal Confidence Threshold"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="grid gap-2">
                    {POLICY_CATEGORIES.map((cat) => {
                      const Icon = cat.icon
                      const selected = form.category === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => selectCategory(cat.id)}
                          className={cn(
                            'rounded-xl border p-4 text-left transition-all',
                            selected
                              ? 'border-brand ring-2 ring-brand/20 bg-brand/[0.04]'
                              : 'border-border hover:border-brand/40 hover:bg-muted/30',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset',
                                  cat.color,
                                  cat.ring,
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <Badge variant="outline" className={cn('text-[10px] border', cat.color)}>
                                {cat.label}
                              </Badge>
                            </div>
                            {selected && <Check className="h-4 w-4 text-brand shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="policy-description">Description</Label>
                  <Textarea
                    id="policy-description"
                    placeholder="Describe what this policy governs and when it applies..."
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 10 characters. Shown on the policy card in the list view.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium">Enable on create</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Policy takes effect immediately after creation
                    </p>
                  </div>
                  <Switch checked={form.enabled} onCheckedChange={(v) => update('enabled', v)} />
                </div>

                {categoryMeta && (
                  <div className="rounded-xl border border-brand/25 bg-brand/[0.04] p-4 flex items-start gap-3">
                    <categoryMeta.icon className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{categoryMeta.label} policy</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {categoryMeta.description}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <Label>Configuration parameters</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Key-value pairs displayed on the policy card. Use{' '}
                      <code className="font-mono text-[10px]">true</code> /{' '}
                      <code className="font-mono text-[10px]">false</code> for booleans.
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={resetConfigToSuggestions}>
                    Reset defaults
                  </Button>
                </div>

                <div className="space-y-2">
                  {form.config.map((row, index) => {
                    const hint = form.category
                      ? CATEGORY_CONFIG_SUGGESTIONS[form.category].find((s) => s.key === row.key)?.hint
                      : undefined
                    return (
                      <div
                        key={row.id}
                        className="rounded-xl border border-border bg-muted/10 p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-6">
                            {index + 1}
                          </span>
                          <Input
                            placeholder="key"
                            value={row.key}
                            onChange={(e) => updateConfigRow(row.id, 'key', e.target.value)}
                            className="font-mono text-sm h-8"
                          />
                          <Input
                            placeholder="value"
                            value={row.value}
                            onChange={(e) => updateConfigRow(row.id, 'value', e.target.value)}
                            className="font-mono text-sm h-8"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeConfigRow(row.id)}
                            disabled={form.config.length <= 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {hint && (
                          <p className="text-[11px] text-muted-foreground pl-8">{hint}</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addConfigRow}>
                  <Plus className="h-3.5 w-3.5" />
                  Add parameter
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-brand/25 bg-brand/[0.04] p-4">
                  <p className="text-sm font-medium">Ready to publish</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    The policy will be recorded in the configuration audit trail. Changes can be
                    toggled or reconfigured from the Policies list.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-xs)] space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-base">{form.name}</h4>
                    {form.enabled ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]"
                      >
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Disabled
                      </Badge>
                    )}
                    {categoryMeta && (
                      <Badge variant="outline" className={cn('text-[10px] border', categoryMeta.color)}>
                        {categoryMeta.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{form.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(configPreview).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs font-mono">
                        {key}:{' '}
                        {typeof value === 'boolean'
                          ? value
                            ? 'true'
                            : 'false'
                          : Array.isArray(value)
                            ? `[${value.length}]`
                            : String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {[
                  { label: 'Category', value: categoryMeta?.label ?? '—' },
                  { label: 'Status', value: form.enabled ? 'Enabled' : 'Disabled' },
                  { label: 'Parameters', value: String(form.config.length) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-4 py-2 border-b border-border/60 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground shrink-0">{row.label}</span>
                    <span className="text-sm font-medium text-right">{row.value}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t bg-muted/20 px-5 sm:px-8 py-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/system-admin/policies">Cancel</Link>
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            {step > 0 && (
              <Button variant="outline" className="flex-1 sm:flex-none gap-1" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                className="flex-1 sm:flex-none gap-1"
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="flex-1 sm:flex-none gap-2" disabled={submitting} onClick={handleSubmit}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create Policy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
