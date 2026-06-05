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
  Building2,
  ShieldCheck,
  KeyRound,
  Link2,
  Globe,
  Users,
  Lock,
  FileKey2,
  Sparkles,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

import { IDP_KIND_LABELS, type IdPKind, type IdPProtocol } from '@/lib/config-mock-data'

const STEPS = [
  { id: 'provider', label: 'Provider', icon: ShieldCheck },
  { id: 'protocol', label: 'Protocol & Name', icon: Link2 },
  { id: 'credentials', label: 'Credentials', icon: Lock },
  { id: 'review', label: 'Review & Connect', icon: Sparkles },
] as const

type StepId = (typeof STEPS)[number]['id']

const PROVIDERS: {
  kind: IdPKind
  icon: React.ElementType
  description: string
  protocols: IdPProtocol[]
  defaultEndpoint: string
}[] = [
  {
    kind: 'SAP_IAS',
    icon: Building2,
    description: 'SAP Identity Authentication Service for workforce SSO',
    protocols: ['SAML', 'OIDC'],
    defaultEndpoint: 'your-tenant.accounts.ondemand.com',
  },
  {
    kind: 'AZURE_AD',
    icon: ShieldCheck,
    description: 'Microsoft Entra ID (Azure AD) for enterprise directory sync',
    protocols: ['OIDC', 'SAML'],
    defaultEndpoint: 'login.microsoftonline.com/your-tenant-id',
  },
  {
    kind: 'OKTA',
    icon: KeyRound,
    description: 'Okta Workforce Identity Cloud',
    protocols: ['OIDC', 'SAML'],
    defaultEndpoint: 'your-org.okta.com',
  },
  {
    kind: 'COGNITO',
    icon: Cloud,
    description: 'AWS Cognito user pools for application SSO',
    protocols: ['OIDC'],
    defaultEndpoint: 'cognito-idp.region.amazonaws.com/pool-id',
  },
]

export interface IdpConnectForm {
  kind: IdPKind | ''
  displayName: string
  protocol: IdPProtocol
  endpoint: string
  clientId: string
  clientSecret: string
  tenantId: string
}

