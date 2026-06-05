'use client'

import * as React from 'react'
import { 
  Package, 
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Globe,
  Building2,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  MoreHorizontal,
  Eye,
  RefreshCw,
  GitCompare,
  Trash2,
  Search,
  Filter,
  ArrowUpCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { MOCK_IMPORTED_PACKS, type ImportedTestPack, type SignatureVerificationState } from '@/lib/mock-data'

// Helper functions
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

function getSignatureIcon(state: SignatureVerificationState) {
  switch (state) {
    case 'verified':
      return <ShieldCheck className="h-4 w-4 text-emerald-500" />
    case 'unverified':
      return <ShieldAlert className="h-4 w-4 text-amber-500" />
    case 'failed':
      return <ShieldX className="h-4 w-4 text-red-500" />
  }
}

function getSignatureLabel(state: SignatureVerificationState) {
  switch (state) {
    case 'verified':
      return 'Verified'
    case 'unverified':
      return 'Unverified'
    case 'failed':
      return 'Failed'
  }
}

function getSignatureBadgeVariant(state: SignatureVerificationState) {
  switch (state) {
    case 'verified':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
    case 'unverified':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
    case 'failed':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
  }
}

// Stats card component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  variant = 'default' 
}: { 
  label: string
  value: number
  icon: React.ElementType
  variant?: 'default' | 'warning' | 'success'
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="micro-label">{label}</p>
            <p className="stat-value mt-1">{value}</p>
          </div>
          <div className={cn(
            "p-2 rounded-lg",
            variant === 'warning' && "bg-amber-500/10",
            variant === 'success' && "bg-emerald-500/10",
            variant === 'default' && "bg-muted"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              variant === 'warning' && "text-amber-500",
              variant === 'success' && "text-emerald-500",
              variant === 'default' && "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContentStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[3.25rem] text-center">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mb-1 shrink-0" />
      <p className="text-sm font-semibold tabular-nums leading-none">{value}</p>
      <p className="section-description text-[10px] mt-0.5">{label}</p>
    </div>
  )
}

function PackStatusLine({ pack }: { pack: ImportedTestPack }) {
  return (
    <div className="min-h-[1.375rem] text-xs leading-none">
      {pack.signature_state === 'failed' ? (
        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          Signature verification failed
        </span>
      ) : pack.available_update ? (
        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
          <ArrowUpCircle className="h-3 w-3 shrink-0" />
          Update to {pack.available_update.version} available
        </span>
      ) : (
        <span className="text-muted-foreground/50">Up to date</span>
      )}
    </div>
  )
}

// Pack card component
function ImportedPackCard({
  pack,
  onViewContents,
  onUpdate,
  onCompare,
  onRemove,
}: {
  pack: ImportedTestPack
  onViewContents: () => void
  onUpdate: () => void
  onCompare: () => void
  onRemove: () => void
}) {
  const iconTone =
    pack.provenance.source === 'voltuswave'
      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
      : 'bg-muted text-muted-foreground'

  return (
    <Card className="group h-full flex flex-col hover:border-primary/50 hover:shadow-[var(--shadow-sm)] transition-all">
      <CardHeader className="shrink-0 space-y-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              iconTone,
            )}
          >
            <Package className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <CardTitle className="text-base font-semibold leading-snug line-clamp-2 min-h-[2.75rem]">
              {pack.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-1.5 mt-2 min-h-[1.375rem]">
              <Badge variant="outline" className="font-mono text-[11px] h-5 px-1.5">
                {pack.version}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground -mr-1"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewContents}>
                <Eye className="h-4 w-4 mr-2" />
                View Contents
              </DropdownMenuItem>
              {pack.available_update && (
                <DropdownMenuItem onClick={onUpdate}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update to {pack.available_update.version}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onCompare}>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare to Local
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-3 min-h-[1.75rem]">
          {pack.provenance.source === 'voltuswave' ? (
            <Badge
              variant="secondary"
              className="gap-1 text-[11px] h-5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
            >
              <Globe className="h-3 w-3" />
              VoltusWave Global
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 text-[11px] h-5">
              <Building2 className="h-3 w-3" />
              {pack.provenance.partner_name}
            </Badge>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={cn('gap-1 text-[11px] h-5', getSignatureBadgeVariant(pack.signature_state))}
                >
                  {getSignatureIcon(pack.signature_state)}
                  {getSignatureLabel(pack.signature_state)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {pack.signature_state === 'verified' && pack.signature_did && (
                  <p className="text-xs">Signed by: {pack.signature_did}</p>
                )}
                {pack.signature_state === 'unverified' && (
                  <p className="text-xs">Signature not yet verified</p>
                )}
                {pack.signature_state === 'failed' && (
                  <p className="text-xs">Signature verification failed - use with caution</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <CardDescription className="text-xs leading-relaxed line-clamp-2 min-h-[2.5rem] mt-3 mb-4">
          {pack.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-4 gap-1 rounded-lg border border-border/50 bg-muted/30 p-2.5 min-h-[4.5rem]">
          <ContentStat icon={Layers} value={pack.contents.suites} label="Suites" />
          <ContentStat icon={FileText} value={pack.contents.scenarios} label="Scenarios" />
          <ContentStat icon={ClipboardCheck} value={pack.contents.cases} label="Cases" />
          <ContentStat icon={Database} value={pack.contents.fixtures} label="Fixtures" />
        </div>

        <div className="mt-auto space-y-3">
          <PackStatusLine pack={pack} />

          <div className="flex items-center gap-1 pt-3 border-t border-border text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Updated {formatRelativeTime(pack.last_updated)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ImportedTestPacksPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')
  const [signatureFilter, setSignatureFilter] = React.useState<string>('all')
  const [updateDialogPack, setUpdateDialogPack] = React.useState<ImportedTestPack | null>(null)
  
  const filteredPacks = MOCK_IMPORTED_PACKS.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pack.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = sourceFilter === 'all' || pack.provenance.source === sourceFilter
    const matchesSignature = signatureFilter === 'all' || pack.signature_state === signatureFilter
    
    return matchesSearch && matchesSource && matchesSignature
  })
  
  const packsWithUpdates = MOCK_IMPORTED_PACKS.filter(p => p.available_update).length
  const verifiedPacks = MOCK_IMPORTED_PACKS.filter(p => p.signature_state === 'verified').length

  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Imported Test Packs</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Test Packs imported from VoltusWave global catalog or SI partners.
                </p>
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Browse Catalog</span>
                <span className="sm:hidden">Catalog</span>
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 md:gap-4 mt-4 md:mt-6" fast>
              <StatCard 
                label="Imported Packs" 
                value={MOCK_IMPORTED_PACKS.length} 
                icon={Package}
              />
              <StatCard 
                label="Updates Available" 
                value={packsWithUpdates} 
                icon={ArrowUpCircle}
                variant="warning"
              />
              <StatCard 
                label="Verified" 
                value={verifiedPacks} 
                icon={ShieldCheck}
                variant="success"
              />
              <StatCard 
                label="Total Scenarios" 
                value={MOCK_IMPORTED_PACKS.reduce((acc, p) => acc + p.contents.scenarios, 0)} 
                icon={FileText}
              />
            </StaggerGrid>
          </div>
          
          {/* Filters */}
          <div className="px-4 md:px-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search imported packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="voltuswave">VoltusWave Global</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={signatureFilter} onValueChange={setSignatureFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Shield className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Signature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Signatures</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Card Grid */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <StaggerGrid
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            className="gap-4 items-stretch"
            fast
          >
            {filteredPacks.map(pack => (
              <ImportedPackCard
                key={pack.id}
                pack={pack}
                onViewContents={() => {}}
                onUpdate={() => setUpdateDialogPack(pack)}
                onCompare={() => {}}
                onRemove={() => {}}
              />
            ))}
          </StaggerGrid>
          
          {filteredPacks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No imported packs found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Update Dialog */}
      <Dialog open={!!updateDialogPack} onOpenChange={() => setUpdateDialogPack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Available</DialogTitle>
            <DialogDescription>
              A new version of this test pack is available.
            </DialogDescription>
          </DialogHeader>
          
          {updateDialogPack?.available_update && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Current Version</p>
                  <p className="caption-text">{updateDialogPack.version}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">New Version</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {updateDialogPack.available_update.version}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Changelog</p>
                <p className="page-description">
                  {updateDialogPack.available_update.changelog}
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Updating will replace your imported copy. Any local modifications will need to be re-applied.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setUpdateDialogPack(null)}>
              Cancel
            </Button>
            <Button onClick={() => setUpdateDialogPack(null)} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Update Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
