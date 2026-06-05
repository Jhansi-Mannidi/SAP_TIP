'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  Plus,
  Download,
  MoreHorizontal,
  LibraryBig,
  Play,
  Copy,
  Calendar,
  FileDown,
  Archive,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { EntityCodeLink } from '@/components/entity-code-link'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FilterDrawer, ActiveFilters, type FilterConfig } from '@/components/filter-drawer'
import { ImportTestPackDialog } from '@/components/import-test-pack-dialog'
import { NewSuiteDialog } from '@/components/new-suite-dialog'
import { useFilters } from '@/lib/filter-utils'
import { cn } from '@/lib/utils'
import { MOCK_TEST_SUITES, type TestSuiteState } from '@/lib/mock-data'

// Filter chip type
type FilterChip = {
  id: string
  label: string
  filter: (suite: typeof MOCK_TEST_SUITES[0]) => boolean
}

const savedFilterChips: FilterChip[] = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'mine', label: 'Mine', filter: (s) => s.owner === 'P.Sharma' },
  { id: 'recently-run', label: 'Recently Run', filter: (s) => s.last_executed !== null },
  { id: 'by-module-sd', label: 'By SAP Module', filter: (s) => s.modules.includes('SD') },
  { id: 'by-bp-otc', label: 'By Business Process', filter: (s) => s.business_processes.includes('OTC') },
  { id: 'failing', label: 'Failing > 5%', filter: (s) => s.last_pass_rate_pct < 95 && s.last_pass_rate_pct > 0 },
]

// Format relative time
function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

