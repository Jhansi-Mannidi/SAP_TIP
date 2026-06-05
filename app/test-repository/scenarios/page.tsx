'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import {
  Plus,
  Filter,
  MoreHorizontal,
  FileText,
  Play,
  Copy,
  FileDown,
  Archive,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Globe,
  Building2,
  FolderOpen,
  X,
  Search,
  Loader2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { EntityCodeLink } from '@/components/entity-code-link'
import { StatusBadge } from '@/components/status-badge'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { NewScenarioSheet } from '@/components/new-scenario-sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { MOCK_TEST_SCENARIOS, type ScenarioState, type CustomerScope } from '@/lib/mock-data'

// Filter chip type
type FilterChip = {
  id: string
  label: string
  filter: (scenario: typeof MOCK_TEST_SCENARIOS[0]) => boolean
}

const savedFilterChips: FilterChip[] = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'published', label: 'Published', filter: (s) => s.state === 'Published' },
  { id: 'drafts', label: 'Drafts', filter: (s) => s.state === 'Draft' },
  { id: 'ai-generated', label: 'AI Generated', filter: (s) => s.ai_generated === true },
  { id: 'global', label: 'Global Scope', filter: (s) => s.customer_scope === 'Global' },
  { id: 'failing', label: 'Failing > 10%', filter: (s) => s.last_pass_rate_pct < 90 && s.last_pass_rate_pct > 0 },
]

// Delta arrow component
function DeltaArrow({ current, previous }: { current: number; previous?: number }) {
  if (!previous) return null
  const delta = current - previous
  if (delta === 0) return <Minus className="h-3 w-3 text-muted-foreground" />
  if (delta > 0) return <ArrowUp className="h-3 w-3 text-emerald-600" />
  return <ArrowDown className="h-3 w-3 text-red-600" />
}

