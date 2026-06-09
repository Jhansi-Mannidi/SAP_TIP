'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  KeyRound,
  Loader2,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  MOCK_SAP_SYSTEMS,
  type AuthorityProfile,
} from '@/lib/config-mock-data'

const STEPS = [
  { id: 'identity', label: 'NTU Identity', icon: KeyRound },
  { id: 'authority', label: 'Authority Profile', icon: Shield },
  { id: 'vault', label: 'Vault & Rotation', icon: Database },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

const AUTHORITY_PROFILES: {
  id: AuthorityProfile
  label: string
  description: string
  icon: React.ElementType
  color: string
  ring: string
}[] = [
  {
    id: 'READ_ONLY',
    label: 'Read Only',
    description: 'Query master data and run read-only RFC calls. Safe for productive systems.',
    icon: Eye,
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    ring: 'ring-emerald-500/25',
  },
  {
    id: 'TEST_EXECUTION',
    label: 'Test Execution',
    description: 'Execute automated test cases with controlled write access in non-prod landscapes.',
    icon: Zap,
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    ring: 'ring-blue-500/25',
  },
  {
    id: 'FULL_AUTH',
    label: 'Full Authority',
    description: 'Broad SAP authorization for basis operations. Requires dual approval on productive systems.',
    icon: ShieldAlert,
    color: 'bg-red-500/10 text-red-700 dark:text-red-400',
    ring: 'ring-red-500/25',
  },
  {
    id: 'DATA_MIGRATION',
    label: 'Data Migration',
    description: 'Load and migrate test data via LTMC and custom migration objects.',
    icon: Database,
    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    ring: 'ring-violet-500/25',
  },
]

const ROTATION_POLICIES = [
  { id: '30', label: '30 days', description: 'Recommended for dev/QAS' },
  { id: '60', label: '60 days', description: 'Standard rotation' },
  { id: '90', label: '90 days', description: 'Productive read-only NTUs' },
] as const

export interface NtuRegisterForm {
  name: string
  systemId: string
  client: string
  authorityProfile: AuthorityProfile | ''
  sapUsername: string
  vaultRef: string
  rotationDays: string
  autoRotate: boolean
}

const INITIAL_FORM: NtuRegisterForm = {
  name: '',
  systemId: '',
  client: '',
  authorityProfile: '',
  sapUsername: '',
  vaultRef: '',
  rotationDays: '60',
  autoRotate: true,
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function suggestNtuName(sid: string, profile?: AuthorityProfile): string {
  const suffix =
    profile === 'READ_ONLY'
      ? 'RO'
      : profile === 'TEST_EXECUTION'
        ? 'EXEC'
        : profile === 'DATA_MIGRATION'
          ? 'MIG'
          : profile === 'FULL_AUTH'
            ? 'FULL'
            : 'NTU'
  return `VOLTUS_${sid}_${suffix}`
}

function suggestVaultRef(name: string): string {
  const slug = slugify(name.replace(/^VOLTUS_/i, ''))
  return `vault://sap/ntu/${slug || 'new-ntu'}`
}

export function NtuRegisterWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<NtuRegisterForm>(INITIAL_FORM)
  const [verifying, setVerifying] = React.useState(false)
  const [verifyPassed, setVerifyPassed] = React.useState<boolean | null>(null)
  const [creating, setCreating] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const update = (patch: Partial<NtuRegisterForm>) => setForm((f) => ({ ...f, ...patch }))

  const selectedSystem = MOCK_SAP_SYSTEMS.find((s) => s.id === form.systemId)
  const availableClients = selectedSystem?.clients ?? []
  const authorityMeta = AUTHORITY_PROFILES.find((p) => p.id === form.authorityProfile)

  React.useEffect(() => {
    if (selectedSystem && form.authorityProfile && !form.name) {
      update({
        name: suggestNtuName(selectedSystem.sid, form.authorityProfile),
        vaultRef: suggestVaultRef(suggestNtuName(selectedSystem.sid, form.authorityProfile)),
      })
    }
  }, [selectedSystem?.id, form.authorityProfile])

  React.useEffect(() => {
    if (form.name && !form.vaultRef) {
      update({ vaultRef: suggestVaultRef(form.name) })
    }
  }, [form.name])

  const canNext = () => {
    switch (currentStep) {
      case 'identity':
        return (
          /^[A-Z][A-Z0-9_]{2,}$/.test(form.name) &&
          !!form.systemId &&
          /^[0-9]{3}$/.test(form.client)
        )
      case 'authority':
        return !!form.authorityProfile
      case 'vault':
        return (
          form.sapUsername.trim().length >= 3 &&
          form.vaultRef.trim().startsWith('vault://') &&
          !!form.rotationDays
        )
      case 'review':
        return verifyPassed === true
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
      router.push('/system-admin/ntus')
    }
  }

  const handleVerify = async () => {
    setVerifying(true)
    setVerifyPassed(null)
    await new Promise((r) => setTimeout(r, 1400))
    setVerifying(false)
    setVerifyPassed(true)
  }

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1200))
    setCreating(false)
    const { toast } = await import('sonner')
    toast.success('NTU created', {
      description: `${form.name} is registered. Credentials are stored in vault only.`,
    })
    router.push('/system-admin/ntus')
  }

  const productiveRestricted =
    selectedSystem?.is_productive &&
    (form.authorityProfile === 'FULL_AUTH' || form.authorityProfile === 'TEST_EXECUTION')

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
          {currentStep === 'identity' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">NTU identity</h2>
                <p className="page-description mt-1">
                  Name the technical user and bind it to a SAP system and client.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ntu-name"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  NTU Name
                </Label>
                <Input
                  id="ntu-name"
                  placeholder="e.g. VOLTUS_S4H_EXEC"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')
                    update({ name, vaultRef: suggestVaultRef(name) })
                  }}
                  className="font-mono"
                />
                <p className="caption-text">Platform identifier — credentials are never shown in the UI</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    SAP System
                  </Label>
                  <Select
                    value={form.systemId}
                    onValueChange={(v) =>
                      update({ systemId: v, client: '', name: '', vaultRef: '', authorityProfile: '' })
                    }
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
                    onValueChange={(v) => update({ client: v })}
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
                    <Badge
                      className={cn(
                        'text-white text-[10px] h-5 font-mono mt-1.5',
                        LANDSCAPE_ROLE_COLORS[selectedSystem.landscape_role],
                      )}
                    >
                      {selectedSystem.landscape_role}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'authority' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Authority profile</h2>
                <p className="page-description mt-1">
                  Select the SAP authorization scope for this technical user.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AUTHORITY_PROFILES.map((profile) => {
                  const Icon = profile.icon
                  const selected = form.authorityProfile === profile.id
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        const name =
                          selectedSystem && form.name
                            ? suggestNtuName(selectedSystem.sid, profile.id)
                            : form.name
                        update({
                          authorityProfile: profile.id,
                          name: selectedSystem ? suggestNtuName(selectedSystem.sid, profile.id) : name,
                          vaultRef: suggestVaultRef(
                            selectedSystem ? suggestNtuName(selectedSystem.sid, profile.id) : form.name,
                          ),
                        })
                      }}
                      className={cn(
                        'flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                        selected
                          ? `border-brand/40 bg-brand/[0.06] ring-1 ${profile.ring}`
                          : 'border-border bg-background hover:bg-muted/30 hover:border-brand/20',
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', profile.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm flex-1">{profile.label}</span>
                        {selected && <Check className="h-4 w-4 text-brand shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{profile.description}</p>
                      <Badge variant="outline" className="mt-2 h-5 font-mono text-[9px]">
                        {profile.id}
                      </Badge>
                    </button>
                  )
                })}
              </div>

              {productiveRestricted && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] px-4 py-3 flex items-start gap-3">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">{authorityMeta?.label}</strong> on a productive
                    system requires Basis Lead approval. Consider READ_ONLY for monitoring access.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'vault' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Vault & rotation</h2>
                <p className="page-description mt-1">
                  Store SAP credentials in the tenant vault. Passwords are never displayed after creation.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sap-username"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  SAP Username
                </Label>
                <Input
                  id="sap-username"
                  placeholder="e.g. VOLTUS_TECH"
                  value={form.sapUsername}
                  onChange={(e) => update({ sapUsername: e.target.value.toUpperCase() })}
                  className="font-mono"
                />
                <p className="caption-text">Must exist in SAP with roles matching the authority profile</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="vault-ref"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Vault Reference
                </Label>
                <Input
                  id="vault-ref"
                  value={form.vaultRef}
                  onChange={(e) => update({ vaultRef: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="caption-text">Auto-generated path — used by RFC destinations and runners</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rotation Policy
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ROTATION_POLICIES.map((policy) => (
                    <button
                      key={policy.id}
                      type="button"
                      onClick={() => update({ rotationDays: policy.id })}
                      className={cn(
                        'rounded-xl border p-3 text-left transition-all',
                        form.rotationDays === policy.id
                          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border hover:bg-muted/30',
                      )}
                    >
                      <p className="text-sm font-semibold">{policy.label}</p>
                      <p className="caption-text mt-0.5">{policy.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3 min-w-0">
                  <BookOpen className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Automatic rotation</p>
                    <p className="caption-text mt-0.5">
                      Rotate credentials on schedule and audit-log every access
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.autoRotate}
                  onCheckedChange={(v) => update({ autoRotate: v })}
                />
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Review & create</h2>
                <p className="page-description mt-1">
                  Confirm NTU settings and verify vault write access before registering.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <KeyRound className="h-5 w-5" />
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
                <ReviewRow label="Authority Profile" value={form.authorityProfile} mono />
                <ReviewRow label="SAP Username" value={form.sapUsername} mono />
                <ReviewRow label="Vault Reference" value={form.vaultRef} mono />
                <ReviewRow
                  label="Rotation"
                  value={
                    form.autoRotate
                      ? `Every ${form.rotationDays} days`
                      : 'Manual rotation only'
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button variant="outline" onClick={handleVerify} disabled={verifying} className="gap-2">
                  {verifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Server className="h-4 w-4" />
                  )}
                  Verify Vault Access
                </Button>
                {verifyPassed === true && (
                  <Badge className="pill pill-success h-7 border-0 gap-1.5 justify-center sm:justify-start">
                    <Check className="h-3.5 w-3.5" />
                    Vault write confirmed
                  </Badge>
                )}
              </div>

              <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.05] px-4 py-3 flex items-start gap-3">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NTU creation is audit-logged. Credentials are stored in vault only — they will never
                  appear in the UI after registration.
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
            <Link href="/system-admin/ntus">Cancel</Link>
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
              Create NTU
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
