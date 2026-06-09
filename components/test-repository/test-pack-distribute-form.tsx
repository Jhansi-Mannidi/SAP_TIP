'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Shield,
  ShieldCheck,
  Key,
  Download,
  Send,
  Globe,
  Building2,
  Handshake,
  FileDown,
  ChevronRight,
  ChevronDown,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  FileJson,
  Lock,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  Check,
  Tag,
} from 'lucide-react'

import { StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { TestPack } from '@/lib/mock-data'

const SIGNING_KEYS = [
  { id: 'key_1', name: 'Star Cement Primary Key', did: 'did:voltus:0x4f8a...', type: 'organization' as const },
  { id: 'key_2', name: 'P.Sharma Personal Key', did: 'did:voltus:0x7b2c...', type: 'personal' as const },
  { id: 'key_3', name: 'VoltusWave Partner Key', did: 'did:voltus:partner:0x9d4e...', type: 'partner' as const },
]

const KEY_TYPE_STYLES = {
  organization: 'bg-brand/10 text-brand border-brand/20',
  personal: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  partner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
}

type RecipientMode = 'tenant' | 'partner' | 'catalog' | 'file'

const recipientModes = [
  {
    id: 'tenant' as RecipientMode,
    name: 'Specific Tenant',
    description: 'Distribute to a customer or workspace by DID',
    icon: Building2,
  },
  {
    id: 'partner' as RecipientMode,
    name: 'SI Partner',
    description: 'Share with a registered system integrator',
    icon: Handshake,
  },
  {
    id: 'catalog' as RecipientMode,
    name: 'Public Catalog',
    description: 'Publish to VoltusWave global catalog',
    icon: Globe,
  },
  {
    id: 'file' as RecipientMode,
    name: 'File Download',
    description: 'Export as .voltustpack for manual transfer',
    icon: FileDown,
  },
]

const FLOW_STEPS = [
  { id: 'mode', label: 'Distribution mode' },
  { id: 'key', label: 'Signing key' },
  { id: 'export', label: 'Sign & export' },
]

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="section-description mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [expanded, setExpanded] = React.useState(depth < 2)

  if (data === null) return <span className="text-orange-600 dark:text-orange-400">null</span>
  if (typeof data === 'boolean')
    return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>
  if (typeof data === 'number')
    return <span className="text-blue-600 dark:text-blue-400">{data}</span>
  if (typeof data === 'string')
    return <span className="text-emerald-700 dark:text-emerald-400">&quot;{data}&quot;</span>

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted-foreground">[]</span>
    return (
      <span>
        <button type="button" onClick={() => setExpanded(!expanded)} className="hover:bg-muted rounded px-0.5">
          {expanded ? <ChevronDown className="h-3 w-3 inline" /> : <ChevronRight className="h-3 w-3 inline" />}
        </button>
        <span className="text-muted-foreground">[{data.length}]</span>
        {expanded && (
          <div className="ml-4 border-l border-border pl-2">
            {data.map((item, i) => (
              <div key={i}>
                <span className="text-muted-foreground">{i}: </span>
                <JsonTree data={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) return <span className="text-muted-foreground">{'{}'}</span>
    return (
      <span>
        <button type="button" onClick={() => setExpanded(!expanded)} className="hover:bg-muted rounded px-0.5">
          {expanded ? <ChevronDown className="h-3 w-3 inline" /> : <ChevronRight className="h-3 w-3 inline" />}
        </button>
        <span className="text-muted-foreground">{`{${entries.length}}`}</span>
        {expanded && (
          <div className="ml-4 border-l border-border pl-2">
            {entries.map(([key, value]) => (
              <div key={key}>
                <span className="text-rose-600 dark:text-rose-400">{key}</span>
                <span className="text-muted-foreground">: </span>
                <JsonTree data={value} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    )
  }

  return <span>{String(data)}</span>
}

interface TestPackDistributeFormProps {
  pack: TestPack
}

export function TestPackDistributeForm({ pack }: TestPackDistributeFormProps) {
  const [recipientMode, setRecipientMode] = React.useState<RecipientMode>('file')
  const [selectedKey, setSelectedKey] = React.useState(SIGNING_KEYS[0].id)
  const [tenantDid, setTenantDid] = React.useState('')
  const [partnerDid, setPartnerDid] = React.useState('')
  const [catalogCategory, setCatalogCategory] = React.useState('')
  const [isManifestOpen, setIsManifestOpen] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isGenerated, setIsGenerated] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const selectedKeyData = SIGNING_KEYS.find((k) => k.id === selectedKey)
  const isDraft = pack.distribution_status === 'Draft'

  const manifest = React.useMemo(
    () => ({
      '@context': 'https://voltuswave.io/schemas/testpack/v1',
      id: `urn:voltus:pack:${pack.id}`,
      name: pack.name,
      version: pack.version,
      created: pack.created_at,
      published: new Date().toISOString(),
      publisher: {
        did: selectedKeyData?.did,
        name: selectedKeyData?.name,
      },
      distribution: {
        mode: recipientMode,
        ...(recipientMode === 'tenant' && { recipient_did: tenantDid || 'did:voltus:tenant:...' }),
        ...(recipientMode === 'partner' && { partner_did: partnerDid || 'did:voltus:partner:...' }),
        ...(recipientMode === 'catalog' && { category: catalogCategory || 'general' }),
      },
      contents: pack.contents,
      integrity: {
        algorithm: 'SHA-256',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      signature: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: selectedKeyData?.did,
        proofPurpose: 'assertionMethod',
        proofValue: isGenerated ? 'z58DAdFfa9SkqZMVPxAQpic7ndTeTx...' : null,
      },
      tags: pack.tags,
    }),
    [pack, recipientMode, tenantDid, partnerDid, catalogCategory, selectedKeyData, isGenerated],
  )

  const canDistribute =
    recipientMode === 'file' ||
    (recipientMode === 'tenant' && tenantDid) ||
    (recipientMode === 'partner' && partnerDid) ||
    (recipientMode === 'catalog' && catalogCategory)

  const flowComplete = {
    mode: true,
    key: Boolean(selectedKey),
    export: isGenerated,
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setIsGenerated(true)
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${pack.name.toLowerCase().replace(/\s+/g, '-')}-${pack.version}.voltustpack`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Flow progress */}
      <div className="rounded-xl border border-border/60 bg-card shadow-[var(--shadow-xs)] px-4 py-3 sm:px-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {FLOW_STEPS.map((step, index) => {
            const done =
              step.id === 'mode'
                ? flowComplete.mode
                : step.id === 'key'
                  ? flowComplete.key
                  : flowComplete.export
            const active =
              step.id === 'export'
                ? flowComplete.mode && flowComplete.key && !flowComplete.export
                : step.id === 'key'
                  ? flowComplete.mode && !flowComplete.export
                  : !flowComplete.export
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                      done && 'bg-brand text-brand-foreground',
                      !done && active && 'bg-brand/15 text-brand ring-2 ring-brand/30',
                      !done && !active && 'bg-muted text-muted-foreground',
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      'text-sm truncate',
                      (done || active) && 'font-medium text-foreground',
                      !done && !active && 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < FLOW_STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 hidden sm:block shrink-0" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {isDraft && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Draft pack</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Publish this pack before distributing to customers or partners. You can still preview
                the manifest below.
              </p>
            </div>
          </motion.div>
        )}

        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
                Pack signed successfully
              </p>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Signed with {selectedKeyData?.name}. Download the .voltustpack file to distribute.
              </p>
            </div>
            <Button
              onClick={handleDownload}
              size="sm"
              className="shrink-0 gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main column */}
        <div className="space-y-6">
          {/* Distribution mode */}
          <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6 space-y-5">
            <SectionHeader
              icon={Send}
              title="Distribution Mode"
              description="Choose how you want to distribute this test pack"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipientModes.map((mode) => {
                const selected = recipientMode === mode.id
                const ModeIcon = mode.icon
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setRecipientMode(mode.id)}
                    className={cn(
                      'relative flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-200',
                      selected
                        ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20 shadow-[var(--shadow-xs)]'
                        : 'border-border/60 hover:border-border hover:bg-muted/20',
                    )}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                        selected ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <ModeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{mode.name}</p>
                      <p className="caption-text mt-1 leading-relaxed">{mode.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
              {recipientMode === 'tenant' && (
                <div className="space-y-2">
                  <Label htmlFor="tenant-did">Recipient Tenant DID</Label>
                  <Input
                    id="tenant-did"
                    placeholder="did:voltus:tenant:0x..."
                    value={tenantDid}
                    onChange={(e) => setTenantDid(e.target.value)}
                    className="font-mono text-sm bg-card"
                  />
                  <p className="caption-text">
                    Decentralized identifier of the target customer or workspace
                  </p>
                </div>
              )}

              {recipientMode === 'partner' && (
                <div className="space-y-2">
                  <Label htmlFor="partner-did">SI Partner DID</Label>
                  <Input
                    id="partner-did"
                    placeholder="did:voltus:partner:0x..."
                    value={partnerDid}
                    onChange={(e) => setPartnerDid(e.target.value)}
                    className="font-mono text-sm bg-card"
                  />
                  <p className="caption-text">
                    Decentralized identifier of the system integrator partner
                  </p>
                </div>
              )}

              {recipientMode === 'catalog' && (
                <div className="space-y-2">
                  <Label htmlFor="catalog-category">Catalog Category</Label>
                  <Select value={catalogCategory} onValueChange={setCatalogCategory}>
                    <SelectTrigger id="catalog-category" className="bg-card">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="otc">Order to Cash (OTC)</SelectItem>
                      <SelectItem value="ptp">Procure to Pay (PTP)</SelectItem>
                      <SelectItem value="rtr">Record to Report (RTR)</SelectItem>
                      <SelectItem value="htr">Hire to Retire (HTR)</SelectItem>
                      <SelectItem value="migration">S/4HANA Migration</SelectItem>
                      <SelectItem value="compliance">Compliance & Audit</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="caption-text">Category for discovery in the VoltusWave global catalog</p>
                </div>
              )}

              {recipientMode === 'file' && (
                <div className="flex items-start gap-2.5 text-sm">
                  <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-muted-foreground leading-relaxed">
                    The pack will be downloaded as a{' '}
                    <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">.voltustpack</span>{' '}
                    file that can be manually imported by the recipient.
                  </p>
                </div>
              )}

              {recipientMode === 'catalog' && (
                <div className="flex items-start gap-2.5 text-sm mt-3 pt-3 border-t border-border/50">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-900/80 dark:text-amber-200/80 text-xs leading-relaxed">
                    Publishing to the global catalog makes this pack discoverable by all VoltusWave
                    users. Ensure no proprietary data is included.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Signing key */}
          <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6 space-y-5">
            <SectionHeader
              icon={Key}
              title="Signing Key"
              description="Select the cryptographic key to sign this distribution"
            />

            <div className="space-y-2">
              {SIGNING_KEYS.map((key) => {
                const selected = selectedKey === key.id
                return (
                  <button
                    key={key.id}
                    type="button"
                    onClick={() => setSelectedKey(key.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200',
                      selected
                        ? 'border-brand/40 bg-brand/[0.06] ring-1 ring-brand/20'
                        : 'border-border/60 hover:border-border hover:bg-muted/20',
                    )}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
                        selected ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{key.name}</span>
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] h-5 capitalize border', KEY_TYPE_STYLES[key.type])}
                        >
                          {key.type}
                        </Badge>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground mt-1 truncate">
                        {key.did}
                      </p>
                    </div>
                    {selected && <Shield className="h-4 w-4 text-brand shrink-0" />}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Manifest - mobile only in main column */}
          <section className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] lg:hidden">
            <Collapsible open={isManifestOpen} onOpenChange={setIsManifestOpen}>
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/20 transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <FileJson className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="section-title text-base">Manifest Preview</span>
                </div>
                {isManifestOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-5 pb-5">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-xs overflow-auto max-h-[280px]">
                  <JsonTree data={manifest} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[calc(var(--header-offset,0px)+1rem)] space-y-4">
          {/* Pack summary */}
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 bg-gradient-to-r from-brand/[0.08] to-transparent">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-brand" />
                <span className="text-sm font-semibold">Pack Summary</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium leading-snug line-clamp-2">{pack.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="outline" className="font-mono text-[10px] h-5">
                    {pack.version}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] h-5 capitalize">
                    {pack.distribution_status}
                  </Badge>
                </div>
              </div>

              <StaggerGrid columns="grid-cols-2" className="gap-2" fast>
                {[
                  { icon: Layers, label: 'Suites', value: pack.contents.suites, tone: 'bg-primary/10 text-primary' },
                  { icon: FileText, label: 'Scenarios', value: pack.contents.scenarios, tone: 'bg-blue-500/10 text-blue-600' },
                  { icon: ClipboardCheck, label: 'Cases', value: pack.contents.cases, tone: 'bg-amber-500/10 text-amber-600' },
                  { icon: Database, label: 'Fixtures', value: pack.contents.fixtures, tone: 'bg-emerald-500/10 text-emerald-600' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border/50 bg-muted/20 p-2.5 text-center"
                  >
                    <div className={cn('inline-flex p-1 rounded-md mb-1', stat.tone)}>
                      <stat.icon className="h-3 w-3" />
                    </div>
                    <p className="text-base font-bold tabular-nums leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </StaggerGrid>

              <div className="flex flex-wrap gap-1">
                {pack.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] gap-0.5 h-5">
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <span className="text-sm font-semibold">Ready to distribute</span>
            </div>
            <p className="caption-text leading-relaxed">
              {recipientModes.find((m) => m.id === recipientMode)?.name} via{' '}
              {selectedKeyData?.name}
            </p>
            {isGenerated ? (
              <Button
                onClick={handleDownload}
                className="w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <Download className="h-4 w-4" />
                Download .voltustpack
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!canDistribute || isGenerating || isDraft}
                className="w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing pack…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Sign & Generate
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/test-repository/packs/${pack.id}`}>View pack details</Link>
            </Button>
          </div>

          {/* Manifest desktop */}
          <div className="hidden lg:block rounded-xl border border-border bg-card shadow-[var(--shadow-xs)]">
            <Collapsible open={isManifestOpen} onOpenChange={setIsManifestOpen}>
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Manifest</span>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyManifest()
                          }}
                        >
                          {copied ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy manifest</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {isManifestOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-[11px] overflow-auto max-h-[220px] leading-relaxed">
                  <JsonTree data={manifest} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </aside>
      </div>
    </div>
  )
}
