'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
  Monitor,
  Server,
  Sparkles,
  Tag,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  MOCK_SAP_SYSTEMS,
  RUNNER_KIND_LABELS,
  type RunnerKind,
} from '@/lib/config-mock-data'
import { RUNNER_KIND_COLORS } from '@/components/system-admin/runner-pool-detail-sheet'

const STEPS = [
  { id: 'identity', label: 'Pool Identity', icon: Layers },
  { id: 'scaling', label: 'Capacity & Scale', icon: Activity },
  { id: 'environment', label: 'Environment', icon: Monitor },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

const KIND_OPTIONS: { id: RunnerKind; description: string }[] = [
  { id: 'sap_gui_windows', description: 'Windows hosts with SAP GUI for classic transaction testing.' },
  { id: 'fiori_browser', description: 'Headless Chrome runners for Fiori and web UI tests.' },
  { id: 'api_runner', description: 'Lightweight API/BAPI runners for high-throughput execution.' },
  { id: 'hybrid', description: 'Mixed workload pool supporting GUI and API runners.' },
]

export interface RunnerPoolRegisterForm {
  name: string
  kind: RunnerKind | ''
  capacity: number
  minScale: number
  maxScale: number
  osImage: string
  tags: string
  restrictedSystems: string[]
}

const INITIAL_FORM: RunnerPoolRegisterForm = {
  name: '',
  kind: '',
  capacity: 20,
  minScale: 5,
  maxScale: 50,
  osImage: '',
  tags: '',
  restrictedSystems: [],
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

export function RunnerPoolRegisterWizard() {
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [form, setForm] = React.useState<RunnerPoolRegisterForm>(INITIAL_FORM)
  const [submitting, setSubmitting] = React.useState(false)

  const update = <K extends keyof RunnerPoolRegisterForm>(key: K, value: RunnerPoolRegisterForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length >= 3 && form.kind !== ''
    if (step === 1) return form.capacity > 0 && form.minScale > 0 && form.maxScale >= form.minScale
    if (step === 2) return true
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    const { toast } = await import('sonner')
    toast.success('Runner pool created', {
      description: `${form.name} is provisioning. Runners will appear in the Active tab shortly.`,
    })
    router.push('/system-admin/runners')
  }

  const defaultOsImage = (kind: RunnerKind) => {
    if (kind === 'sap_gui_windows') return 'Windows Server 2022 + SAP GUI 8.00'
    if (kind === 'fiori_browser') return 'Ubuntu 22.04 + Chrome 120'
    if (kind === 'api_runner') return 'Ubuntu 22.04 + Node.js 20'
    return 'Mixed OS image'
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="border-b bg-muted/30 px-5 sm:px-8 py-5">
          <StepIndicator currentIndex={step} />
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8 min-h-[22rem]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="pool-name">Pool name</Label>
                  <Input
                    id="pool-name"
                    placeholder="e.g. SAP GUI Windows Pool C"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Runner kind</Label>
                  <div className="grid gap-2">
                    {KIND_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          update('kind', opt.id)
                          if (!form.osImage) update('osImage', defaultOsImage(opt.id))
                        }}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-all',
                          form.kind === opt.id
                            ? 'border-brand ring-2 ring-brand/20 bg-brand/[0.04]'
                            : 'border-border hover:border-brand/40 hover:bg-muted/30',
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] border', RUNNER_KIND_COLORS[opt.id])}
                          >
                            {RUNNER_KIND_LABELS[opt.id]}
                          </Badge>
                          {form.kind === opt.id && <Check className="h-4 w-4 text-brand shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="scaling"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="capacity">Base capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => update('capacity', Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Target steady-state runner count for this pool.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-scale">Min auto-scale</Label>
                    <Input
                      id="min-scale"
                      type="number"
                      min={1}
                      value={form.minScale}
                      onChange={(e) => update('minScale', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-scale">Max auto-scale</Label>
                    <Input
                      id="max-scale"
                      type="number"
                      min={form.minScale}
                      value={form.maxScale}
                      onChange={(e) => update('maxScale', Number(e.target.value))}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="environment"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="os-image">OS image</Label>
                  <Input
                    id="os-image"
                    placeholder="Windows Server 2022 + SAP GUI 8.00"
                    value={form.osImage}
                    onChange={(e) => update('osImage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="general, high-capacity (comma-separated)"
                    value={form.tags}
                    onChange={(e) => update('tags', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5" />
                    Restrict to SAP systems (optional)
                  </Label>
                  <div className="rounded-xl border border-border divide-y max-h-48 overflow-y-auto">
                    {MOCK_SAP_SYSTEMS.map((system) => {
                      const checked = form.restrictedSystems.includes(system.id)
                      return (
                        <label
                          key={system.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                              update(
                                'restrictedSystems',
                                v
                                  ? [...form.restrictedSystems, system.id]
                                  : form.restrictedSystems.filter((id) => id !== system.id),
                              )
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-mono font-medium">{system.sid}</p>
                            <p className="text-xs text-muted-foreground truncate">{system.display_name}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Leave empty to allow all registered systems.</p>
                </div>
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
                  <p className="text-sm font-medium">Ready to provision</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    The pool will be created and runners will scale to the minimum count. You can drain or
                    reconfigure the pool at any time.
                  </p>
                </div>
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Kind', value: form.kind ? RUNNER_KIND_LABELS[form.kind as RunnerKind] : '—' },
                  { label: 'Capacity', value: String(form.capacity) },
                  { label: 'Auto-scale', value: `${form.minScale} – ${form.maxScale}` },
                  { label: 'OS image', value: form.osImage || '—' },
                  {
                    label: 'Restricted to',
                    value:
                      form.restrictedSystems.length > 0
                        ? form.restrictedSystems
                            .map((id) => MOCK_SAP_SYSTEMS.find((s) => s.id === id)?.sid ?? id)
                            .join(', ')
                        : 'All systems',
                  },
                  {
                    label: 'Tags',
                    value: form.tags || '—',
                  },
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
            <Link href="/system-admin/runners">Cancel</Link>
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
                    Create Pool
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
