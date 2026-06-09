'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Cloud,
  Server,
  ArrowDownLeft,
  ArrowUpRight,
  Globe,
  KeyRound,
  Lock,
  Sparkles,
  Loader2,
  Link2,
  Shield,
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
import { MOCK_SAP_SYSTEMS } from '@/lib/config-mock-data'

const STEPS = [
  { id: 'tenant', label: 'Tenant Details', icon: Cloud },
  { id: 'phases', label: 'Integration', icon: Link2 },
  { id: 'credentials', label: 'Credentials', icon: Lock },
  { id: 'review', label: 'Review & Register', icon: Sparkles },
] as const

type StepId = (typeof STEPS)[number]['id']

const CALM_REGIONS = [
  { id: 'eu10', label: 'Europe (eu10)', suffix: 'eu10.alm.cloud.sap' },
  { id: 'us10', label: 'US East (us10)', suffix: 'us10.alm.cloud.sap' },
  { id: 'ap10', label: 'Asia Pacific (ap10)', suffix: 'ap10.alm.cloud.sap' },
] as const

const OUTBOUND_SCOPES = [
  { id: 'calm-tasks.write', label: 'calm-tasks.write', description: 'Create and patch tasks/defects' },
  {
    id: 'calm-processmanagement.read',
    label: 'calm-processmanagement.read',
    description: 'Read scopes and process context',
  },
  { id: 'calm-defects.write', label: 'calm-defects.write', description: 'Raise and update defects' },
  { id: 'calm-projects.read', label: 'calm-projects.read', description: 'Resolve project context' },
] as const

export interface CalmRegisterForm {
  displayName: string
  tenantSlug: string
  region: string
  sapSystemId: string
  phase1Inbound: boolean
  phase2Outbound: boolean
  inboundProviderUrl: string
  inboundAuthSecretRef: string
  oauthTokenUrl: string
  oauthClientId: string
  oauthClientSecret: string
  scopes: string[]
}

const INITIAL_FORM: CalmRegisterForm = {
  displayName: '',
  tenantSlug: '',
  region: 'eu10',
  sapSystemId: '',
  phase1Inbound: true,
  phase2Outbound: true,
  inboundProviderUrl: '',
  inboundAuthSecretRef: '',
  oauthTokenUrl: '',
  oauthClientId: '',
  oauthClientSecret: '',
  scopes: ['calm-tasks.write', 'calm-processmanagement.read', 'calm-defects.write'],
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

function PhaseCard({
  title,
  direction,
  description,
  icon: Icon,
  enabled,
  onToggle,
  tone,
}: {
  title: string
  direction: string
  description: string
  icon: React.ElementType
  enabled: boolean
  onToggle: (v: boolean) => void
  tone: 'inbound' | 'outbound'
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(!enabled)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(!enabled)
        }
      }}
      className={cn(
        'flex w-full flex-col rounded-xl border p-4 text-left transition-colors cursor-pointer',
        enabled
          ? tone === 'inbound'
            ? 'border-blue-500/40 bg-blue-500/[0.06] ring-1 ring-blue-500/20'
            : 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
          : 'border-border bg-card hover:bg-muted/20',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-inset',
              tone === 'inbound'
                ? 'bg-blue-500/10 ring-blue-500/20 text-blue-600 dark:text-blue-400'
                : 'bg-brand/10 ring-brand/20 text-brand',
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="caption-text font-mono mt-0.5">{direction}</p>
          </div>
        </div>
        <Checkbox
          checked={enabled}
          onCheckedChange={(v) => onToggle(v === true)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">{description}</p>
    </div>
  )
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn('font-medium text-right break-all', mono && 'font-mono text-xs')}>
        {value || '—'}
      </span>
    </div>
  )
}

function buildTenantUrl(slug: string, region: string) {
  const regionMeta = CALM_REGIONS.find((r) => r.id === region)
  if (!slug.trim() || !regionMeta) return ''
  return `${slug.trim()}.${regionMeta.suffix}`
}

