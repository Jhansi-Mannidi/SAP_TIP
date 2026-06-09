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
  Database,
  KeyRound,
  Loader2,
  Plug,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  LANDSCAPE_ROLE_COLORS,
  MOCK_NTUS,
  MOCK_SAP_SYSTEMS,
  type AuthorityProfile,
  type NTU,
} from '@/lib/config-mock-data'

const STEPS = [
  { id: 'target', label: 'Target System', icon: Server },
  { id: 'credentials', label: 'NTU Credentials', icon: KeyRound },
  { id: 'pool', label: 'Connection Pool', icon: Database },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

const POOL_PRESETS = [5, 10, 15, 20, 25] as const

const AUTHORITY_LABELS: Record<AuthorityProfile, string> = {
  READ_ONLY: 'Read Only',
  TEST_EXECUTION: 'Test Execution',
  FULL_AUTH: 'Full Authority',
  DATA_MIGRATION: 'Data Migration',
}

export interface RfcDestinationRegisterForm {
  name: string
  systemId: string
  client: string
  ntuId: string
  customNtuRef: string
  poolSize: number
}

const INITIAL_FORM: RfcDestinationRegisterForm = {
  name: '',
  systemId: '',
  client: '',
  ntuId: '',
  customNtuRef: '',
  poolSize: 10,
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

function NtuCard({
  ntu,
  selected,
  onSelect,
}: {
  ntu: NTU
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all',
        selected
          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
          : 'border-border bg-background hover:bg-muted/30 hover:border-brand/20',
      )}
    >
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          selected ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
        )}
      >
        <Users className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium">{ntu.name}</span>
          <Badge variant="secondary" className="h-5 text-[9px]">
            {AUTHORITY_LABELS[ntu.authority_profile]}
          </Badge>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground mt-1 truncate">{ntu.vault_ref}</p>
      </div>
      {selected && <Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />}
    </button>
  )
}

function suggestDestinationName(sid: string, profile?: AuthorityProfile): string {
  const suffix =
    profile === 'READ_ONLY'
      ? 'READ'
      : profile === 'TEST_EXECUTION'
        ? 'EXEC'
        : profile === 'DATA_MIGRATION'
          ? 'MIG'
          : 'RFC'
  return `VOLTUS_${sid}_${suffix}`
}

