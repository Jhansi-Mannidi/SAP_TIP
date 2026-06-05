'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
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
  Users,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { MOCK_TEST_PACKS } from '@/lib/mock-data'

// Signing keys mock
const SIGNING_KEYS = [
  { id: 'key_1', name: 'Star Cement Primary Key', did: 'did:voltus:0x4f8a...', type: 'organization' },
  { id: 'key_2', name: 'P.Sharma Personal Key', did: 'did:voltus:0x7b2c...', type: 'personal' },
  { id: 'key_3', name: 'VoltusWave Partner Key', did: 'did:voltus:partner:0x9d4e...', type: 'partner' },
]

type RecipientMode = 'tenant' | 'partner' | 'catalog' | 'file'

const recipientModes = [
  {
    id: 'tenant' as RecipientMode,
    name: 'Specific Tenant',
    description: 'Distribute to a specific customer or workspace by DID',
    icon: Building2,
  },
  {
    id: 'partner' as RecipientMode,
    name: 'SI Partner',
    description: 'Share with a registered system integrator partner',
    icon: Handshake,
  },
  {
    id: 'catalog' as RecipientMode,
    name: 'Public Catalog',
    description: 'Publish to VoltusWave global catalog for discovery',
    icon: Globe,
  },
  {
    id: 'file' as RecipientMode,
    name: 'File Download',
    description: 'Download as .voltustpack file for manual transfer',
    icon: FileDown,
  },
]

