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
  Cloud,
  Globe,
  Loader2,
  Network,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
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
  SYSTEM_KIND_LABELS,
  type LandscapeRole,
  type SystemKind,
} from '@/lib/config-mock-data'

const STEPS = [
  { id: 'identity', label: 'System Identity', icon: Server },
  { id: 'connectivity', label: 'Connectivity', icon: Network },
  { id: 'client', label: 'Client & Access', icon: Shield },
  { id: 'review', label: 'Review & Register', icon: Sparkles },
] as const

type StepId = (typeof STEPS)[number]['id']

const SYSTEM_KINDS: SystemKind[] = [
  'ECC',
  'S4HANA_ONPREM',
  'S4HANA_CLOUD',
  'S4HANA_PRIVATE',
  'BTP',
]

const LANDSCAPE_ROLES: LandscapeRole[] = ['DEV', 'QAS', 'PRE', 'PROD', 'SBX', 'TRN']

const REGIONS = [
  { id: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { id: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { id: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { id: 'eu-west-1', label: 'Europe (Ireland)' },
  { id: 'us-east-1', label: 'US East (N. Virginia)' },
  { id: 'us-west-2', label: 'US West (Oregon)' },
] as const

export interface SapSystemRegisterForm {
  sid: string
  displayName: string
  kind: SystemKind | ''
  landscapeRole: LandscapeRole | ''
  host: string
  port: string
  messageServer: string
  region: string
  defaultClient: string
  clientDescription: string
  isProductive: boolean
  ihubConnector: string
}

const INITIAL_FORM: SapSystemRegisterForm = {
  sid: '',
  displayName: '',
  kind: '',
  landscapeRole: '',
  host: '',
  port: '3300',
  messageServer: '',
  region: 'ap-south-1',
  defaultClient: '100',
  clientDescription: '',
  isProductive: false,
  ihubConnector: '',
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

function isCloudKind(kind: SystemKind | ''): boolean {
  return kind === 'S4HANA_CLOUD' || kind === 'S4HANA_PRIVATE' || kind === 'BTP'
}

export function SapSystemRegisterWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<SapSystemRegisterForm>(INITIAL_FORM)
  const [testing, setTesting] = React.useState(false)
  const [testPassed, setTestPassed] = React.useState<boolean | null>(null)
  const [registering, setRegistering] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const update = (patch: Partial<SapSystemRegisterForm>) => setForm((f) => ({ ...f, ...patch }))

  React.useEffect(() => {
    if (form.landscapeRole === 'PROD') {
      update({ isProductive: true })
    }
  }, [form.landscapeRole])

  React.useEffect(() => {
    if (form.kind && isCloudKind(form.kind)) {
      update({ port: '443' })
    } else if (form.kind) {
      update({ port: '3300' })
    }
  }, [form.kind])

  const canNext = () => {
    switch (currentStep) {
      case 'identity':
        return (
          /^[A-Z0-9]{3}$/.test(form.sid) &&
          form.displayName.trim().length >= 3 &&
          !!form.kind &&
          !!form.landscapeRole
        )
      case 'connectivity':
        return (
          form.host.trim().length >= 3 &&
          !!form.port &&
          Number(form.port) > 0 &&
          !!form.region
        )
      case 'client':
        return (
          /^[0-9]{3}$/.test(form.defaultClient) &&
          form.clientDescription.trim().length >= 2
        )
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
      router.push('/system-admin')
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestPassed(null)
    await new Promise((r) => setTimeout(r, 1400))
    setTesting(false)
    setTestPassed(true)
  }

  const handleRegister = async () => {
    setRegistering(true)
    await new Promise((r) => setTimeout(r, 1200))
    setRegistering(false)
    const { toast } = await import('sonner')
    toast.success('SAP system registered', {
      description: `${form.sid} — ${form.displayName} is now available in your landscape.`,
    })
    router.push('/system-admin')
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
          {currentStep === 'identity' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">System identity</h2>
                <p className="page-description mt-1">
                  Define the SID, display name, and landscape classification for this SAP system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sid" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    System ID (SID)
                  </Label>
                  <Input
                    id="sid"
                    placeholder="e.g. S4H"
                    value={form.sid}
                    maxLength={3}
                    onChange={(e) => update({ sid: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                    className="font-mono uppercase"
                  />
                  <p className="caption-text">3-character alphanumeric SAP system ID</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="displayName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    placeholder="e.g. S/4HANA Quality Assurance"
                    value={form.displayName}
                    onChange={(e) => update({ displayName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System Kind
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SYSTEM_KINDS.map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => update({ kind })}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                        form.kind === kind
                          ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border bg-background hover:bg-muted/30 hover:border-brand/20',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          form.kind === kind
                            ? 'bg-brand/15 text-brand'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {isCloudKind(kind) ? <Cloud className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                      </div>
                      <span className="text-sm font-medium">{SYSTEM_KIND_LABELS[kind]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Landscape Role
                </Label>
                <div className="flex flex-wrap gap-2">
                  {LANDSCAPE_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => update({ landscapeRole: role })}
                      className={cn(
                        'rounded-lg px-3 py-2 text-xs font-mono font-semibold text-white transition-all',
                        LANDSCAPE_ROLE_COLORS[role],
                        form.landscapeRole === role
                          ? 'ring-2 ring-offset-2 ring-offset-background ring-brand scale-105'
                          : 'opacity-70 hover:opacity-100',
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {form.landscapeRole === 'PROD' && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/[0.05] px-4 py-3 flex items-start gap-3">
                  <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Production systems are marked as <strong className="text-foreground">productive</strong> automatically.
                    Destructive operations will require dual approval.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'connectivity' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Connectivity</h2>
                <p className="page-description mt-1">
                  Host endpoints used by iHub connectors and runner pools to reach this system.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="host" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Application Host
                </Label>
                <Input
                  id="host"
                  placeholder={
                    isCloudKind(form.kind)
                      ? 'e.g. my-tenant.eu10.hana.ondemand.com'
                      : 'e.g. s4h-qas.starcement.internal'
                  }
                  value={form.host}
                  onChange={(e) => update({ host: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Port
                  </Label>
                  <Input
                    id="port"
                    type="number"
                    min={1}
                    max={65535}
                    value={form.port}
                    onChange={(e) => update({ port: e.target.value })}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Region
                  </Label>
                  <Select value={form.region} onValueChange={(v) => update({ region: v })}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!isCloudKind(form.kind) && form.kind && (
                <div className="space-y-2">
                  <Label htmlFor="messageServer" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message Server <span className="normal-case font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="messageServer"
                    placeholder="e.g. s4h-ms.starcement.internal"
                    value={form.messageServer}
                    onChange={(e) => update({ messageServer: e.target.value })}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 flex items-start gap-3">
                <Globe className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Runners resolve this host through your tenant&apos;s private network or SAP Cloud Connector.
                  RFC destinations can be added after registration.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'client' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Client & access</h2>
                <p className="page-description mt-1">
                  Configure the default SAP client and productive-system guardrails.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultClient" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Default Client
                  </Label>
                  <Input
                    id="defaultClient"
                    placeholder="100"
                    maxLength={3}
                    value={form.defaultClient}
                    onChange={(e) =>
                      update({ defaultClient: e.target.value.replace(/\D/g, '').slice(0, 3) })
                    }
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clientDescription" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Client Description
                  </Label>
                  <Input
                    id="clientDescription"
                    placeholder="e.g. QA Testing Client"
                    value={form.clientDescription}
                    onChange={(e) => update({ clientDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ihubConnector" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  iHub Connector <span className="normal-case font-normal">(optional)</span>
                </Label>
                <Input
                  id="ihubConnector"
                  placeholder="e.g. ihub_qas_01"
                  value={form.ihubConnector}
                  onChange={(e) => update({ ihubConnector: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div
                className={cn(
                  'flex items-center justify-between gap-4 rounded-xl border p-4',
                  form.isProductive
                    ? 'border-red-500/30 bg-red-500/[0.04]'
                    : 'border-border bg-muted/20',
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <Shield
                    className={cn(
                      'h-5 w-5 shrink-0 mt-0.5',
                      form.isProductive ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">Productive system</p>
                    <p className="caption-text mt-0.5">
                      Restricts destructive operations and requires elevated approval for write actions.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.isProductive}
                  onCheckedChange={(v) => update({ isProductive: v })}
                  disabled={form.landscapeRole === 'PROD'}
                />
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Review & register</h2>
                <p className="page-description mt-1">
                  Confirm system details and run a connectivity check before registering.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-lg flex items-center justify-center text-white font-mono font-bold text-lg shrink-0',
                      form.isProductive ? 'bg-red-500' : 'bg-indigo-500',
                    )}
                  >
                    {form.sid.slice(0, 3) || '???'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{form.displayName || '—'}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {form.kind && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          {SYSTEM_KIND_LABELS[form.kind]}
                        </Badge>
                      )}
                      {form.landscapeRole && (
                        <Badge
                          className={cn(
                            'text-white text-[10px] h-5 font-mono',
                            LANDSCAPE_ROLE_COLORS[form.landscapeRole],
                          )}
                        >
                          {form.landscapeRole}
                        </Badge>
                      )}
                      {form.isProductive && (
                        <Badge variant="outline" className="text-[10px] h-5 border-red-500/40 text-red-600 dark:text-red-400">
                          Productive
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <ReviewRow label="Host" value={`${form.host}:${form.port}`} mono />
                {form.messageServer && (
                  <ReviewRow label="Message Server" value={form.messageServer} mono />
                )}
                <ReviewRow label="Region" value={form.region} />
                <ReviewRow label="Default Client" value={form.defaultClient} mono />
                <ReviewRow label="Client Description" value={form.clientDescription} />
                {form.ihubConnector && (
                  <ReviewRow label="iHub Connector" value={form.ihubConnector} mono />
                )}
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
                    Connectivity verified
                  </Badge>
                )}
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After registration, bind RFC destinations, runner pools, and NTUs to this system
                  from the System Admin console.
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
            <Link href="/system-admin">Cancel</Link>
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
              onClick={handleRegister}
              disabled={!canNext() || registering}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 w-full sm:w-auto"
            >
              {registering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Register System
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
