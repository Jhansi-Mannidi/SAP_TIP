'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Shield,
  Sparkles,
  User,
  UserCircle,
  Users,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { MOCK_SERVICE_ROLES, type ActorClass } from '@/lib/config-mock-data'

const STEPS = [
  { id: 'identity', label: 'Role Identity', icon: Users },
  { id: 'actor', label: 'Actor Class', icon: User },
  { id: 'scopes', label: 'Capability Scopes', icon: Shield },
  { id: 'review', label: 'Review & Create', icon: Sparkles },
] as const

const ACTOR_CLASSES: {
  id: ActorClass
  label: string
  description: string
  icon: React.ElementType
  color: string
  ring: string
}[] = [
  {
    id: 'Human',
    label: 'Human',
    description: 'Assigned to people — QA leads, engineers, architects, and approvers.',
    icon: User,
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    ring: 'ring-blue-500/25',
  },
  {
    id: 'Agent',
    label: 'Agent',
    description: 'Assigned to AI agents — classification, execution, healing, and analysis.',
    icon: Bot,
    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    ring: 'ring-violet-500/25',
  },
  {
    id: 'Either',
    label: 'Either',
    description: 'Flexible role fillable by a person or an agent depending on pairing rules.',
    icon: UserCircle,
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    ring: 'ring-emerald-500/25',
  },
]

const ALL_CAPABILITY_SCOPES = [
  ...new Set(MOCK_SERVICE_ROLES.flatMap((role) => role.capability_scopes)),
].sort()

const SCOPE_GROUPS = ALL_CAPABILITY_SCOPES.reduce<Record<string, string[]>>((groups, scope) => {
  const [domain] = scope.split('.')
  if (!groups[domain]) groups[domain] = []
  groups[domain].push(scope)
  return groups
}, {})

export interface ServiceRoleRegisterForm {
  code: string
  displayName: string
  description: string
  actorClass: ActorClass | ''
  capabilityScopes: string[]
}