// JSON Tree component for manifest preview
function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [expanded, setExpanded] = React.useState(depth < 2)
  
  if (data === null) return <span className="text-orange-600 dark:text-orange-400">null</span>
  if (typeof data === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{data.toString()}</span>
  if (typeof data === 'number') return <span className="text-blue-600 dark:text-blue-400">{data}</span>
  if (typeof data === 'string') return <span className="text-green-600 dark:text-green-400">&quot;{data}&quot;</span>
  
  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-muted-foreground">[]</span>
    return (
      <span>
        <button onClick={() => setExpanded(!expanded)} className="hover:bg-muted rounded px-0.5">
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
        <button onClick={() => setExpanded(!expanded)} className="hover:bg-muted rounded px-0.5">
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

export default function DistributePackPage() {
  const params = useParams()
  const router = useRouter()
  const packId = params.id as string
  
  // Find the pack
  const pack = MOCK_TEST_PACKS.find(p => p.id === packId) || MOCK_TEST_PACKS[0]
  
  const [recipientMode, setRecipientMode] = React.useState<RecipientMode>('file')
  const [selectedKey, setSelectedKey] = React.useState(SIGNING_KEYS[0].id)
  const [tenantDid, setTenantDid] = React.useState('')
  const [partnerDid, setPartnerDid] = React.useState('')
  const [catalogCategory, setCatalogCategory] = React.useState('')
  const [isManifestOpen, setIsManifestOpen] = React.useState(true)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isGenerated, setIsGenerated] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  
  const selectedKeyData = SIGNING_KEYS.find(k => k.id === selectedKey)
  
  // Generate manifest
  const manifest = {
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
    contents: {
      suites: pack.contents.suites,
      scenarios: pack.contents.scenarios,
      cases: pack.contents.cases,
      fixtures: pack.contents.fixtures,
    },
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
  }
  
  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate signing
    await new Promise(resolve => setTimeout(resolve, 2000))
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
  
  const canDistribute = recipientMode === 'file' || 
    (recipientMode === 'tenant' && tenantDid) ||
    (recipientMode === 'partner' && partnerDid) ||
    (recipientMode === 'catalog' && catalogCategory)
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/test-repository/packs" className="hover:text-foreground transition-colors">
                Test Packs
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/test-repository/packs/${packId}`} className="hover:text-foreground transition-colors">
                {pack.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Distribute</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-indigo-600" />
                    <h1 className="page-title">{pack.name}</h1>
                    <Badge variant="outline">{pack.version}</Badge>
                  </div>
                  <p className="page-description mt-1">Configure distribution settings and export</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isGenerated ? (
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download .voltustpack</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!canDistribute || isGenerating}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Signing...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign & Generate</span>
                        <span className="sm:hidden">Sign</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Success Alert */}
            {isGenerated && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-200">Pack Signed Successfully</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Your test pack has been signed with {selectedKeyData?.name}. You can now download the .voltustpack file.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Distribution Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Distribution Mode
                </CardTitle>
                <CardDescription>
                  Choose how you want to distribute this test pack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={recipientMode} onValueChange={(v) => setRecipientMode(v as RecipientMode)}>
                  <StaggerGrid columns="grid-cols-1 sm:grid-cols-2" className="gap-3" fast>
                    {recipientModes.map((mode) => (
                      <Label
                        key={mode.id}
                        htmlFor={mode.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          recipientMode === mode.id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value={mode.id} id={mode.id} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <mode.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{mode.name}</span>
                          </div>
                          <p className="page-description mt-1">{mode.description}</p>
                        </div>
                      </Label>
                    ))}
                  </StaggerGrid>
                </RadioGroup>
                
                {/* Mode-specific inputs */}
                <div className="mt-4">
                  {recipientMode === 'tenant' && (
                    <div className="space-y-2">
                      <Label htmlFor="tenant-did">Recipient Tenant DID</Label>
                      <Input
                        id="tenant-did"
                        placeholder="did:voltus:tenant:0x..."
                        value={tenantDid}
                        onChange={(e) => setTenantDid(e.target.value)}
                      />
                      <p className="caption-text">
                        Enter the decentralized identifier of the target customer or workspace
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
                      />
                      <p className="caption-text">
                        Enter the decentralized identifier of the system integrator partner
                      </p>
                    </div>
                  )}
                  
                  {recipientMode === 'catalog' && (
                    <div className="space-y-2">
                      <Label htmlFor="catalog-category">Catalog Category</Label>
                      <Select value={catalogCategory} onValueChange={setCatalogCategory}>
                        <SelectTrigger id="catalog-category">
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
                      <p className="caption-text">
                        Choose a category for discovery in the VoltusWave global catalog
                      </p>
                    </div>
                  )}
                  
                  {recipientMode === 'file' && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        The pack will be downloaded as a .voltustpack file that can be manually imported by the recipient.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Signing Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Signing Key
                </CardTitle>
                <CardDescription>
                  Select the cryptographic key to sign this distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {SIGNING_KEYS.map((key) => (
                    <Label
                      key={key.id}
                      htmlFor={`key-${key.id}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedKey === key.id
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <input
                        type="radio"
                        id={`key-${key.id}`}
                        name="signing-key"
                        value={key.id}
                        checked={selectedKey === key.id}
                        onChange={() => setSelectedKey(key.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{key.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {key.type}
                          </Badge>
                        </div>
                        <p className="caption-text mt-1 truncate">
                          {key.did}
                        </p>
                      </div>
                    </Label>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pack Contents Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pack Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-4" fast>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="stat-value text-indigo-600">{pack.contents.suites}</div>
                    <div className="text-xs text-muted-foreground">Suites</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="stat-value text-indigo-600">{pack.contents.scenarios}</div>
                    <div className="text-xs text-muted-foreground">Scenarios</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="stat-value text-indigo-600">{pack.contents.cases}</div>
                    <div className="text-xs text-muted-foreground">Cases</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="stat-value text-indigo-600">{pack.contents.fixtures}</div>
                    <div className="text-xs text-muted-foreground">Fixtures</div>
                  </div>
                </StaggerGrid>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {pack.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Manifest Preview */}
            <Card>
              <Collapsible open={isManifestOpen} onOpenChange={setIsManifestOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        Manifest Preview
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyManifest()
                                }}
                              >
                                {copied ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy manifest</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {isManifestOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm overflow-auto max-h-[400px]">
                      <JsonTree data={manifest} />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            {/* Validation Warnings */}
            {recipientMode === 'catalog' && (
              <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">Public Distribution Notice</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  Publishing to the global catalog will make this pack discoverable by all VoltusWave users. 
                  Ensure no proprietary or customer-specific data is included.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
