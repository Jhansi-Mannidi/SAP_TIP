'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Plus,
  Search,
  MoreHorizontal,
  Database,
  FileText,
  Layers,
  Copy,
  Archive,
  ExternalLink,
  Download,
  AlertTriangle,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Globe,
  Building2,
  Briefcase,
  X,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_DATA_FIXTURES, type DataFixture, type DataKind, type PIILevel, type CustomerScope } from '@/lib/mock-data'
import { formatDistanceToNow, isPast, differenceInDays } from 'date-fns'
import { GenerateFromSystemSheet } from '@/components/generate-from-system-sheet'
import { NewFixtureSheet, type FixtureSheetMode } from '@/components/new-fixture-sheet'
import { TestInSystemSheet } from '@/components/test-in-system-sheet'
import { MarkDeprecatedDialog } from '@/components/mark-deprecated-dialog'

// Theme-safe tonal classes — render correctly in both light and dark mode.
// Data kind labels and icons
const dataKindConfig: Record<DataKind, { label: string; icon: React.ElementType; color: string }> = {
  master: { label: 'Master', icon: Database, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 border-transparent' },
  transactional: { label: 'Transactional', icon: FileText, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 border-transparent' },
  mixed: { label: 'Mixed', icon: Layers, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-inset ring-purple-500/20 border-transparent' },
}

// PII level config
const piiLevelConfig: Record<PIILevel, { label: string; icon: React.ElementType; color: string }> = {
  none: { label: 'None', icon: ShieldCheck, color: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border border-transparent' },
  low: { label: 'Low', icon: Shield, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 border-transparent' },
  medium: { label: 'Medium', icon: ShieldAlert, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20 border-transparent' },
  high: { label: 'High', icon: ShieldX, color: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-inset ring-red-500/20 border-transparent' },
}

// Tenant scope config
const tenantScopeConfig: Record<CustomerScope, { label: string; icon: React.ElementType; color: string }> = {
  Global: { label: 'Global', icon: Globe, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20 border-transparent' },
  Customer: { label: 'Customer', icon: Building2, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 border-transparent' },
  Workspace: { label: 'Workspace', icon: Briefcase, color: 'bg-muted text-foreground ring-1 ring-inset ring-border border-transparent' },
}

// SAP Object Types for filter
const sapObjectTypes = ['KNA1', 'LFA1', 'MARA', 'VBAK', 'EKKO', 'SKA1', 'MIXED']

// Theme-adaptive metadata row used inside the fixture detail Sheet.
// Keeps a consistent grid alignment + uses semantic foreground tokens so it
// renders cleanly in both light and dark themes.
function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-background hover:bg-muted/40 transition-colors">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center min-w-0">{children}</div>
    </div>
  )
}

export default function DataFixturesPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [fixtures, setFixtures] = React.useState<DataFixture[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [dataKindFilter, setDataKindFilter] = React.useState<string>('all')
  const [objectTypeFilter, setObjectTypeFilter] = React.useState<string>('all')
  const [tenantScopeFilter, setTenantScopeFilter] = React.useState<string>('all')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [piiFilter, setPiiFilter] = React.useState<string>('all')
  const [selectedFixture, setSelectedFixture] = React.useState<DataFixture | null>(null)
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false)
  const [isNewOpen, setIsNewOpen] = React.useState(false)
  const [newSheetMode, setNewSheetMode] = React.useState<FixtureSheetMode>('create')
  const [newSheetSeed, setNewSheetSeed] = React.useState<DataFixture | null>(null)
  const [testFixture, setTestFixture] = React.useState<DataFixture | null>(null)
  const [deprecateFixture, setDeprecateFixture] = React.useState<DataFixture | null>(null)

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFixtures(MOCK_DATA_FIXTURES)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter fixtures
  const filteredFixtures = React.useMemo(() => {
    return fixtures.filter(fixture => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          fixture.code.toLowerCase().includes(query) ||
          fixture.name.toLowerCase().includes(query) ||
          fixture.sap_object_type.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      
      // Data kind filter
      if (dataKindFilter !== 'all' && fixture.data_kind !== dataKindFilter) return false
      
      // Object type filter
      if (objectTypeFilter !== 'all' && fixture.sap_object_type !== objectTypeFilter) return false
      
      // Tenant scope filter
      if (tenantScopeFilter !== 'all' && fixture.tenant_scope !== tenantScopeFilter) return false
      
      // State filter
      if (stateFilter !== 'all' && fixture.state !== stateFilter) return false
      
      // PII filter
      if (piiFilter !== 'all' && fixture.has_pii !== piiFilter) return false
      
      return true
    })
  }, [fixtures, searchQuery, dataKindFilter, objectTypeFilter, tenantScopeFilter, stateFilter, piiFilter])

  const hasActiveFilters = dataKindFilter !== 'all' || objectTypeFilter !== 'all' || 
    tenantScopeFilter !== 'all' || stateFilter !== 'all' || piiFilter !== 'all' || searchQuery

  const clearFilters = () => {
    setSearchQuery('')
    setDataKindFilter('all')
    setObjectTypeFilter('all')
    setTenantScopeFilter('all')
    setStateFilter('all')
    setPiiFilter('all')
  }

  // Expiration status helper
  const getExpirationStatus = (expiresAt: string | null) => {
    if (!expiresAt) return { label: 'No expiry', color: 'text-muted-foreground', isUrgent: false }
    
    const expiryDate = new Date(expiresAt)
    const isExpired = isPast(expiryDate)
    const daysUntil = differenceInDays(expiryDate, new Date())
    
    if (isExpired) {
      return { label: 'Expired', color: 'text-destructive font-medium', isUrgent: true }
    } else if (daysUntil <= 30) {
      return { 
        label: `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`, 
        color: 'text-amber-600 dark:text-amber-400 font-medium', 
        isUrgent: true 
      }
    } else {
      return { 
        label: formatDistanceToNow(expiryDate, { addSuffix: true }), 
        color: 'text-muted-foreground', 
        isUrgent: false 
      }
    }
  }

  return (
    <AppShell currentApp="test-repository">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <div className="border-b bg-background">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="page-title">Data Fixtures</h1>
                <p className="page-description mt-1">
                  Named, reusable test data sets. Used in Scenarios as test inputs and during data-prep Tasks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setIsGenerateOpen(true)} className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate from System
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setNewSheetMode('create')
                    setNewSheetSeed(null)
                    setIsNewOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Fixture
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 pb-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fixtures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            <Select value={dataKindFilter} onValueChange={setDataKindFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Data Kind" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kinds</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={objectTypeFilter} onValueChange={setObjectTypeFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="SAP Object" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Objects</SelectItem>
                {sapObjectTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={tenantScopeFilter} onValueChange={setTenantScopeFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Workspace">Workspace</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={piiFilter} onValueChange={setPiiFilter}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="PII Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All PII</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="w-[140px]">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Data Kind</TableHead>
                <TableHead className="w-[100px]">SAP Object</TableHead>
                <TableHead className="w-[100px]">Scope</TableHead>
                <TableHead className="w-[100px]">PII Level</TableHead>
                <TableHead className="w-[80px]">Version</TableHead>
                <TableHead className="w-[100px]">State</TableHead>
                <TableHead className="w-[140px]">Expiration</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredFixtures.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={10}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold">No fixtures found</h3>
                      <p className="page-description mt-1">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters or search query'
                          : 'Create your first data fixture to get started'
                        }
                      </p>
                      {!hasActiveFilters && (
                        <Button
                          className="mt-4 gap-2"
                          onClick={() => {
                            setNewSheetMode('create')
                            setNewSheetSeed(null)
                            setIsNewOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          New Fixture
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFixtures.map(fixture => {
                  const kindConfig = dataKindConfig[fixture.data_kind]
                  const piiConfig = piiLevelConfig[fixture.has_pii]
                  const scopeConfig = tenantScopeConfig[fixture.tenant_scope]
                  const expiration = getExpirationStatus(fixture.expires_at)
                  const KindIcon = kindConfig.icon
                  const PiiIcon = piiConfig.icon
                  const ScopeIcon = scopeConfig.icon
                  
                  return (
                    <TableRow 
                      key={fixture.id}
                      className={cn(
                        'cursor-pointer hover:bg-muted/50',
                        fixture.tenant_scope === 'Global' && 'bg-indigo-500/5'
                      )}
                      onClick={() => setSelectedFixture(fixture)}
                    >
                      <TableCell>
                        <span className="font-mono text-xs text-primary font-medium">
                          {fixture.code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{fixture.name}</p>
                          <p className="caption-text line-clamp-1">
                            {fixture.record_count} records
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1', kindConfig.color)}>
                          <KindIcon className="h-3 w-3" />
                          {kindConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {fixture.sap_object_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1', scopeConfig.color)}>
                          <ScopeIcon className="h-3 w-3" />
                          {scopeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('gap-1', piiConfig.color)}>
                          <PiiIcon className="h-3 w-3" />
                          {piiConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">
                          {fixture.version}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={fixture.state} />
                      </TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-1 text-xs', expiration.color)}>
                          {expiration.isUrgent && <AlertTriangle className="h-3 w-3" />}
                          <span>{expiration.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedFixture(fixture)
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setNewSheetMode('clone')
                                setNewSheetSeed(fixture)
                                setIsNewOpen(true)
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Clone
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setTestFixture(fixture)
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Test in System
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeprecateFixture(fixture)
                              }}
                              disabled={fixture.state === 'Deprecated'}
                              className="text-amber-600 dark:text-amber-400 focus:text-amber-600 dark:focus:text-amber-400"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Mark Deprecated
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Fixture Detail Sheet — sticky header / scrollable body / sticky footer */}
      <Sheet open={!!selectedFixture} onOpenChange={(open) => !open && setSelectedFixture(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col gap-0"
        >
          {selectedFixture && (
            <>
              {/* Sticky header */}
              <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      'gap-1 font-medium',
                      dataKindConfig[selectedFixture.data_kind].color,
                    )}
                  >
                    {React.createElement(
                      dataKindConfig[selectedFixture.data_kind].icon,
                      { className: 'h-3 w-3' },
                    )}
                    {dataKindConfig[selectedFixture.data_kind].label}
                  </Badge>
                  <StatusBadge status={selectedFixture.state} />
                </div>
                <SheetTitle className="text-base sm:text-lg font-semibold text-foreground text-balance leading-tight">
                  {selectedFixture.name}
                </SheetTitle>
                <SheetDescription className="font-mono text-[11px] text-muted-foreground">
                  {selectedFixture.code}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
                {/* Description */}
                <section className="space-y-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedFixture.description}
                  </p>
                </section>

                {/* Stats Grid */}
                <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
                  <div className="rounded-lg border border-border bg-muted/30 p-3.5">
                    <p className="page-description text-[10px] tracking-[0.08em]">
                      Records
                    </p>
                    <p className="stat-value mt-1">
                      {selectedFixture.record_count.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3.5">
                    <p className="page-description text-[10px] tracking-[0.08em]">
                      Used In
                    </p>
                    <p className="stat-value mt-1">
                      {selectedFixture.used_in_scenarios.length}
                      <span className="text-xs font-normal text-muted-foreground ml-1.5">
                        scenarios
                      </span>
                    </p>
                  </div>
                </StaggerGrid>

                {/* Metadata */}
                <section className="space-y-1">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground pb-1">
                    Metadata
                  </h4>
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    <DetailRow label="SAP Object Type">
                      <Badge
                        variant="outline"
                        className="font-mono text-[11px] bg-muted/60"
                      >
                        {selectedFixture.sap_object_type}
                      </Badge>
                    </DetailRow>
                    <DetailRow label="Tenant Scope">
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1',
                          tenantScopeConfig[selectedFixture.tenant_scope].color,
                        )}
                      >
                        {React.createElement(
                          tenantScopeConfig[selectedFixture.tenant_scope].icon,
                          { className: 'h-3 w-3' },
                        )}
                        {selectedFixture.tenant_scope}
                      </Badge>
                    </DetailRow>
                    <DetailRow label="PII Level">
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1',
                          piiLevelConfig[selectedFixture.has_pii].color,
                        )}
                      >
                        {React.createElement(
                          piiLevelConfig[selectedFixture.has_pii].icon,
                          { className: 'h-3 w-3' },
                        )}
                        {piiLevelConfig[selectedFixture.has_pii].label}
                      </Badge>
                    </DetailRow>
                    <DetailRow label="Version">
                      <span className="font-mono text-xs text-foreground tabular-nums">
                        v{selectedFixture.version}
                      </span>
                    </DetailRow>
                    <DetailRow label="Expiration">
                      <span
                        className={cn(
                          'text-xs',
                          getExpirationStatus(selectedFixture.expires_at).color ||
                            'text-foreground',
                        )}
                      >
                        {getExpirationStatus(selectedFixture.expires_at).label}
                      </span>
                    </DetailRow>
                    <DetailRow label="Created By">
                      <span className="text-xs text-foreground">
                        {selectedFixture.created_by}
                      </span>
                    </DetailRow>
                  </div>
                </section>

                {/* Scenarios using this fixture */}
                {selectedFixture.used_in_scenarios.length > 0 && (
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Used in Scenarios ({selectedFixture.used_in_scenarios.length})
                    </h4>
                    <div className="space-y-1.5">
                      {selectedFixture.used_in_scenarios.map(scenarioId => (
                        <div
                          key={scenarioId}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                        >
                          <span className="inline-flex items-center rounded-md bg-muted border border-border px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                            {scenarioId}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 text-[11px] shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sticky footer */}
              <div className="border-t border-border px-5 sm:px-6 py-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5"
                  onClick={() => {
                    setNewSheetMode('clone')
                    setNewSheetSeed(selectedFixture)
                    setSelectedFixture(null)
                    setIsNewOpen(true)
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Clone
                </Button>
                <Button size="sm" className="h-9 gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Edit Fixture
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Generate from System — redesigned */}
      <GenerateFromSystemSheet
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
      />

      {/* Create / Clone Fixture */}
      <NewFixtureSheet
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        mode={newSheetMode}
        initialData={newSheetSeed}
      />

      {/* Test in System */}
      <TestInSystemSheet
        open={!!testFixture}
        onOpenChange={(open) => !open && setTestFixture(null)}
        fixture={testFixture}
      />

      {/* Mark Deprecated */}
      <MarkDeprecatedDialog
        open={!!deprecateFixture}
        onOpenChange={(open) => !open && setDeprecateFixture(null)}
        fixture={deprecateFixture}
      />
    </AppShell>
  )
}