function formatAbsoluteTime(dateString: string | null): string {
  if (!dateString) return 'Never executed'
  return new Date(dateString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Delta arrow component
function DeltaArrow({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous
  if (delta === 0) return <Minus className="h-3 w-3 text-muted-foreground" />
  if (delta > 0) return <ArrowUp className="h-3 w-3 text-emerald-600" />
  return <ArrowDown className="h-3 w-3 text-red-600" />
}

// Mini progress bar
function MiniProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-12 rounded-full bg-muted overflow-hidden', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all',
          value >= 95 ? 'bg-emerald-500' : value >= 80 ? 'bg-amber-500' : 'bg-red-500'
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// Skeleton loading row
function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-12" /><Skeleton className="h-5 w-12" /></div></TableCell>
      <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-10" /><Skeleton className="h-5 w-10" /></div></TableCell>
      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><div className="flex items-center gap-2"><Skeleton className="h-1.5 w-12" /><Skeleton className="h-4 w-12" /></div></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

// Empty state component
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <LibraryBig className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No Test Suites match these filters</h3>
      <p className="page-description mb-6 max-w-md">
        Adjust filters or browse the global catalog to import standard Suites.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
        <Button>
          Browse Catalog
        </Button>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading test suites</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to fetch test suites from the server. Please try again.</span>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

// Initial values for the advanced filter drawer (drives FilterDrawer + useFilters)
const INITIAL_ADVANCED_FILTERS = {
  states: [] as string[],
  modules: [] as string[],
  businessProcesses: [] as string[],
}

export default function TestSuitesListPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [hasWritePermission] = useState(true) // Simulated permission state
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isNewSuiteOpen, setIsNewSuiteOpen] = useState(false)

  // Available filter options (computed once)
  const allModules = useMemo(
    () => Array.from(new Set(MOCK_TEST_SUITES.flatMap(s => s.modules))),
    [],
  )
  const allBPs = useMemo(
    () => Array.from(new Set(MOCK_TEST_SUITES.flatMap(s => s.business_processes))),
    [],
  )
  const allStates: TestSuiteState[] = ['Draft', 'Published', 'Deprecated', 'Archived']

  // Per-option counts so the drawer can show how many suites match each value
  const moduleCounts = useMemo(() => {
    const map = new Map<string, number>()
    MOCK_TEST_SUITES.forEach(s => s.modules.forEach(m => map.set(m, (map.get(m) ?? 0) + 1)))
    return map
  }, [])
  const bpCounts = useMemo(() => {
    const map = new Map<string, number>()
    MOCK_TEST_SUITES.forEach(s =>
      s.business_processes.forEach(bp => map.set(bp, (map.get(bp) ?? 0) + 1)),
    )
    return map
  }, [])
  const stateCounts = useMemo(() => {
    const map = new Map<string, number>()
    MOCK_TEST_SUITES.forEach(s => map.set(s.state, (map.get(s.state) ?? 0) + 1))
    return map
  }, [])

  // Filter configuration consumed by the shared <FilterDrawer />
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        key: 'states',
        label: 'State',
        type: 'multiselect',
        options: allStates.map(s => ({
          value: s,
          label: s,
          count: stateCounts.get(s) ?? 0,
        })),
      },
      {
        key: 'modules',
        label: 'SAP Modules',
        type: 'multiselect',
        options: allModules.map(m => ({
          value: m,
          label: m,
          count: moduleCounts.get(m) ?? 0,
        })),
      },
      {
        key: 'businessProcesses',
        label: 'Business Processes',
        type: 'multiselect',
        options: allBPs.map(bp => ({
          value: bp,
          label: bp,
          count: bpCounts.get(bp) ?? 0,
        })),
      },
    ],
    [allStates, allModules, allBPs, stateCounts, moduleCounts, bpCounts],
  )

  // Advanced filter state driven by the shared hook (matches dashboard pattern)
  const {
    filters: advancedFilters,
    setFilter: setAdvancedFilter,
    resetFilters: resetAdvancedFilters,
    clearFilter: clearAdvancedFilter,
    activeFilterCount,
  } = useFilters(INITIAL_ADVANCED_FILTERS)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filtered and searched suites
  const filteredSuites = useMemo(() => {
    let result = [...MOCK_TEST_SUITES]

    // Apply saved filter chip
    const chipFilter = savedFilterChips.find(c => c.id === activeFilter)
    if (chipFilter) {
      result = result.filter(chipFilter.filter)
    }

    // Apply advanced filters
    if (advancedFilters.states.length > 0) {
      result = result.filter(s => advancedFilters.states.includes(s.state))
    }
    if (advancedFilters.modules.length > 0) {
      result = result.filter(s => s.modules.some(m => advancedFilters.modules.includes(m)))
    }
    if (advancedFilters.businessProcesses.length > 0) {
      result = result.filter(s =>
        s.business_processes.some(bp => advancedFilters.businessProcesses.includes(bp)),
      )
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.modules.some(m => m.toLowerCase().includes(query)) ||
        s.business_processes.some(bp => bp.toLowerCase().includes(query))
      )
    }

    return result
  }, [activeFilter, advancedFilters, searchQuery])

  // Paginated results
  const paginatedSuites = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSuites.slice(start, start + itemsPerPage)
  }, [filteredSuites, currentPage])

  const totalPages = Math.ceil(filteredSuites.length / itemsPerPage)

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, advancedFilters, searchQuery])

  // Simulate loading
  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const clearAllFilters = () => {
    setActiveFilter('all')
    resetAdvancedFilters()
    setSearchQuery('')
  }

  return (
    <AppShell currentApp="test-repository" breadcrumbs={[{ label: 'Test Library' }, { label: 'Test Suites' }]}>
      <TooltipProvider>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Test Suites</h1>
              <p className="page-description mt-1">
                Reusable Test Suite library — composed of Scenarios, scheduled and run from the Assurance Console.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
                <Download className="h-4 w-4 mr-1.5" />
                Import from Test Pack
              </Button>
              {hasWritePermission && (
                <Button size="sm" onClick={() => setIsNewSuiteOpen(true)}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Suite
                </Button>
              )}
            </div>
          </div>
          
          {/* Filter Chips Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {savedFilterChips.map((chip) => (
              <Button
                key={chip.id}
                variant={activeFilter === chip.id ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setActiveFilter(chip.id)}
              >
                {chip.label}
              </Button>
            ))}
            
            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Advanced Filter Drawer — uses the shared dashboard component */}
            <FilterDrawer
              filters={filterConfigs}
              values={advancedFilters}
              onChange={(key, value) =>
                setAdvancedFilter(key as keyof typeof advancedFilters, value)
              }
              onReset={resetAdvancedFilters}
              activeCount={activeFilterCount}
              title="Filter Test Suites"
            />

            {/* Search */}
            <div className="ml-auto">
              <Input
                type="search"
                placeholder="Search suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 w-64 text-xs"
              />
            </div>
          </div>

          {/* Active filter chips (mirrors dashboard pattern) */}
          {activeFilterCount > 0 && (
            <ActiveFilters
              filters={filterConfigs}
              values={advancedFilters}
              onClear={(key) =>
                clearAdvancedFilter(key as keyof typeof advancedFilters)
              }
              onClearAll={resetAdvancedFilters}
            />
          )}
          
          {/* Error State */}
          {hasError && <ErrorState onRetry={handleRetry} />}
          
          {/* Main Table Card */}
          <Card padding="flush">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">Code</TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="w-[180px]">Business Processes</TableHead>
                    <TableHead className="w-[140px]">SAP Modules</TableHead>
                    <TableHead className="w-[80px] text-center">Scenarios</TableHead>
                    <TableHead className="w-[80px]">Version</TableHead>
                    <TableHead className="w-[100px]">State</TableHead>
                    <TableHead className="w-[140px]">Last Pass Rate</TableHead>
                    <TableHead className="w-[120px]">Last Executed</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton rows
                    Array.from({ length: 8 }).map((_, idx) => (
                      <SkeletonRow key={idx} />
                    ))
                  ) : paginatedSuites.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={10} className="h-auto p-0">
                        <EmptyState onClearFilters={clearAllFilters} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Data rows
                    paginatedSuites.map((suite) => (
                      <TableRow key={suite.id} className="group">
                        <TableCell>
                          <EntityCodeLink
                            kind="Suite"
                            code={suite.code}
                            name={suite.name}
                            href={`/test-repository/suites/${suite.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/test-repository/suites/${suite.id}`}
                            className="font-medium text-sm text-foreground hover:underline hover:text-primary transition-colors"
                          >
                            {suite.name}
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {suite.business_processes.slice(0, 3).map((bp) => (
                              <Badge key={bp} variant="outline" className="text-xs font-normal">
                                {bp}
                              </Badge>
                            ))}
                            {suite.business_processes.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{suite.business_processes.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {suite.modules.slice(0, 3).map((mod) => (
                              <Badge key={mod} variant="secondary" className="text-xs font-mono">
                                {mod}
                              </Badge>
                            ))}
                            {suite.modules.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{suite.modules.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono text-xs">
                            {suite.scenario_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground">
                            v{suite.version}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={suite.state} />
                        </TableCell>
                        <TableCell>
                          {suite.last_pass_rate_pct > 0 ? (
                            <div className="flex items-center gap-2">
                              <MiniProgressBar value={suite.last_pass_rate_pct} />
                              <span className="text-xs font-medium tabular-nums">
                                {suite.last_pass_rate_pct}%
                              </span>
                              <DeltaArrow
                                current={suite.last_pass_rate_pct}
                                previous={suite.prev_pass_rate_pct}
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-muted-foreground cursor-default">
                                {formatRelativeTime(suite.last_executed)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">{formatAbsoluteTime(suite.last_executed)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem>
                                <LibraryBig className="h-4 w-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              {hasWritePermission ? (
                                <>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Clone
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Execution
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Play className="h-4 w-4 mr-2" />
                                    Run Now
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Export as Test Pack
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-amber-600">
                                    <Archive className="h-4 w-4 mr-2" />
                                    Mark Deprecated
                                  </DropdownMenuItem>
                                </>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* Pagination Footer */}
            {!isLoading && filteredSuites.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredSuites.length)} of {filteredSuites.length > 47 ? '47' : filteredSuites.length} suites
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <Button
                        variant={currentPage === totalPages ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Import from Test Pack dialog */}
        <ImportTestPackDialog
          open={isImportOpen}
          onOpenChange={setIsImportOpen}
        />

        {/* Create a new Test Suite dialog */}
        <NewSuiteDialog
          open={isNewSuiteOpen}
          onOpenChange={setIsNewSuiteOpen}
        />
      </TooltipProvider>
    </AppShell>
  )
}
