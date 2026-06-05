'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Database,
  FileText,
  Layers,
  Globe,
  Building2,
  Briefcase,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  Calendar,
  Loader2,
  Copy as CopyIcon,
  Plus,
} from 'lucide-react'
import type { DataFixture } from '@/lib/mock-data'

export type FixtureSheetMode = 'create' | 'clone'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: FixtureSheetMode
  initialData?: Partial<DataFixture> | null
}

type DataKind = 'master' | 'transactional' | 'mixed'
type Scope = 'Global' | 'Customer' | 'Workspace'
type PiiLevel = 'none' | 'low' | 'medium' | 'high'
type FixtureState = 'Draft' | 'Published'

const DATA_KINDS: {
  value: DataKind
  label: string
  icon: React.ElementType
  description: string
}[] = [
  {
    value: 'master',
    label: 'Master',
    icon: Database,
    description: 'Reference data: customers, vendors, materials',
  },
  {
    value: 'transactional',
    label: 'Transactional',
    icon: FileText,
    description: 'Documents: orders, deliveries, invoices',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    icon: Layers,
    description: 'End-to-end data spanning multiple objects',
  },
]

const SCOPES: {
  value: Scope
  label: string
  icon: React.ElementType
  description: string
}[] = [
  {
    value: 'Global',
    label: 'Global',
    icon: Globe,
    description: 'Available across the platform',
  },
  {
    value: 'Customer',
    label: 'Customer',
    icon: Building2,
    description: 'Scoped to this customer tenant',
  },
  {
    value: 'Workspace',
    label: 'Workspace',
    icon: Briefcase,
    description: 'Only inside this workspace',
  },
]

const PII_LEVELS: {
  value: PiiLevel
  label: string
  icon: React.ElementType
  description: string
}[] = [
  { value: 'none', label: 'None', icon: ShieldCheck, description: 'No personal data' },
  { value: 'low', label: 'Low', icon: Shield, description: 'Non-sensitive identifiers' },
  { value: 'medium', label: 'Medium', icon: ShieldAlert, description: 'Names, addresses, contact info' },
  { value: 'high', label: 'High', icon: ShieldX, description: 'IDs, financial, health data' },
]

const SAP_OBJECTS = ['KNA1', 'LFA1', 'MARA', 'VBAK', 'EKKO', 'SKA1', 'MIXED']

