'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Search,
  Download,
  Plus,
  Compass,
  ShoppingCart,
  Package,
  Factory,
  FileText,
  Play,
  Star,
  TrendingUp,
  Eye,
  Copy,
  MoreHorizontal,
  Grid3X3,
  List,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react'

// ---------- Data ----------

type CatalogItem = {
  id: string
  name: string
  type: 'Business Process' | 'Module Pack' | 'Industry Pack'
  module: string
  industry: string
  scenarios: number
  steps: number
  popularity: number
  lastUpdated: string
  status: 'Published' | 'Draft'
  rating: number
}

const CATALOG_ITEMS: CatalogItem[] = [
  { id: 'CAT-001', name: 'Order to Cash (O2C)', type: 'Business Process', module: 'SD', industry: 'All', scenarios: 24, steps: 186, popularity: 95, lastUpdated: '2024-01-15', status: 'Published', rating: 4.8 },
  { id: 'CAT-002', name: 'Procure to Pay (P2P)', type: 'Business Process', module: 'MM', industry: 'All', scenarios: 18, steps: 142, popularity: 88, lastUpdated: '2024-01-12', status: 'Published', rating: 4.7 },
  { id: 'CAT-003', name: 'Record to Report (R2R)', type: 'Business Process', module: 'FI', industry: 'All', scenarios: 15, steps: 98, popularity: 82, lastUpdated: '2024-01-10', status: 'Published', rating: 4.6 },
  { id: 'CAT-004', name: 'Hire to Retire (H2R)', type: 'Business Process', module: 'HR', industry: 'All', scenarios: 12, steps: 78, popularity: 75, lastUpdated: '2024-01-08', status: 'Published', rating: 4.5 },
  { id: 'CAT-005', name: 'Plan to Produce', type: 'Business Process', module: 'PP', industry: 'Manufacturing', scenarios: 20, steps: 156, popularity: 70, lastUpdated: '2024-01-05', status: 'Published', rating: 4.4 },
  { id: 'CAT-006', name: 'Warehouse Management', type: 'Module Pack', module: 'WM/EWM', industry: 'Logistics', scenarios: 16, steps: 124, popularity: 65, lastUpdated: '2024-01-03', status: 'Published', rating: 4.3 },
  { id: 'CAT-007', name: 'Retail Industry Pack', type: 'Industry Pack', module: 'IS-Retail', industry: 'Retail', scenarios: 22, steps: 168, popularity: 60, lastUpdated: '2023-12-28', status: 'Published', rating: 4.5 },
  { id: 'CAT-008', name: 'Utilities Industry Pack', type: 'Industry Pack', module: 'IS-U', industry: 'Utilities', scenarios: 14, steps: 92, popularity: 55, lastUpdated: '2023-12-20', status: 'Draft', rating: 4.2 },
]

// ---------- Helpers ----------

/**
 * Trigger a client-side file download for the given JSON payload.
 * Uses an in-memory Blob + temporary anchor element — no server round-trip needed.
 */
function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const typeBadgeStyles: Record<CatalogItem['type'], string> = {
  'Business Process': 'bg-brand-soft text-brand border-brand/30',
  'Module Pack': 'bg-muted text-foreground border-border',
  'Industry Pack': 'bg-muted text-foreground border-border',
}

// ---------- Page ----------

