'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Package, 
  Plus, 
  Download,
  CheckCircle2,
  FileQuestion,
  Users,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  MoreHorizontal,
  Eye,
  Copy,
  Send,
  Trash2,
  Shield,
  Building2,
  Handshake,
  Search,
  Filter,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TestPackWizard } from '@/components/test-pack-wizard'
import { DeleteTestPackDialog } from '@/components/test-repository/delete-test-pack-dialog'

import { MOCK_TEST_PACKS, type TestPack, type DistributionStatus } from '@/lib/mock-data'

// Distribution status styles
const statusStyles: Record<DistributionStatus, { bg: string; text: string; icon: React.ElementType }> = {
  Draft: { bg: 'bg-slate-100', text: 'text-slate-700', icon: FileQuestion },
  Published: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
  Distributed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Send },
}

// Signature state styles
const signatureStyles = {
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Verified' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  unsigned: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Unsigned' },
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

function TestPackCard({
  pack,
  onDelete,
}: {
  pack: TestPack
  onDelete: (pack: TestPack) => void
}) {
  const statusStyle = statusStyles[pack.distribution_status]
  const sigStyle = signatureStyles[pack.signature_state]
  const StatusIcon = statusStyle.icon

  const iconTone =
    pack.distribution_status === 'Distributed'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : pack.distribution_status === 'Published'
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        : 'bg-muted text-muted-foreground'

  return (
    <Card className="group h-full flex flex-col hover:shadow-[var(--shadow-sm)] transition-all hover:border-brand/30">
      <CardHeader className="shrink-0 space-y-0">
        {/* Title row — fixed height so cards align across the grid */}
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
              <Badge className={cn('text-[11px] h-5 gap-1', statusStyle.bg, statusStyle.text)}>
                <StatusIcon className="h-3 w-3" />
                {pack.distribution_status}
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
              <DropdownMenuItem asChild>
                <Link href={`/test-repository/packs/${pack.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/test-repository/packs/${pack.id}/clone`}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone Pack
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/test-repository/packs/${pack.id}/distribute`}>
                  <Users className="h-4 w-4 mr-2" />
                  Distribute
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onDelete(pack)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="flex items-center justify-between gap-3 text-xs">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-md shrink-0',
                      sigStyle.bg,
                      sigStyle.text,
                    )}
                  >
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">{sigStyle.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {pack.signature_state === 'verified'
                    ? `Signed by ${pack.signature_did?.slice(0, 20)}…`
                    : pack.signature_state === 'pending'
                      ? 'Signature pending verification'
                      : 'Not yet signed'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {pack.recipients.length > 0 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3 shrink-0" />
                      <span>
                        {pack.recipients.length} recipient
                        {pack.recipients.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {pack.recipients.map((r) => (
                        <div key={r.id} className="flex items-center gap-2">
                          {r.type === 'customer' ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <Handshake className="h-3 w-3" />
                          )}
                          <span>{r.name}</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span className="text-muted-foreground/60">No recipients</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border text-xs text-muted-foreground">
            <span className="truncate">by {pack.created_by}</span>
            <span className="shrink-0 tabular-nums">
              {pack.published_at
                ? new Date(pack.published_at).toLocaleDateString()
                : 'Draft'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TestPacksPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [isWizardOpen, setIsWizardOpen] = React.useState(false)
  const [hiddenPackIds, setHiddenPackIds] = React.useState<string[]>([])
  const [deletePack, setDeletePack] = React.useState<TestPack | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const visiblePacks = MOCK_TEST_PACKS.filter((p) => !hiddenPackIds.includes(p.id))

  const filteredPacks = visiblePacks.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pack.distribution_status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  // Stats
  const totalPacks = visiblePacks.length
  const publishedPacks = visiblePacks.filter(p => p.distribution_status === 'Published').length
  const distributedPacks = visiblePacks.filter(p => p.distribution_status === 'Distributed').length
  const totalDownloads = visiblePacks.reduce((sum, p) => sum + p.download_count, 0)

  const handleDeleteRequest = (pack: TestPack) => {
    setDeletePack(pack)
    setDeleteOpen(true)
  }

  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Test Packs</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Packaged distributable test content. Test Packs travel between customers and SI partners with signature-verified provenance.
                </p>
              </div>
              <Button onClick={() => setIsWizardOpen(true)} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Test Pack</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 md:gap-4 mt-4 md:mt-6" fast>
              <Card className="bg-muted/30">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="stat-value">{totalPacks}</p>
                      <p className="caption-text">Total Packs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="stat-value">{publishedPacks}</p>
                      <p className="caption-text">Published</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <Send className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="stat-value">{distributedPacks}</p>
                      <p className="caption-text">Distributed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Download className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="stat-value">{totalDownloads}</p>
                      <p className="caption-text">Total Downloads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerGrid>
          </div>
          
          {/* Filters */}
          <div className="px-4 md:px-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Distributed">Distributed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Card Grid — items-stretch ensures equal-height cards per row */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <StaggerGrid
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            className="gap-4 items-stretch"
            fast
          >
            {filteredPacks.map((pack) => (
              <TestPackCard key={pack.id} pack={pack} onDelete={handleDeleteRequest} />
            ))}
          </StaggerGrid>
          
          {filteredPacks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No test packs found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Test Pack Composition Wizard */}
      <TestPackWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />

      <DeleteTestPackDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        pack={deletePack}
        onDeleted={(packId) => setHiddenPackIds((ids) => [...ids, packId])}
      />
    </AppShell>
  )
}