export function RfcDestinationRegisterWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<RfcDestinationRegisterForm>(INITIAL_FORM)
  const [testing, setTesting] = React.useState(false)
  const [testPassed, setTestPassed] = React.useState<boolean | null>(null)
  const [creating, setCreating] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const update = (patch: Partial<RfcDestinationRegisterForm>) =>
    setForm((f) => ({ ...f, ...patch }))

  const selectedSystem = MOCK_SAP_SYSTEMS.find((s) => s.id === form.systemId)
  const availableClients = selectedSystem?.clients ?? []
  const availableNtus = MOCK_NTUS.filter(
    (n) =>
      n.system_id === form.systemId &&
      (!form.client || n.client === form.client) &&
      n.status === 'active',
  )
  const selectedNtu = MOCK_NTUS.find((n) => n.id === form.ntuId)
  const ntuRef = selectedNtu?.vault_ref || form.customNtuRef

  React.useEffect(() => {
    if (selectedSystem && !form.name) {
      update({ name: suggestDestinationName(selectedSystem.sid) })
    }
  }, [selectedSystem?.id])

  React.useEffect(() => {
    if (selectedSystem && form.client && selectedNtu) {
      update({ name: suggestDestinationName(selectedSystem.sid, selectedNtu.authority_profile) })
    }
  }, [selectedNtu?.id, form.client])

  const canNext = () => {
    switch (currentStep) {
      case 'target':
        return (
          /^[A-Z][A-Z0-9_]{2,}$/.test(form.name) &&
          !!form.systemId &&
          /^[0-9]{3}$/.test(form.client)
        )
      case 'credentials':
        return !!form.ntuId || form.customNtuRef.trim().startsWith('vault://')
      case 'pool':
        return form.poolSize >= 1 && form.poolSize <= 50
      case 'review':
        return testPassed === true
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
      router.push('/system-admin/rfc')
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestPassed(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTesting(false)
    setTestPassed(true)
  }

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1200))
    setCreating(false)
    const { toast } = await import('sonner')
    toast.success('RFC destination created', {
      description: `${form.name} is ready for iHub connectivity.`,
    })
    router.push('/system-admin/rfc')
  }

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
          {currentStep === 'target' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Target system</h2>
                <p className="page-description mt-1">
                  Name the RFC destination and bind it to a registered SAP system and client.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="rfc-name"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Destination Name
                </Label>
                <Input
                  id="rfc-name"
                  placeholder="e.g. VOLTUS_S4H_DEV"
                  value={form.name}
                  onChange={(e) =>
                    update({ name: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })
                  }
                  className="font-mono"
                />
                <p className="caption-text">Uppercase identifier used in iHub and runner bindings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    SAP System
                  </Label>
                  <Select
                    value={form.systemId}
                    onValueChange={(v) => update({ systemId: v, client: '', ntuId: '', name: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_SAP_SYSTEMS.map((system) => (
                        <SelectItem key={system.id} value={system.id}>
                          <span className="font-mono font-semibold">{system.sid}</span>
                          <span className="text-muted-foreground ml-2 hidden sm:inline">
                            — {system.display_name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Client
                  </Label>
                  <Select
                    value={form.client}
                    onValueChange={(v) => update({ client: v, ntuId: '' })}
                    disabled={!form.systemId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={form.systemId ? 'Select client' : 'Select system first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClients.map((client) => (
                        <SelectItem key={client.id} value={client.client_number}>
                          <span className="font-mono">{client.client_number}</span>
                          <span className="text-muted-foreground ml-2">— {client.description}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedSystem && (
                <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white',
                      selectedSystem.is_productive ? 'bg-red-500' : 'bg-indigo-500',
                    )}
                  >
                    {selectedSystem.sid}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{selectedSystem.display_name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge
                        className={cn(
                          'text-white text-[10px] h-5 font-mono',
                          LANDSCAPE_ROLE_COLORS[selectedSystem.landscape_role],
                        )}
                      >
                        {selectedSystem.landscape_role}
                      </Badge>
                      <Badge variant="outline" className="h-5 text-[10px] font-mono">
                        {selectedSystem.host}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {selectedSystem?.is_productive && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] px-4 py-3 flex items-start gap-3">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This system is <strong className="text-foreground">productive</strong>. RFC
                    destinations on productive systems should use read-only NTUs unless explicitly
                    approved.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'credentials' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">NTU credentials</h2>
                <p className="page-description mt-1">
                  Select a Named Technical User vault reference for RFC authentication.
                </p>
              </div>

              {availableNtus.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Available NTUs
                  </Label>
                  <div className="space-y-2">
                    {availableNtus.map((ntu) => (
                      <NtuCard
                        key={ntu.id}
                        ntu={ntu}
                        selected={form.ntuId === ntu.id}
                        onSelect={() => update({ ntuId: ntu.id, customNtuRef: '' })}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-8 text-center">
                  <KeyRound className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No active NTUs for this system/client. Enter a vault path manually below.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="custom-ntu"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Or custom vault reference
                </Label>
                <Input
                  id="custom-ntu"
                  placeholder="vault://ntu/my-destination"
                  value={form.customNtuRef}
                  onChange={(e) => update({ customNtuRef: e.target.value, ntuId: '' })}
                  className="font-mono text-sm"
                  disabled={!!form.ntuId}
                />
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Shield className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Credentials are resolved at runtime from your tenant vault. NTU rotation does not
                  require re-creating the RFC destination.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'pool' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Connection pool</h2>
                <p className="page-description mt-1">
                  Configure the RFC connection pool size for concurrent iHub and runner sessions.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pool Size
                </Label>
                <div className="flex flex-wrap gap-2">
                  {POOL_PRESETS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => update({ poolSize: size })}
                      className={cn(
                        'rounded-lg border px-4 py-2 font-mono text-sm transition-all',
                        form.poolSize === size
                          ? 'border-brand/40 bg-brand/[0.08] text-brand font-semibold ring-1 ring-brand/20'
                          : 'border-border bg-background hover:bg-muted/30',
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 max-w-xs">
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={form.poolSize}
                    onChange={(e) => update({ poolSize: Number(e.target.value) || 1 })}
                    className="font-mono w-24"
                  />
                  <span className="text-sm text-muted-foreground">concurrent connections (1–50)</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated capacity</span>
                  <span className="font-medium tabular-nums">
                    {form.poolSize} parallel RFC calls
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((form.poolSize / 25) * 100, 100)}%` }}
                  />
                </div>
                <p className="caption-text">
                  Higher pool sizes improve throughput for batch reads but increase SAP dialog
                  workload. Start with 5–10 for dev/QAS.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Review & create</h2>
                <p className="page-description mt-1">
                  Confirm destination settings and verify connectivity before registering.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Plug className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-semibold truncate">{form.name}</p>
                    {selectedSystem && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedSystem.sid} / {form.client}
                      </p>
                    )}
                  </div>
                </div>

                <ReviewRow
                  label="SAP System"
                  value={selectedSystem ? `${selectedSystem.sid} — ${selectedSystem.display_name}` : '—'}
                />
                <ReviewRow label="Client" value={form.client} mono />
                <ReviewRow label="NTU Credential Ref" value={ntuRef} mono />
                {selectedNtu && (
                  <ReviewRow
                    label="Authority Profile"
                    value={AUTHORITY_LABELS[selectedNtu.authority_profile]}
                  />
                )}
                <ReviewRow label="Pool Size" value={String(form.poolSize)} mono />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button variant="outline" onClick={handleTest} disabled={testing} className="gap-2">
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  Test Connection
                </Button>
                {testPassed === true && (
                  <Badge className="pill pill-success h-7 border-0 gap-1.5 justify-center sm:justify-start">
                    <Check className="h-3.5 w-3.5" />
                    RFC handshake verified
                  </Badge>
                )}
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The destination will appear in the RFC Destinations list. Runner pools and test
                  packs can bind to it immediately after creation.
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
            <Link href="/system-admin/rfc">Cancel</Link>
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
              disabled={!canNext() || creating}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 w-full sm:w-auto"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Create Destination
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