export default function FullCatalogPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [moduleFilter, setModuleFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  // Modal state
  const [previewItem, setPreviewItem] = React.useState<CatalogItem | null>(null)
  const [requestOpen, setRequestOpen] = React.useState(false)

  // Derived data
  const filteredItems = CATALOG_ITEMS.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    if (moduleFilter !== 'all' && item.module !== moduleFilter) return false
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    return true
  })

  const uniqueTypes = [...new Set(CATALOG_ITEMS.map((i) => i.type))]
  const uniqueModules = [...new Set(CATALOG_ITEMS.map((i) => i.module))]

  // ---------- Action handlers (wired to all three card actions + top-bar) ----------

  const handlePreview = (item: CatalogItem) => {
    setPreviewItem(item)
  }

  const handleImport = (item: CatalogItem) => {
    toast.success(`Imported "${item.name}"`, {
      description: `${item.scenarios} scenarios and ${item.steps} steps added to your Test Repository.`,
      action: {
        label: 'View',
        onClick: () => router.push('/test-repository'),
      },
    })
  }

  const handleDownload = (item: CatalogItem) => {
    const slug = item.id.toLowerCase()
    downloadJson(`${slug}-${item.module.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`, item)
    toast.success(`Downloaded "${item.name}"`, {
      description: 'Content pack saved as JSON to your device.',
    })
  }

  const handleExportAll = () => {
    downloadJson(`catalog-export-${new Date().toISOString().slice(0, 10)}.json`, {
      exportedAt: new Date().toISOString(),
      total: filteredItems.length,
      items: filteredItems,
    })
    toast.success('Catalog exported', {
      description: `${filteredItems.length} item${filteredItems.length === 1 ? '' : 's'} exported as JSON.`,
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setModuleFilter('all')
    setStatusFilter('all')
  }

  return (
    <AppShell currentApp="catalog">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="page-title">Full Catalog</h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Browse all available test content packs, scenarios, and templates.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleExportAll} className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
            <Button size="sm" onClick={() => setRequestOpen(true)} className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Request Content
            </Button>
          </div>
        </div>

        {/* Quick Nav Pills — match the rest of the catalog */}
        <nav
          role="tablist"
          aria-label="Catalog views"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {[
            { href: '/catalog', icon: Compass, label: 'All', active: true },
            { href: '/catalog/business-process', icon: ShoppingCart, label: 'By Process' },
            { href: '/catalog/module', icon: Package, label: 'By Module' },
            { href: '/catalog/industry', icon: Factory, label: 'By Industry' },
          ].map((nav) => {
            const Icon = nav.icon
            return (
              <Link
                key={nav.label}
                href={nav.href}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all shrink-0',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                  nav.active
                    ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/40',
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{nav.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="sm:">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search catalog…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs sm:text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 w-[140px] text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="h-9 w-[130px] text-xs">
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {uniqueModules.map((mod) => (
                      <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px] text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'h-9 w-9 inline-flex items-center justify-center transition-colors',
                      viewMode === 'grid'
                        ? 'bg-muted text-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'h-9 w-9 inline-flex items-center justify-center border-l border-border transition-colors',
                      viewMode === 'list'
                        ? 'bg-muted text-foreground'
                        : 'bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <Card className="border-border">
            <CardContent className="sm: text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-3">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold mb-1">No items found</h3>
              <p className="caption-text mb-4 max-w-sm mx-auto">
                Try adjusting your search or filter criteria to see more results.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="h-8 text-xs">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <CatalogCard
                key={item.id}
                item={item}
                onPreview={() => handlePreview(item)}
                onImport={() => handleImport(item)}
                onDownload={() => handleDownload(item)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Module</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Industry</TableHead>
                    <TableHead className="text-xs text-center hidden sm:table-cell">Scenarios</TableHead>
                    <TableHead className="text-xs text-center hidden lg:table-cell">Steps</TableHead>
                    <TableHead className="text-xs text-center">Rating</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-xs sm:text-sm">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('h-5 text-[10px] font-medium', typeBadgeStyles[item.type])}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-mono">
                          {item.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{item.industry}</TableCell>
                      <TableCell className="text-xs text-center tabular-nums hidden sm:table-cell">{item.scenarios}</TableCell>
                      <TableCell className="text-xs text-center tabular-nums hidden lg:table-cell">{item.steps}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1 text-xs tabular-nums">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {item.rating}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 text-[10px] font-medium',
                            item.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-muted text-muted-foreground border-border',
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RowMenu
                          onPreview={() => handlePreview(item)}
                          onImport={() => handleImport(item)}
                          onDownload={() => handleDownload(item)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Results count */}
        {filteredItems.length > 0 && (
          <p className="caption-text">
            Showing <span className="font-medium text-foreground">{filteredItems.length}</span>{' '}
            of <span className="font-medium text-foreground">{CATALOG_ITEMS.length}</span> items
          </p>
        )}
      </div>

      {/* Preview Dialog */}
      <PreviewDialog
        item={previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        onImport={() => {
          if (previewItem) {
            handleImport(previewItem)
            setPreviewItem(null)
          }
        }}
        onDownload={() => previewItem && handleDownload(previewItem)}
      />

      {/* Request Content Dialog */}
      <RequestContentDialog open={requestOpen} onOpenChange={setRequestOpen} />
    </AppShell>
  )
}

// ---------- Card (grid view) ----------

function CatalogCard({
  item,
  onPreview,
  onImport,
  onDownload,
}: {
  item: CatalogItem
  onPreview: () => void
  onImport: () => void
  onDownload: () => void
}) {
  return (
    <Card className="group relative border-border hover:border-brand/50 hover:shadow-md transition-all duration-200 flex flex-col">
      <CardContent className=".5 sm: flex flex-col flex-1">
        {/* Top row: type badge + menu (menu always visible on touch devices; reveals on hover on desktop) */}
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className={cn('h-5 px-1.5 text-[10px] font-medium', typeBadgeStyles[item.type])}
          >
            {item.type}
          </Badge>
          <RowMenu
            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
            onPreview={onPreview}
            onImport={onImport}
            onDownload={onDownload}
          />
        </div>

        {/* Title — clickable, opens preview */}
        <button
          type="button"
          onClick={onPreview}
          className="mt-2 text-left font-semibold text-sm leading-snug text-foreground hover:text-brand transition-colors focus-visible:outline-none focus-visible:text-brand"
        >
          {item.name}
        </button>

        {/* Module / industry chips */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-mono font-semibold bg-muted text-muted-foreground border-border">
            {item.module}
          </Badge>
          {item.industry !== 'All' && (
            <Badge variant="outline" className="h-4 px-1.5 text-[10px] font-medium bg-muted text-muted-foreground border-border">
              {item.industry}
            </Badge>
          )}
        </div>

        {/* Stats — pushed to the bottom so cards line up */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileText className="h-3 w-3 shrink-0" />
            <span className="tabular-nums">{item.scenarios}</span>
            <span>scenarios</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Play className="h-3 w-3 shrink-0" />
            <span className="tabular-nums">{item.steps}</span>
            <span>steps</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="font-semibold tabular-nums">{item.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span className="tabular-nums">{item.popularity}%</span>
            <span>popular</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------- Row menu (shared between grid + list views) ----------

function RowMenu({
  onPreview,
  onImport,
  onDownload,
  className,
}: {
  onPreview: () => void
  onImport: () => void
  onDownload: () => void
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Actions"
          className={cn('h-7 w-7 shrink-0', className)}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onPreview} className="text-xs">
          <Eye className="h-3.5 w-3.5 mr-2" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImport} className="text-xs">
          <Copy className="h-3.5 w-3.5 mr-2" />
          Import to Repository
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload} className="text-xs">
          <Download className="h-3.5 w-3.5 mr-2" />
          Download
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------- Preview Dialog ----------

function PreviewDialog({
  item,
  onOpenChange,
  onImport,
  onDownload,
}: {
  item: CatalogItem | null
  onOpenChange: (open: boolean) => void
  onImport: () => void
  onDownload: () => void
}) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {item && (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge
                    variant="outline"
                    className={cn('h-5 px-1.5 text-[10px] font-medium', typeBadgeStyles[item.type])}
                  >
                    {item.type}
                  </Badge>
                  <DialogTitle className="text-base sm:text-lg font-bold tracking-tight mt-1.5">
                    {item.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">
                    {item.id} · {item.module} {item.industry !== 'All' ? `· ${item.industry}` : ''}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-2 mt-2" fast>
              <PreviewStat icon={<FileText className="h-3.5 w-3.5" />} value={item.scenarios} label="Scenarios" />
              <PreviewStat icon={<Play className="h-3.5 w-3.5" />} value={item.steps} label="Steps" />
              <PreviewStat
                icon={<Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                value={item.rating}
                label="Rating"
              />
              <PreviewStat icon={<TrendingUp className="h-3.5 w-3.5" />} value={`${item.popularity}%`} label="Popular" />
            </StaggerGrid>

            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 text-[10px] font-medium',
                    item.status === 'Published'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Last updated
                </span>
                <span className="font-medium tabular-nums">{item.lastUpdated}</span>
              </div>
            </div>

            <DialogFooter className="mt-3 gap-2 sm:gap-2">
              <Button variant="outline" size="sm" onClick={onDownload} className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download
              </Button>
              <Button size="sm" onClick={onImport} className="h-8 text-xs">
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Import to Repository
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PreviewStat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">{icon}</div>
      <div className="mt-1 text-base font-bold tabular-nums leading-none">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

// ---------- Request Content Dialog ----------

function RequestContentDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState<'Business Process' | 'Module Pack' | 'Industry Pack'>('Business Process')
  const [description, setDescription] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const reset = () => {
    setName('')
    setType('Business Process')
    setDescription('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      toast.success('Request submitted', {
        description: `Our content team will review your request for "${name.trim()}".`,
      })
      setSubmitting(false)
      onOpenChange(false)
      reset()
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !submitting) reset(); onOpenChange(o) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">Request new content</DialogTitle>
          <DialogDescription className="text-xs">
            Tell our team about the test pack you&apos;d like to see added to the catalog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="req-name" className="text-xs">Content name</Label>
            <Input
              id="req-name"
              placeholder="e.g. Plant Maintenance Suite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs sm:text-sm"
              disabled={submitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-type" className="text-xs">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)} disabled={submitting}>
              <SelectTrigger id="req-type" className="h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business Process">Business Process</SelectItem>
                <SelectItem value="Module Pack">Module Pack</SelectItem>
                <SelectItem value="Industry Pack">Industry Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-desc" className="text-xs">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="req-desc"
              placeholder="Outline the scenarios, modules, or T-codes you need covered…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs sm:text-sm min-h-[88px]"
              disabled={submitting}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs min-w-[110px]" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