// Mini progress bar
function MiniProgressBar({ value, className }: { value: number; className?: string }) {
  if (value === 0) return <span className="text-xs text-muted-foreground">—</span>
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

// Customer Scope Badge
function ScopeBadge({ scope }: { scope: CustomerScope }) {
  const config = {
    Global: { icon: Globe, className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    Customer: { icon: Building2, className: 'bg-slate-50 text-slate-700 border-slate-200' },
    Workspace: { icon: FolderOpen, className: 'bg-slate-50 text-slate-600 border-slate-200' },
  }
  const { icon: Icon, className } = config[scope]
  
  return (
    <Badge variant="outline" className={cn('text-xs font-normal gap-1', className)}>
      <Icon className="h-3 w-3" />
      {scope}
    </Badge>
  )
}

// Skeleton loading row
function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
      <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-10" /><Skeleton className="h-5 w-10" /></div></TableCell>
      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      <TableCell><div className="flex items-center gap-2"><Skeleton className="h-1.5 w-12" /><Skeleton className="h-4 w-10" /></div></TableCell>
      <TableCell><div className="flex gap-1"><Skeleton className="h-5 w-14" /><Skeleton className="h-5 w-14" /></div></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

// Empty state component
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No Test Scenarios match these filters</h3>
      <p className="page-description mb-6 max-w-md">
        Try adjusting your filters or use AI to generate new scenarios from business intent.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
        <Button>
          <Sparkles className="h-4 w-4 mr-1.5" />
          Generate from Intent
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
      <AlertTitle>Error loading test scenarios</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to fetch test scenarios from the server. Please try again.</span>
        <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

// AI Generation Sheet content — slides in from the right
function AIGenerationSheet({ onClose }: { onClose: () => void }) {
  const [intent, setIntent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
      setIntent('')
      onClose()
    }, 2000)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <SheetHeader className="border-b border-border px-5 sm:px-6 py-4 space-y-1.5 text-left">
        <SheetTitle className="flex items-center gap-2.5 text-base font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
          Generate Scenario from Intent
        </SheetTitle>
        <SheetDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Describe what you want to test in natural language. Voltus AI Agent will generate a
          complete test scenario draft for your review.
        </SheetDescription>
      </SheetHeader>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="intent" className="text-xs font-medium">
            Test Intent
          </Label>
          <Textarea
            id="intent"
            placeholder="e.g. 'Sales order with credit hold and manual release for vendor in Germany'"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="min-h-[140px] resize-none text-sm"
          />
          <p className="page-description text-[11px]">
            Be specific about the business process, master data, and any edge cases you want
            covered.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex items-start gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft/60 text-brand shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">Voltus AI Agent will:</p>
              <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-brand mt-1.5 h-1 w-1 rounded-full bg-brand shrink-0" />
                  <span>Analyze your intent and identify relevant SAP transactions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand mt-1.5 h-1 w-1 rounded-full bg-brand shrink-0" />
                  <span>Generate test tasks with appropriate data dependencies</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand mt-1.5 h-1 w-1 rounded-full bg-brand shrink-0" />
                  <span>Create the Scenario in Draft state for your review</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand mt-1.5 h-1 w-1 rounded-full bg-brand shrink-0" />
                  <span>Suggest test data sets based on your system configuration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-brand/30 bg-brand-soft/40 px-3 py-2.5">
          <AlertCircle className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            <span className="font-semibold text-foreground">Draft only.</span>{' '}
            Generated scenarios require review and approval before they can be published.
          </p>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
        <Button variant="outline" size="sm" onClick={onClose} className="h-9">
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!intent.trim() || isGenerating}
          size="sm"
          className="h-9 gap-1.5"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Generate Scenario
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function TestScenariosListPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [hasWritePermission] = useState(true)
  const [isAIGenOpen, setIsAIGenOpen] = useState(false)
  const [isNewScenarioOpen, setIsNewScenarioOpen] = useState(false)

  // Advanced filter state
  const [advancedFilters, setAdvancedFilters] = useState({
    states: [] as ScenarioState[],
    modules: [] as string[],
    businessProcesses: [] as string[],
    customerScopes: [] as CustomerScope[],
    tags: [] as string[],
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Filtered and searched scenarios
  const filteredScenarios = useMemo(() => {
    let result = [...MOCK_TEST_SCENARIOS]
    
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
      result = result.filter(s => advancedFilters.businessProcesses.includes(s.business_process))
    }
    if (advancedFilters.customerScopes.length > 0) {
      result = result.filter(s => advancedFilters.customerScopes.includes(s.customer_scope))
    }
    if (advancedFilters.tags.length > 0) {
      result = result.filter(s => s.tags.some(t => advancedFilters.tags.includes(t)))
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.modules.some(m => m.toLowerCase().includes(query)) ||
        s.business_process.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      )
    }
    
    return result
  }, [activeFilter, advancedFilters, searchQuery])
  
  // Paginated results
  const paginatedScenarios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredScenarios.slice(start, start + itemsPerPage)
  }, [filteredScenarios, currentPage])
  
  const totalPages = Math.ceil(filteredScenarios.length / itemsPerPage)
  
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
    setAdvancedFilters({ states: [], modules: [], businessProcesses: [], customerScopes: [], tags: [] })
    setSearchQuery('')
  }
  
  // Available filter options
  const allModules = Array.from(new Set(MOCK_TEST_SCENARIOS.flatMap(s => s.modules)))
  const allBPs = Array.from(new Set(MOCK_TEST_SCENARIOS.map(s => s.business_process)))
  const allStates: ScenarioState[] = ['Draft', 'Published', 'Deprecated', 'Archived']
  const allScopes: CustomerScope[] = ['Global', 'Customer', 'Workspace']
  const allTags = Array.from(new Set(MOCK_TEST_SCENARIOS.flatMap(s => s.tags)))

  return (
    <AppShell currentApp="test-repository" breadcrumbs={[{ label: 'Test Library' }, { label: 'Test Scenarios' }]}>
      <TooltipProvider>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Test Scenarios</h1>
              <p className="page-description mt-1">
                Reusable Test Scenarios — atomic test flows composed of Tasks, executed within Suites.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setIsAIGenOpen(true)}
              >
                <Sparkles className="h-4 w-4 text-brand" />
                Generate from Intent
              </Button>
              <Sheet open={isAIGenOpen} onOpenChange={setIsAIGenOpen}>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md p-0 flex flex-col"
                >
                  <AIGenerationSheet onClose={() => setIsAIGenOpen(false)} />
                </SheetContent>
              </Sheet>
              {hasWritePermission && (
                <Button size="sm" onClick={() => setIsNewScenarioOpen(true)}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Scenario
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
            
            {/* Advanced Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Filter className="h-3 w-3 mr-1.5" />
                  Filter
                  {(advancedFilters.states.length > 0 || advancedFilters.modules.length > 0 || advancedFilters.businessProcesses.length > 0 || advancedFilters.customerScopes.length > 0 || advancedFilters.tags.length > 0) && (
                    <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                      {advancedFilters.states.length + advancedFilters.modules.length + advancedFilters.businessProcesses.length + advancedFilters.customerScopes.length + advancedFilters.tags.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Test Scenarios</SheetTitle>
                  <SheetDescription>
                    Apply advanced filters to narrow down the scenario list.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* State Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">State</Label>
                    <div className="space-y-2">
                      {allStates.map((state) => (
                        <div key={state} className="flex items-center space-x-2">
                          <Checkbox
                            id={`state-${state}`}
                            checked={advancedFilters.states.includes(state)}
                            onCheckedChange={(checked) => {
                              setAdvancedFilters(prev => ({
                                ...prev,
                                states: checked
                                  ? [...prev.states, state]
                                  : prev.states.filter(s => s !== state)
                              }))
                            }}
                          />
                          <Label htmlFor={`state-${state}`} className="text-sm font-normal cursor-pointer">
                            {state}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Business Process Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Business Process</Label>
                    <StaggerGrid columns="grid-cols-2" className="gap-2" fast>
                      {allBPs.map((bp) => (
                        <div key={bp} className="flex items-center space-x-2">
                          <Checkbox
                            id={`bp-${bp}`}
                            checked={advancedFilters.businessProcesses.includes(bp)}
                            onCheckedChange={(checked) => {
                              setAdvancedFilters(prev => ({
                                ...prev,
                                businessProcesses: checked
                                  ? [...prev.businessProcesses, bp]
                                  : prev.businessProcesses.filter(b => b !== bp)
                              }))
                            }}
                          />
                          <Label htmlFor={`bp-${bp}`} className="text-sm font-normal cursor-pointer">
                            {bp}
                          </Label>
                        </div>
                      ))}
                    </StaggerGrid>
                  </div>
                  
                  <Separator />
                  
                  {/* Module Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">SAP Modules</Label>
                    <StaggerGrid columns="grid-cols-2" className="gap-2" fast>
                      {allModules.map((mod) => (
                        <div key={mod} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mod-${mod}`}
                            checked={advancedFilters.modules.includes(mod)}
                            onCheckedChange={(checked) => {
                              setAdvancedFilters(prev => ({
                                ...prev,
                                modules: checked
                                  ? [...prev.modules, mod]
                                  : prev.modules.filter(m => m !== mod)
                              }))
                            }}
                          />
                          <Label htmlFor={`mod-${mod}`} className="text-sm font-normal cursor-pointer font-mono">
                            {mod}
                          </Label>
                        </div>
                      ))}
                    </StaggerGrid>
                  </div>
                  
                  <Separator />
                  
                  {/* Customer Scope Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Customer Scope</Label>
                    <div className="space-y-2">
                      {allScopes.map((scope) => (
                        <div key={scope} className="flex items-center space-x-2">
                          <Checkbox
                            id={`scope-${scope}`}
                            checked={advancedFilters.customerScopes.includes(scope)}
                            onCheckedChange={(checked) => {
                              setAdvancedFilters(prev => ({
                                ...prev,
                                customerScopes: checked
                                  ? [...prev.customerScopes, scope]
                                  : prev.customerScopes.filter(s => s !== scope)
                              }))
                            }}
                          />
                          <Label htmlFor={`scope-${scope}`} className="text-sm font-normal cursor-pointer">
                            {scope}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Tags Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 12).map((tag) => (
                        <Button
                          key={tag}
                          variant={advancedFilters.tags.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            setAdvancedFilters(prev => ({
                              ...prev,
                              tags: prev.tags.includes(tag)
                                ? prev.tags.filter(t => t !== tag)
                                : [...prev.tags, tag]
                            }))
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAdvancedFilters({ states: [], modules: [], businessProcesses: [], customerScopes: [], tags: [] })}
                  >
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {/* Search */}
            <div className="ml-auto relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 w-64 text-xs pl-8"
              />
            </div>
          </div>
          
          {/* Error State */}
          {hasError && <ErrorState onRetry={handleRetry} />}
          
          {/* Main Table Card */}
          <Card padding="flush">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[130px]">Code</TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="w-[80px]">BP</TableHead>
                    <TableHead className="w-[140px]">SAP Modules</TableHead>
                    <TableHead className="w-[60px] text-center">Tasks</TableHead>
                    <TableHead className="w-[90px]">State</TableHead>
                    <TableHead className="w-[70px]">Version</TableHead>
                    <TableHead className="w-[120px]">Last Pass Rate</TableHead>
                    <TableHead className="w-[160px]">Tags</TableHead>
                    <TableHead className="w-[100px]">Scope</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton rows
                    Array.from({ length: 8 }).map((_, idx) => (
                      <SkeletonRow key={idx} />
                    ))
                  ) : paginatedScenarios.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={11} className="h-auto p-0">
                        <EmptyState onClearFilters={clearAllFilters} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Data rows
                    paginatedScenarios.map((scenario) => (
                      <TableRow 
                        key={scenario.id} 
                        className={cn(
                          'group',
                          scenario.customer_scope === 'Global' && 'bg-indigo-50/30'
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EntityCodeLink
                              kind="Scenario"
                              code={scenario.code}
                              name={scenario.name}
                              href={`/test-repository/scenarios/${scenario.id}`}
                            />
                            {scenario.ai_generated && (
                              <AgentTaskIndicator 
                                agentKind="test_generation" 
                                confidence={scenario.ai_confidence || 85} 
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/test-repository/scenarios/${scenario.id}`}
                            className="font-medium text-sm text-foreground hover:underline hover:text-primary transition-colors"
                          >
                            {scenario.name}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-medium">
                            {scenario.business_process}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {scenario.modules.slice(0, 2).map((mod) => (
                              <Badge key={mod} variant="secondary" className="text-xs font-mono">
                                {mod}
                              </Badge>
                            ))}
                            {scenario.modules.length > 2 && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="text-xs">
                                    +{scenario.modules.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {scenario.modules.slice(2).join(', ')}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs font-mono">
                            {scenario.task_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={scenario.state} />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-muted-foreground">
                            {scenario.version}
                          </span>
                        </TableCell>
                        <TableCell>
                          {scenario.last_pass_rate_pct > 0 ? (
                            <div className="flex items-center gap-2">
                              <MiniProgressBar value={scenario.last_pass_rate_pct} />
                              <span className={cn(
                                'text-xs font-medium',
                                scenario.last_pass_rate_pct >= 95 && 'text-emerald-600',
                                scenario.last_pass_rate_pct >= 80 && scenario.last_pass_rate_pct < 95 && 'text-amber-600',
                                scenario.last_pass_rate_pct < 80 && 'text-red-600'
                              )}>
                                {scenario.last_pass_rate_pct}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {scenario.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px] font-normal py-0">
                                {tag}
                              </Badge>
                            ))}
                            {scenario.tags.length > 2 && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="text-[10px] py-0">
                                    +{scenario.tags.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {scenario.tags.slice(2).join(', ')}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ScopeBadge scope={scenario.customer_scope} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {hasWritePermission ? (
                                <>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Open
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Play className="h-4 w-4 mr-2" />
                                    Run Now
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Export
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Open
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {!isLoading && filteredScenarios.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredScenarios.length)} of {filteredScenarios.length} scenarios
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create a new Test Scenario sheet */}
        <NewScenarioSheet
          open={isNewScenarioOpen}
          onOpenChange={setIsNewScenarioOpen}
        />
      </TooltipProvider>
    </AppShell>
  )
}