const INITIAL_FORM: ServiceRoleRegisterForm = {
  code: '',
  displayName: '',
  description: '',
  actorClass: '',
  capabilityScopes: [],
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

function toRoleCode(displayName: string): string {
  return displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function ServiceRoleRegisterWizard() {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [form, setForm] = React.useState<ServiceRoleRegisterForm>(INITIAL_FORM)
  const [scopeSearch, setScopeSearch] = React.useState('')
  const [creating, setCreating] = React.useState(false)

  const currentStep = STEPS[stepIndex].id
  const update = (patch: Partial<ServiceRoleRegisterForm>) => setForm((f) => ({ ...f, ...patch }))

  const filteredScopeGroups = React.useMemo(() => {
    const query = scopeSearch.toLowerCase().trim()
    if (!query) return SCOPE_GROUPS
    const filtered: Record<string, string[]> = {}
    for (const [domain, scopes] of Object.entries(SCOPE_GROUPS)) {
      const matches = scopes.filter((s) => s.includes(query) || domain.includes(query))
      if (matches.length > 0) filtered[domain] = matches
    }
    return filtered
  }, [scopeSearch])

  const toggleScope = (scope: string) => {
    update({
      capabilityScopes: form.capabilityScopes.includes(scope)
        ? form.capabilityScopes.filter((s) => s !== scope)
        : [...form.capabilityScopes, scope],
    })
  }

  const canNext = () => {
    switch (currentStep) {
      case 'identity':
        return (
          /^[a-z][a-z0-9_]*$/.test(form.code) &&
          form.displayName.trim().length >= 3
        )
      case 'actor':
        return !!form.actorClass
      case 'scopes':
        return form.capabilityScopes.length > 0
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
      router.push('/system-admin/roles')
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1200))
    setCreating(false)
    const { toast } = await import('sonner')
    toast.success('Custom role created', {
      description: `${form.displayName} (${form.code}) is ready for pairing rules.`,
    })
    router.push('/system-admin/roles')
  }

  const actorMeta = ACTOR_CLASSES.find((a) => a.id === form.actorClass)

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
                <h2 className="section-title text-base">Role identity</h2>
                <p className="page-description mt-1">
                  Define a unique code and display name for this custom service role.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="display-name"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Cutover Coordinator"
                  value={form.displayName}
                  onChange={(e) => {
                    const displayName = e.target.value
                    update({
                      displayName,
                      code: form.code || toRoleCode(displayName),
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role-code"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Role Code
                </Label>
                <Input
                  id="role-code"
                  placeholder="e.g. cutover_coordinator"
                  value={form.code}
                  onChange={(e) =>
                    update({ code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })
                  }
                  className="font-mono"
                />
                <p className="caption-text">Snake_case identifier used in pairing rules and APIs</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Description <span className="normal-case font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the functional responsibility this role represents..."
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  className="min-h-[100px] resize-none text-sm"
                />
              </div>
            </div>
          )}

          {currentStep === 'actor' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Actor class</h2>
                <p className="page-description mt-1">
                  Who can be assigned to this role — people, AI agents, or either.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACTOR_CLASSES.map((actor) => {
                  const Icon = actor.icon
                  const selected = form.actorClass === actor.id
                  return (
                    <button
                      key={actor.id}
                      type="button"
                      onClick={() => update({ actorClass: actor.id })}
                      className={cn(
                        'flex flex-col items-start rounded-xl border p-4 text-left transition-all h-full',
                        selected
                          ? `border-brand/40 bg-brand/[0.06] ring-1 ${actor.ring}`
                          : 'border-border bg-background hover:bg-muted/30 hover:border-brand/20',
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', actor.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {selected && <Check className="h-4 w-4 text-brand ml-auto shrink-0" />}
                      </div>
                      <p className="font-medium text-sm mt-3">{actor.label}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{actor.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 'scopes' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Capability scopes</h2>
                <p className="page-description mt-1">
                  Select permissions granted to members assigned this role.
                </p>
              </div>

              {form.capabilityScopes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-brand/25 bg-brand/[0.04]">
                  {form.capabilityScopes.map((scope) => (
                    <Badge
                      key={scope}
                      variant="secondary"
                      className="h-6 gap-1 font-mono text-[10px] pr-1"
                    >
                      {scope}
                      <button
                        type="button"
                        onClick={() => toggleScope(scope)}
                        className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                        aria-label={`Remove ${scope}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scopes..."
                  value={scopeSearch}
                  onChange={(e) => setScopeSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <div className="space-y-4 max-h-[min(42dvh,360px)] overflow-y-auto pr-1">
                {Object.entries(filteredScopeGroups).map(([domain, scopes]) => (
                  <div key={domain}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {domain}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scopes.map((scope) => {
                        const selected = form.capabilityScopes.includes(scope)
                        return (
                          <button
                            key={scope}
                            type="button"
                            onClick={() => toggleScope(scope)}
                            className={cn(
                              'rounded-lg border px-2.5 py-1.5 font-mono text-[11px] transition-all',
                              selected
                                ? 'border-brand/40 bg-brand/[0.08] text-brand font-medium ring-1 ring-brand/20'
                                : 'border-border bg-background hover:bg-muted/40 text-foreground',
                            )}
                          >
                            {scope}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <p className="caption-text">
                {form.capabilityScopes.length} scope{form.capabilityScopes.length !== 1 ? 's' : ''}{' '}
                selected — at least one required
              </p>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <h2 className="section-title text-base">Review & create</h2>
                <p className="page-description mt-1">
                  Confirm role settings before creating. Custom roles can be edited and assigned via pairing rules.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      actorMeta?.color ?? 'bg-brand/15 text-brand',
                    )}
                  >
                    {actorMeta ? <actorMeta.icon className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{form.displayName}</p>
                    <code className="text-xs text-muted-foreground font-mono">{form.code}</code>
                  </div>
                  <Badge variant="outline" className="ml-auto h-6 text-[10px] shrink-0">
                    Custom
                  </Badge>
                </div>

                <ReviewRow label="Actor Class" value={form.actorClass} />
                {form.description && <ReviewRow label="Description" value={form.description} />}
                <ReviewRow
                  label="Capability Scopes"
                  value={`${form.capabilityScopes.length} scopes`}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {form.capabilityScopes.map((scope) => (
                  <Badge key={scope} variant="outline" className="font-mono text-[10px] h-6">
                    {scope}
                  </Badge>
                ))}
              </div>

              <div className="rounded-xl border border-brand/20 bg-brand/[0.05] px-4 py-3 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After creation, add pairing rules to bind this role to scenarios, tasks, and defects.
                  Members can be assigned from the Service Roles list.
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
            <Link href="/system-admin/roles">Cancel</Link>
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
              Create Role
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