export function CalmRegisterTenantWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<CalmRegisterForm>(INITIAL_FORM)
  const [testing, setTesting] = React.useState(false)
  const [testPassed, setTestPassed] = React.useState<boolean | null>(null)
  const [registering, setRegistering] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const tenantUrl = buildTenantUrl(form.tenantSlug, form.region)
  const apiBase = tenantUrl ? `https://${tenantUrl}/api` : ''
  const selectedSystem = MOCK_SAP_SYSTEMS.find((s) => s.id === form.sapSystemId)

  const update = (patch: Partial<CalmRegisterForm>) => setForm((f) => ({ ...f, ...patch }))

  const toggleScope = (scopeId: string, checked: boolean) => {
    update({
      scopes: checked
        ? [...new Set([...form.scopes, scopeId])]
        : form.scopes.filter((s) => s !== scopeId),
    })
  }

  const canNext = () => {
    switch (currentStep) {
      case 'tenant':
        return (
          form.displayName.trim().length >= 3 &&
          form.tenantSlug.trim().length >= 2 &&
          !!form.sapSystemId
        )
      case 'phases':
        return form.phase1Inbound || form.phase2Outbound
      case 'credentials': {
        const inboundOk =
          !form.phase1Inbound ||
          (form.inboundProviderUrl.trim() && form.inboundAuthSecretRef.trim())
        const outboundOk =
          !form.phase2Outbound ||
          (form.oauthClientId.trim() &&
            form.oauthClientSecret.trim() &&
            form.scopes.length > 0)
        return inboundOk && outboundOk
      }
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
      router.push('/system-admin/calm')
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestPassed(null)
    await new Promise((r) => setTimeout(r, 1600))
    setTesting(false)
    setTestPassed(true)
  }

  const handleRegister = async () => {
    setRegistering(true)
    await new Promise((r) => setTimeout(r, 1200))
    setRegistering(false)
    router.push('/system-admin/calm/tenants')
  }

  React.useEffect(() => {
    if (form.region && !form.oauthTokenUrl) {
      const regionMeta = CALM_REGIONS.find((r) => r.id === form.region)
      if (regionMeta && form.tenantSlug) {
        update({
          oauthTokenUrl: `https://${form.tenantSlug}.${regionMeta.suffix}/oauth/token`,
        })
      }
    }
  }, [form.region, form.tenantSlug])

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28 }}
          className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6"
        >
          {currentStep === 'tenant' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">CALM Tenant Details</h2>
                <p className="section-description mt-1">
                  Register the customer&apos;s SAP Cloud ALM tenant and link it to a SATIP SAP system.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={form.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  placeholder="e.g. Acme S/4 CALM"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantSlug">Tenant Subdomain</Label>
                  <Input
                    id="tenantSlug"
                    value={form.tenantSlug}
                    onChange={(e) =>
                      update({
                        tenantSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                    placeholder="acme-s4"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CALM Region</Label>
                  <Select value={form.region} onValueChange={(v) => update({ region: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CALM_REGIONS.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {tenantUrl && (
                <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 space-y-1">
                  <p className="micro-label">Resolved tenant URL</p>
                  <p className="font-mono text-xs break-all">{tenantUrl}</p>
                  <p className="font-mono text-[10px] text-muted-foreground break-all">{apiBase}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                  Linked SAP System
                </Label>
                <Select value={form.sapSystemId} onValueChange={(v) => update({ sapSystemId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SAP system..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_SAP_SYSTEMS.map((sys) => (
                      <SelectItem key={sys.id} value={sys.id}>
                        {sys.sid} — {sys.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 'phases' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Integration Phases</h2>
                <p className="section-description mt-1">
                  Phase 1 is required for certified test automation. Phase 2 adds outbound defect
                  enrichment for SATIP-initiated runs.
                </p>
              </div>

              <div className="space-y-3">
                <PhaseCard
                  title="Phase 1 — Inbound"
                  direction="CALM → SATIP"
                  icon={ArrowDownLeft}
                  tone="inbound"
                  enabled={form.phase1Inbound}
                  onToggle={(v) => update({ phase1Inbound: v })}
                  description="CALM calls the Test Automation API. Results write back via executionhistory pull — the authoritative pass/fail channel."
                />
                <PhaseCard
                  title="Phase 2 — Outbound"
                  direction="SATIP → CALM"
                  icon={ArrowUpRight}
                  tone="outbound"
                  enabled={form.phase2Outbound}
                  onToggle={(v) => update({ phase2Outbound: v })}
                  description="SATIP enriches CALM via tenant APIs — raise defects on failed bound runs, patch status, and improve prompt visibility."
                />
              </div>

              {form.phase2Outbound && !form.phase1Inbound && (
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  Phase 2 requires Phase 1 — it operates only on BOUND test cases established by the
                  inbound integration.
                </div>
              )}
            </div>
          )}

          {currentStep === 'credentials' && (
            <div className="space-y-6">
              <div>
                <h2 className="section-title">Connection Credentials</h2>
                <p className="section-description mt-1">
                  Secrets are stored by reference in the secret manager — never in plaintext in
                  tip_calm_tenant.
                </p>
              </div>

              {form.phase1Inbound && (
                <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold">Phase 1 — Inbound Provider</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inboundProviderUrl" className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      Provider Endpoint (registered in CALM LMS)
                    </Label>
                    <Input
                      id="inboundProviderUrl"
                      value={form.inboundProviderUrl}
                      onChange={(e) => update({ inboundProviderUrl: e.target.value })}
                      placeholder="https://satip.example.com/api/calm/test-automation/v1"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inboundAuthSecretRef">Inbound Auth Secret Reference</Label>
                    <Input
                      id="inboundAuthSecretRef"
                      value={form.inboundAuthSecretRef}
                      onChange={(e) => update({ inboundAuthSecretRef: e.target.value })}
                      placeholder="sm://calm/inbound-auth-acme"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {form.phase2Outbound && (
                <div className="space-y-4 rounded-xl border border-brand/20 bg-brand/[0.04] p-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-brand" />
                    <h3 className="text-sm font-semibold">Phase 2 — Outbound OAuth</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oauthTokenUrl">Token URL</Label>
                    <Input
                      id="oauthTokenUrl"
                      value={form.oauthTokenUrl}
                      onChange={(e) => update({ oauthTokenUrl: e.target.value })}
                      placeholder="https://tenant.region.alm.cloud.sap/oauth/token"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="oauthClientId" className="flex items-center gap-2">
                        <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                        Client ID
                      </Label>
                      <Input
                        id="oauthClientId"
                        value={form.oauthClientId}
                        onChange={(e) => update({ oauthClientId: e.target.value })}
                        placeholder="satip-outbound-acme"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oauthClientSecret">Client Secret</Label>
                      <Input
                        id="oauthClientSecret"
                        type="password"
                        value={form.oauthClientSecret}
                        onChange={(e) => update({ oauthClientSecret: e.target.value })}
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>OAuth Scopes (least privilege)</Label>
                    <div className="space-y-2">
                      {OUTBOUND_SCOPES.map((scope) => (
                        <label
                          key={scope.id}
                          className={cn(
                            'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                            form.scopes.includes(scope.id)
                              ? 'border-brand/30 bg-brand/[0.05]'
                              : 'border-border hover:bg-muted/20',
                          )}
                        >
                          <Checkbox
                            checked={form.scopes.includes(scope.id)}
                            onCheckedChange={(v) => toggleScope(scope.id, v === true)}
                            className="mt-0.5"
                          />
                          <div>
                            <p className="font-mono text-xs font-medium">{scope.label}</p>
                            <p className="caption-text mt-0.5">{scope.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Review & Register</h2>
                <p className="section-description mt-1">
                  Verify configuration, test connectivity to the CALM tenant, then register.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <ReviewRow label="Display Name" value={form.displayName} />
                <ReviewRow label="Tenant URL" value={tenantUrl} mono />
                <ReviewRow label="API Base" value={apiBase} mono />
                <ReviewRow
                  label="SAP System"
                  value={selectedSystem ? `${selectedSystem.sid} — ${selectedSystem.display_name}` : ''}
                />
                <ReviewRow
                  label="Phase 1 Inbound"
                  value={form.phase1Inbound ? 'Enabled' : 'Disabled'}
                />
                <ReviewRow
                  label="Phase 2 Outbound"
                  value={form.phase2Outbound ? 'Enabled' : 'Disabled'}
                />
                {form.phase1Inbound && (
                  <ReviewRow label="Provider Endpoint" value={form.inboundProviderUrl} mono />
                )}
                {form.phase2Outbound && (
                  <>
                    <ReviewRow label="OAuth Client" value={form.oauthClientId} mono />
                    <ReviewRow label="Scopes" value={form.scopes.join(', ')} mono />
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button variant="outline" onClick={handleTest} disabled={testing} className="gap-2">
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  Test Connection
                </Button>
                {testPassed === true && (
                  <Badge className="pill pill-success h-7 border-0 gap-1.5 justify-center sm:justify-start">
                    <Check className="h-3.5 w-3.5" />
                    Tenant reachable
                  </Badge>
                )}
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Shield className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After registration, scenario bindings can be reconciled against CALM test cases.
                  Only BOUND/READY bindings with write-back enabled will project results and raise
                  defects.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/system-admin/calm">Cancel</Link>
          </Button>
          {currentStep !== 'review' ? (
            <Button
              onClick={handleNext}
              disabled={!canNext()}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleRegister}
              disabled={!canNext() || registering}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {registering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Register Tenant
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