const INITIAL_FORM: IdpConnectForm = {
  kind: '',
  displayName: '',
  protocol: 'OIDC',
  endpoint: '',
  clientId: '',
  clientSecret: '',
  tenantId: '',
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
                    isCurrent && 'bg-brand text-brand-foreground ring-brand/50 shadow-[0_0_0_3px_rgba(184,134,46,0.15)]',
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

function ProviderCard({
  provider,
  selected,
  onSelect,
}: {
  provider: (typeof PROVIDERS)[0]
  selected: boolean
  onSelect: () => void
}) {
  const Icon = provider.icon
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      className={cn(
        'flex h-full min-h-[10rem] w-full flex-col items-start rounded-xl border p-4 text-left transition-colors',
        selected
          ? 'border-brand ring-2 ring-brand/25 bg-brand/[0.06] shadow-[var(--shadow-sm)]'
          : 'border-border bg-card hover:border-border/80 hover:shadow-[var(--shadow-xs)]',
      )}
    >
      <div className="flex items-start justify-between w-full gap-2">
        <div className="h-10 w-10 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-brand" />
        </div>
        {selected && (
          <Badge className="pill pill-brand h-5 text-[10px] border-0 gap-1">
            <Check className="h-3 w-3" />
            Selected
          </Badge>
        )}
      </div>
      <h3 className="font-semibold text-sm mt-3">{IDP_KIND_LABELS[provider.kind]}</h3>
      <p className="caption-text mt-1 leading-relaxed flex-1">{provider.description}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {provider.protocols.map((p) => (
          <Badge key={p} variant="outline" className="h-5 text-[10px] font-mono">
            {p}
          </Badge>
        ))}
      </div>
    </motion.button>
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

export function IdpConnectWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<IdpConnectForm>(INITIAL_FORM)
  const [testing, setTesting] = React.useState(false)
  const [testPassed, setTestPassed] = React.useState<boolean | null>(null)
  const [connecting, setConnecting] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const selectedProvider = PROVIDERS.find((p) => p.kind === form.kind)

  const update = (patch: Partial<IdpConnectForm>) => setForm((f) => ({ ...f, ...patch }))

  const selectProvider = (kind: IdPKind) => {
    const provider = PROVIDERS.find((p) => p.kind === kind)!
    update({
      kind,
      displayName: form.displayName || `Star Cement ${IDP_KIND_LABELS[kind]}`,
      protocol: provider.protocols[0],
      endpoint: provider.defaultEndpoint,
    })
  }

  const canNext = () => {
    switch (currentStep) {
      case 'provider':
        return !!form.kind
      case 'protocol':
        return form.displayName.trim().length >= 3
      case 'credentials':
        return form.endpoint.trim() && form.clientId.trim() && form.clientSecret.trim()
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
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestPassed(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTesting(false)
    setTestPassed(true)
  }

  const handleConnect = async () => {
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setConnecting(false)
    router.push('/system-admin/idps')
  }

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
          {currentStep === 'provider' && (
            <div className="space-y-4">
              <div>
                <h2 className="section-title">Select Identity Provider</h2>
                <p className="section-description mt-1">
                  Choose the SSO platform to connect with Star Cement Test Assurance.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROVIDERS.map((provider) => (
                  <ProviderCard
                    key={provider.kind}
                    provider={provider}
                    selected={form.kind === provider.kind}
                    onSelect={() => selectProvider(provider.kind)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'protocol' && selectedProvider && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Protocol & Display Name</h2>
                <p className="section-description mt-1">
                  Configure how users will see this provider in the portal.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={form.displayName}
                  onChange={(e) => update({ displayName: e.target.value })}
                  placeholder="e.g. Star Cement Azure AD"
                />
              </div>
              <div className="space-y-3">
                <Label>Authentication Protocol</Label>
                <RadioGroup
                  value={form.protocol}
                  onValueChange={(v) => update({ protocol: v as IdPProtocol })}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {selectedProvider.protocols.map((protocol) => (
                    <label
                      key={protocol}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors',
                        form.protocol === protocol
                          ? 'border-brand bg-brand/[0.06] ring-1 ring-brand/20'
                          : 'border-border hover:bg-muted/30',
                      )}
                    >
                      <RadioGroupItem value={protocol} />
                      <div>
                        <p className="font-medium text-sm">{protocol}</p>
                        <p className="caption-text">
                          {protocol === 'OIDC' ? 'OpenID Connect' : 'SAML 2.0 Federation'}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 'credentials' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Connection Credentials</h2>
                <p className="section-description mt-1">
                  Enter the IdP endpoint and application credentials. Values are stored encrypted.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint" className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  Endpoint URL
                </Label>
                <Input
                  id="endpoint"
                  value={form.endpoint}
                  onChange={(e) => update({ endpoint: e.target.value })}
                  placeholder="login.example.com/tenant"
                  className="font-mono text-sm"
                />
              </div>
              {(form.kind === 'AZURE_AD' || form.kind === 'OKTA') && (
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant / Organization ID</Label>
                  <Input
                    id="tenantId"
                    value={form.tenantId}
                    onChange={(e) => update({ tenantId: e.target.value })}
                    placeholder="tenant-id or org URL"
                    className="font-mono text-sm"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="clientId" className="flex items-center gap-2">
                  <FileKey2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Client ID
                </Label>
                <Input
                  id="clientId"
                  value={form.clientId}
                  onChange={(e) => update({ clientId: e.target.value })}
                  placeholder="Application client identifier"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientSecret" className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Client Secret
                </Label>
                <Input
                  id="clientSecret"
                  type="password"
                  value={form.clientSecret}
                  onChange={(e) => update({ clientSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>
          )}

          {currentStep === 'review' && selectedProvider && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Review & Connect</h2>
                <p className="section-description mt-1">
                  Verify your configuration, test the connection, then activate the IdP.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <ReviewRow label="Provider" value={IDP_KIND_LABELS[form.kind as IdPKind]} />
                <ReviewRow label="Display Name" value={form.displayName} />
                <ReviewRow label="Protocol" value={form.protocol} />
                <ReviewRow label="Endpoint" value={form.endpoint} mono />
                <ReviewRow label="Client ID" value={form.clientId} mono />
                {form.tenantId && <ReviewRow label="Tenant ID" value={form.tenantId} mono />}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleTest}
                  disabled={testing}
                  className="gap-2"
                >
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
                    Connection verified
                  </Badge>
                )}
                {testPassed === false && (
                  <Badge className="pill pill-danger h-7 border-0">Connection failed</Badge>
                )}
              </div>
              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Users className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After connecting, user provisioning will begin on the first sync. Existing sessions
                  are unaffected until the IdP is marked active.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/system-admin/idps">Cancel</Link>
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
              onClick={handleConnect}
              disabled={!canNext() || connecting}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {connecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Connect IdP
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