export function NewFixtureSheet({
  open,
  onOpenChange,
  mode = 'create',
  initialData = null,
}: Props) {
  const isClone = mode === 'clone'

  const [code, setCode] = React.useState('')
  const [codeManuallyEdited, setCodeManuallyEdited] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [dataKind, setDataKind] = React.useState<DataKind>('master')
  const [sapObject, setSapObject] = React.useState('KNA1')
  const [scope, setScope] = React.useState<Scope>('Global')
  const [piiLevel, setPiiLevel] = React.useState<PiiLevel>('low')
  const [version, setVersion] = React.useState('1.0.0')
  const [recordCount, setRecordCount] = React.useState(50)
  const [hasExpiry, setHasExpiry] = React.useState(false)
  const [expiresAt, setExpiresAt] = React.useState('')
  const [initialState, setInitialState] = React.useState<FixtureState>('Draft')

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = React.useState(false)

  // Seed from initialData when opening
  React.useEffect(() => {
    if (!open) return

    if (initialData) {
      const baseCode = initialData.code ?? ''
      setCode(isClone && baseCode ? `${baseCode}_COPY` : baseCode)
      setName(initialData.name ? (isClone ? `${initialData.name} (Copy)` : initialData.name) : '')
      setDescription(initialData.description ?? '')
      setDataKind((initialData.data_kind as DataKind) ?? 'master')
      setSapObject(initialData.sap_object_type ?? 'KNA1')
      setScope((initialData.tenant_scope as Scope) ?? 'Global')
      setPiiLevel((initialData.has_pii as PiiLevel) ?? 'low')
      setVersion(isClone ? '1.0.0' : initialData.version ?? '1.0.0')
      setRecordCount(initialData.record_count ?? 50)
      setHasExpiry(!!initialData.expires_at)
      setExpiresAt(initialData.expires_at ? initialData.expires_at.slice(0, 10) : '')
      setInitialState('Draft') // clones always start as Draft
      setCodeManuallyEdited(true)
    } else {
      setCode('')
      setName('')
      setDescription('')
      setDataKind('master')
      setSapObject('KNA1')
      setScope('Global')
      setPiiLevel('low')
      setVersion('1.0.0')
      setRecordCount(50)
      setHasExpiry(false)
      setExpiresAt('')
      setInitialState('Draft')
      setCodeManuallyEdited(false)
    }
    setErrors({})
    setIsSaving(false)
  }, [open, initialData, isClone])

  // Auto-suggest UPPER_SNAKE_CASE code from name (unless user typed in the code field)
  React.useEffect(() => {
    if (codeManuallyEdited) return
    if (!name.trim()) {
      setCode('')
      return
    }
    const suggested = name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join('_')
    setCode(suggested ? `${suggested}_SET` : '')
  }, [name, codeManuallyEdited])

  const completion = React.useMemo(() => {
    let filled = 0
    const checks = [
      !!name.trim(),
      !!code.trim(),
      !!description.trim(),
      !!dataKind,
      !!sapObject,
      !!scope,
      !!version.trim(),
      recordCount > 0,
    ]
    checks.forEach(c => {
      if (c) filled++
    })
    return Math.round((filled / checks.length) * 100)
  }, [name, code, description, dataKind, sapObject, scope, version, recordCount])

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!code.trim()) next.code = 'Code is required'
    else if (!/^[A-Z0-9_]+$/.test(code)) next.code = 'Use UPPER_SNAKE_CASE letters, digits, and underscores only'
    if (!description.trim()) next.description = 'Add a short description'
    if (!/^\d+\.\d+\.\d+$/.test(version)) next.version = 'Use semver, e.g. 1.0.0'
    if (recordCount < 1) next.recordCount = 'Must be at least 1'
    if (hasExpiry && !expiresAt) next.expiresAt = 'Pick an expiry date'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(isClone ? 'Fixture cloned' : 'Fixture created', {
        description: `${code} · ${recordCount} records · ${initialState}`,
      })
      onOpenChange(false)
    }, 900)
  }

  const title = isClone ? 'Clone Fixture' : 'New Fixture'
  const subtitle = isClone
    ? 'Duplicate this fixture as a new record. The clone always starts in Draft.'
    : 'Define a reusable data set that scenarios can attach to as inputs.'
  const Icon = isClone ? CopyIcon : Plus
  const ctaLabel = isClone ? 'Clone Fixture' : 'Create Fixture'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0"
      >
        {/* Header with progress */}
        <SheetHeader className="border-b border-border px-5 sm:px-6 py-4 space-y-2 text-left">
          <div className="flex items-center justify-between gap-3">
            <SheetTitle className="flex items-center gap-2.5 text-base font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              {title}
            </SheetTitle>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground tabular-nums">
              {completion}% complete
            </span>
          </div>
          <SheetDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </SheetDescription>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* 1. Identity */}
          <FormSection number={1} title="Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name" error={errors.name} required>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Domestic Customer Master Set"
                  className="h-9"
                />
              </Field>
              <Field
                label="Code"
                hint="UPPER_SNAKE_CASE"
                error={errors.code}
                required
              >
                <Input
                  value={code}
                  onChange={e => {
                    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))
                    setCodeManuallyEdited(true)
                  }}
                  placeholder="CUST_DOMESTIC_SET"
                  className="h-9 font-mono text-xs"
                />
              </Field>
            </div>
            <Field label="Description" error={errors.description} required>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="50 domestic customer masters for OTC regression testing"
                className="min-h-[72px] resize-none text-sm"
              />
            </Field>
          </FormSection>

          {/* 2. Classification */}
          <FormSection number={2} title="Classification">
            <Field label="Data Kind">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DATA_KINDS.map(kind => {
                  const KindIcon = kind.icon
                  const selected = dataKind === kind.value
                  return (
                    <button
                      key={kind.value}
                      type="button"
                      onClick={() => setDataKind(kind.value)}
                      className={cn(
                        'text-left rounded-lg border p-2.5 transition-colors',
                        selected
                          ? 'border-brand bg-brand-soft/40 ring-1 ring-inset ring-brand/30'
                          : 'border-border bg-background hover:bg-muted/30',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <KindIcon className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-xs font-semibold text-foreground">
                          {kind.label}
                        </span>
                      </div>
                      <p className="page-description text-[10px]">
                        {kind.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="SAP Object">
                <Select value={sapObject} onValueChange={setSapObject}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SAP_OBJECTS.map(o => (
                      <SelectItem key={o} value={o}>
                        <span className="font-mono text-xs">{o}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Version" error={errors.version} hint="semver">
                <Input
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="h-9 font-mono text-xs"
                />
              </Field>
            </div>
          </FormSection>

          {/* 3. Scope & PII */}
          <FormSection number={3} title="Governance">
            <Field label="Tenant Scope">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SCOPES.map(s => {
                  const SIcon = s.icon
                  const selected = scope === s.value
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setScope(s.value)}
                      className={cn(
                        'text-left rounded-lg border p-2.5 transition-colors',
                        selected
                          ? 'border-brand bg-brand-soft/40 ring-1 ring-inset ring-brand/30'
                          : 'border-border bg-background hover:bg-muted/30',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <SIcon className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-xs font-semibold text-foreground">
                          {s.label}
                        </span>
                      </div>
                      <p className="page-description text-[10px]">
                        {s.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="PII Level">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PII_LEVELS.map(p => {
                  const PIcon = p.icon
                  const selected = piiLevel === p.value
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPiiLevel(p.value)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border px-2 py-2 transition-colors',
                        selected
                          ? 'border-brand bg-brand-soft/40 ring-1 ring-inset ring-brand/30'
                          : 'border-border bg-background hover:bg-muted/30',
                      )}
                      title={p.description}
                    >
                      <PIcon className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span className="text-xs font-semibold text-foreground">{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </Field>
          </FormSection>

          {/* 4. Lifecycle */}
          <FormSection number={4} title="Lifecycle">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Record Count" error={errors.recordCount}>
                <Input
                  type="number"
                  min={1}
                  value={recordCount}
                  onChange={e => setRecordCount(Number(e.target.value) || 0)}
                  className="h-9 font-mono text-xs tabular-nums"
                />
              </Field>
              <Field label="Initial State">
                <Select
                  value={initialState}
                  onValueChange={v => setInitialState(v as FixtureState)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasExpiry}
                onChange={e => setHasExpiry(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-muted-foreground/40 text-brand focus:ring-brand"
              />
              <span className="text-xs font-medium text-foreground">Set expiration date</span>
            </label>

            {hasExpiry && (
              <Field label="Expires On" error={errors.expiresAt}>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    className="h-9 pl-8 text-xs"
                  />
                </div>
              </Field>
            )}
          </FormSection>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleSave}
            disabled={isSaving || completion < 50}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Icon className="h-3.5 w-3.5" />
                {ctaLabel}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ---------- helpers ---------- */

function FormSection({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-foreground border border-border tabular-nums">
          {number}
        </span>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h4>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium flex items-center gap-1 text-foreground">
        {label}
        {required ? <span className="text-destructive">*</span> : null}
        {hint ? (
          <span className="text-[10px] font-normal text-muted-foreground">— {hint}</span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[11px] text-destructive">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
