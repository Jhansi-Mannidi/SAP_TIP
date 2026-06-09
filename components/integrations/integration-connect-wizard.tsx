'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Globe,
  KeyRound,
  Lock,
  Link2,
  Sparkles,
  Loader2,
  RefreshCw,
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
  getCatalogEntry,
  getIntegrationById,
  type IntegrationCatalogEntry,
} from '@/lib/integrations-mock-data'

const STEPS = [
  { id: 'connection', label: 'Connection', icon: Globe },
  { id: 'auth', label: 'Authentication', icon: Lock },
  { id: 'mapping', label: 'Field Mapping', icon: Link2 },
  { id: 'review', label: 'Review & Connect', icon: Sparkles },
] as const

interface IntegrationConnectWizardProps {
  /** Catalog slug for new integrations */
  templateSlug?: string
  /** Existing integration id for reconnect */
  integrationId?: string
  cancelHref?: string
  successHref?: string
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
                    'h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-background shrink-0',
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

export function IntegrationConnectWizard({
  templateSlug,
  integrationId,
  cancelHref = '/system-admin/integrations',
  successHref = '/system-admin/integrations',
}: IntegrationConnectWizardProps) {
  const router = useRouter()
  const existing = integrationId ? getIntegrationById(integrationId) : undefined
  const catalog = templateSlug
    ? getCatalogEntry(templateSlug)
    : existing
      ? getCatalogEntry(existing.slug)
      : undefined

  const [stepIndex, setStepIndex] = React.useState(0)
  const [instanceUrl, setInstanceUrl] = React.useState(existing?.config?.instance_url ?? '')
  const [clientId, setClientId] = React.useState(existing?.config?.client_id ?? '')
  const [clientSecret, setClientSecret] = React.useState('')
  const [apiKey, setApiKey] = React.useState('')
  const [syncInterval, setSyncInterval] = React.useState('15')
  const [autoSync, setAutoSync] = React.useState(true)
  const [testing, setTesting] = React.useState(false)
  const [testPassed, setTestPassed] = React.useState<boolean | null>(null)
  const [connecting, setConnecting] = React.useState(false)

  const authType = catalog?.auth_type ?? existing?.config?.auth_type ?? 'oauth'
  const name = existing?.name ?? catalog?.name ?? 'Integration'

  const canNext = () => {
    switch (STEPS[stepIndex].id) {
      case 'connection':
        return instanceUrl.trim().length > 8
      case 'auth':
        if (authType === 'oauth') return clientId.trim() && clientSecret.trim()
        if (authType === 'api_key') return apiKey.trim()
        if (authType === 'basic') return clientId.trim() && clientSecret.trim()
        return instanceUrl.trim().length > 8
      case 'mapping':
        return true
      case 'review':
        return testPassed === true
      default:
        return false
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestPassed(null)
    await new Promise((r) => setTimeout(r, 1400))
    setTesting(false)
    setTestPassed(true)
  }

  const handleConnect = async () => {
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 1100))
    setConnecting(false)
    router.push(successHref)
  }

  if (!catalog && !existing) {
    return (
      <div className="text-center py-12">
        <p className="section-title">Integration not found</p>
        <Button asChild className="mt-4">
          <Link href={cancelHref}>Back to Integrations Hub</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
        Connecting <span className="font-semibold">{name}</span>
        {catalog && (
          <Badge variant="outline" className="ml-2 text-[10px] h-5 capitalize">
            {authType.replace('_', ' ')}
          </Badge>
        )}
      </div>

      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6"
        >
          {STEPS[stepIndex].id === 'connection' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Connection Details</h2>
                <p className="section-description mt-1">
                  Enter the base URL for your {name} instance.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instanceUrl">Instance URL</Label>
                <Input
                  id="instanceUrl"
                  value={instanceUrl}
                  onChange={(e) => setInstanceUrl(e.target.value)}
                  placeholder={`https://your-org.${catalog?.slug ?? 'example'}.com`}
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sync Interval</Label>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every minute</SelectItem>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 pt-8 cursor-pointer">
                  <Checkbox checked={autoSync} onCheckedChange={(v) => setAutoSync(v === true)} />
                  <span className="text-sm">Enable automatic sync</span>
                </label>
              </div>
            </div>
          )}

          {STEPS[stepIndex].id === 'auth' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Authentication</h2>
                <p className="section-description mt-1">
                  Credentials are stored encrypted in the secret manager.
                </p>
              </div>
              {authType === 'oauth' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                    />
                  </div>
                </>
              )}
              {authType === 'api_key' && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="flex items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5" />
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="••••••••••••••••"
                  />
                </div>
              )}
              {authType === 'webhook' && (
                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Signing Secret</Label>
                  <Input id="webhookSecret" type="password" placeholder="whsec_..." />
                </div>
              )}
            </div>
          )}

          {STEPS[stepIndex].id === 'mapping' && (
            <div className="space-y-4">
              <div>
                <h2 className="section-title">Field Mapping</h2>
                <p className="section-description mt-1">
                  Optional attribute mapping between SATIP and {name}. Defaults work for most setups.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border border-border/60 divide-y">
                {[
                  { satip: 'defect.summary', external: 'title / short_description' },
                  { satip: 'defect.severity', external: 'priority' },
                  { satip: 'test_run.outcome', external: 'status' },
                ].map((row) => (
                  <div key={row.satip} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 text-xs">
                    <code className="font-mono text-muted-foreground">{row.satip}</code>
                    <span className="hidden sm:inline text-muted-foreground">→</span>
                    <code className="font-mono">{row.external}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {STEPS[stepIndex].id === 'review' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Review & Connect</h2>
                <p className="section-description mt-1">Test the connection, then activate the integration.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Integration</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">URL</span>
                  <span className="font-mono text-xs break-all text-right">{instanceUrl}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Sync</span>
                  <span>{autoSync ? `Every ${syncInterval} min` : 'Manual only'}</span>
                </div>
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
                {testPassed && (
                  <Badge className="pill pill-success h-7 border-0 gap-1.5 justify-center sm:justify-start">
                    <Check className="h-3.5 w-3.5" />
                    Connection verified
                  </Badge>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button
              onClick={() => setStepIndex((i) => i + 1)}
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
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
