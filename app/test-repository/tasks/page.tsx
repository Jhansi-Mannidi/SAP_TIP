"use client"

import * as React from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Video,
  CheckCircle2,
  XCircle,
  Play,
  Database,
  FileSignature,
  Settings2,
  Globe2,
  User,
  Bot,
  Sparkles,
  Camera,
  Send,
  Layers,
  ExternalLink,
  LibraryBig,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge, PriorityBadge } from '@/components/status-badge'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { EntityCodeLink } from '@/components/entity-code-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { MOCK_TEST_CASES, MOCK_TEST_SCENARIOS } from '@/lib/mock-data'
import { NewTestCaseSheet, type TestCaseSheetMode } from '@/components/new-test-case-sheet'
import { DeleteTestCaseDialog } from '@/components/delete-test-case-dialog'
import {
  TestCaseFilterSheet,
  EMPTY_TEST_CASE_FILTERS,
  countTestCaseAdvancedFilters,
  type TestCaseAdvancedFilters,
} from '@/components/test-repository/test-case-filter-sheet'
import { useRouter } from 'next/navigation'

// Task type icons and labels
const taskTypeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  run_transaction: { icon: Play, label: 'Run Transaction', color: 'bg-blue-100 text-blue-700' },
  verify_master_data_exists: { icon: Database, label: 'Verify Master Data', color: 'bg-slate-100 text-slate-700' },
  assert_data_state: { icon: CheckCircle2, label: 'Assert Data State', color: 'bg-emerald-100 text-emerald-700' },
  release_document: { icon: Send, label: 'Release Document', color: 'bg-amber-100 text-amber-700' },
  sign_off_scenario: { icon: FileSignature, label: 'Sign Off', color: 'bg-purple-100 text-purple-700' },
  capture_evidence: { icon: Camera, label: 'Capture Evidence', color: 'bg-pink-100 text-pink-700' },
  set_test_data: { icon: Settings2, label: 'Set Test Data', color: 'bg-indigo-100 text-indigo-700' },
  call_api: { icon: ExternalLink, label: 'Call API', color: 'bg-cyan-100 text-cyan-700' },
  propose_ir_update: { icon: Sparkles, label: 'Propose IR Update', color: 'bg-amber-100 text-amber-700' },
}

// Saved filter chips
const savedFilters = [
  { id: 'all', label: 'All', active: true },
  { id: 'with-ir', label: 'With IR' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'assertions', label: 'Assertions' },
  { id: 'sign-offs', label: 'Sign-offs' },
  { id: 'failing', label: 'Failing > 5%' },
]

export default function TestCasesListPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false)
  const [selectedScenariosCase, setSelectedScenariosCase] = React.useState<string | null>(null)

  // Test case sheet (create / edit / duplicate)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [sheetMode, setSheetMode] = React.useState<TestCaseSheetMode>('create')
  const [sheetInitialData, setSheetInitialData] = React.useState<any>(null)

  // Delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null)

  const router = useRouter()

  const openCreateSheet = React.useCallback(() => {
    setSheetMode('create')
    setSheetInitialData(null)
    setSheetOpen(true)
  }, [])

  const openEditSheet = React.useCallback((testCase: any) => {
    setSheetMode('edit')
    setSheetInitialData(testCase)
    setSheetOpen(true)
  }, [])

  const openDuplicateSheet = React.useCallback((testCase: any) => {
    setSheetMode('duplicate')
    // Strip the id so the duplicate is treated as a new record
    const { id, ...rest } = testCase
    setSheetInitialData(rest)
    setSheetOpen(true)
  }, [])

  const openDeleteDialog = React.useCallback((testCase: any) => {
    setDeleteTarget(testCase)
    setDeleteOpen(true)
  }, [])

  const handleViewIR = React.useCallback(
    (testCase: any) => {
      router.push(`/test-repository/ir?case=${encodeURIComponent(testCase.code)}`)
    },
    [router],
  )
  
  const [filters, setFilters] = React.useState<TestCaseAdvancedFilters>(EMPTY_TEST_CASE_FILTERS)

  const applyTestCaseFilters = React.useCallback(
    (advanced: TestCaseAdvancedFilters, chipId: string, query: string) => {
      let cases = [...MOCK_TEST_CASES]

      if (query) {
        const q = query.toLowerCase()
        cases = cases.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q)),
        )
      }

      if (chipId === 'with-ir') {
        cases = cases.filter((c) => c.has_ir)
      } else if (chipId === 'transactions') {
        cases = cases.filter((c) => c.task_type === 'run_transaction')
      } else if (chipId === 'assertions') {
        cases = cases.filter((c) => c.task_type === 'assert_data_state')
      } else if (chipId === 'sign-offs') {
        cases = cases.filter((c) => c.task_type === 'sign_off_scenario')
      } else if (chipId === 'failing') {
        cases = cases.filter((c) => c.last_pass_rate_pct > 0 && c.last_pass_rate_pct < 95)
      }

      if (advanced.taskTypes.length > 0) {
        cases = cases.filter((c) => advanced.taskTypes.includes(c.task_type))
      }
      if (advanced.criticalities.length > 0) {
        cases = cases.filter((c) => advanced.criticalities.includes(c.criticality))
      }
      if (advanced.hasIr !== null) {
        cases = cases.filter((c) => c.has_ir === advanced.hasIr)
      }
      if (advanced.states.length > 0) {
        cases = cases.filter((c) => advanced.states.includes(c.state))
      }
      if (advanced.customerScopes.length > 0) {
        cases = cases.filter((c) => advanced.customerScopes.includes(c.customer_scope))
      }

      return cases
    },
    [],
  )

  const filteredCases = React.useMemo(
    () => applyTestCaseFilters(filters, activeFilter, searchQuery),
    [applyTestCaseFilters, filters, activeFilter, searchQuery],
  )

  const advancedFilterCount = countTestCaseAdvancedFilters(filters)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])
  
  // Get scenarios for a test case
  const getScenariosForCase = (scenarioIds: string[]) => {
    return MOCK_TEST_SCENARIOS.filter(s => scenarioIds.includes(s.id))
  }
  
  // Permission check (mock)
  const canCreate = true
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Test Cases</h1>
              <p className="page-description mt-1">
                Atomic, independently observable test units. Cases are composed into Scenarios; each Case binds to a Test IR.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary"
                onClick={() => setIsImportModalOpen(true)}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Import from Recording
              </Button>
              
              {canCreate && (
                <Button className="gap-2" onClick={openCreateSheet}>
                  <Plus className="h-4 w-4" />
                  New Test Case
                </Button>
              )}
            </div>
          </div>
          
          {/* Filters Row */}
          <div className="flex items-center gap-4 mt-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              {savedFilters.map(filter => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="h-8"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'gap-2 h-8',
                advancedFilterCount > 0 && 'border-brand/40 bg-brand/[0.06]',
              )}
              onClick={() => setIsFilterSheetOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {advancedFilterCount > 0 && (
                <Badge className="ml-0.5 h-4 px-1 text-[10px] bg-brand text-brand-foreground border-0">
                  {advancedFilterCount}
                </Badge>
              )}
            </Button>

            <TestCaseFilterSheet
              open={isFilterSheetOpen}
              onOpenChange={setIsFilterSheetOpen}
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={MOCK_TEST_CASES.length}
              countMatches={(f) => applyTestCaseFilters(f, activeFilter, searchQuery).length}
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <Card className="max-w-md text-center">
                <CardContent>
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <LibraryBig className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No test cases found</h3>
                  <p className="page-description mt-1">
                    {searchQuery || activeFilter !== 'all'
                      ? 'Try adjusting your search or filters.'
                      : 'Create your first test case to get started.'}
                  </p>
                  <div className="flex justify-center gap-2 mt-4">
                {canCreate && (
                  <Button size="sm" className="gap-1" onClick={openCreateSheet}>
                    <Plus className="h-4 w-4" />
                    New Test Case
                  </Button>
                )}
                    <Button variant="secondary" size="sm" onClick={() => setIsImportModalOpen(true)}>
                      <Video className="h-4 w-4 mr-1" />
                      Import Recording
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[140px]">Task Type</TableHead>
                  <TableHead className="w-[60px]">Crit</TableHead>
                  <TableHead className="w-[100px]">Assignee</TableHead>
                  <TableHead className="w-[100px]">Service Role</TableHead>
                  <TableHead className="w-[90px]">Has IR</TableHead>
                  <TableHead className="w-[90px]">Used In</TableHead>
                  <TableHead className="w-[100px]">Pass Rate</TableHead>
                  <TableHead className="w-[90px]">State</TableHead>
                  <TableHead className="w-[90px]">Evidence</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((testCase) => {
                  const typeConfig = taskTypeConfig[testCase.task_type]
                  const TypeIcon = typeConfig?.icon || Layers
                  const isGlobal = testCase.customer_scope === 'Global'
                  const isAiGenerated = (testCase as any).ai_generated
                  
                  return (
                    <TableRow 
                      key={testCase.id}
                      className={cn(isGlobal && 'bg-indigo-50/30')}
                    >
                      <TableCell>
                        <EntityCodeLink
                          type="test-case"
                          code={testCase.code}
                          href={`/test-repository/tasks/${testCase.id}`}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/test-repository/tasks/${testCase.id}`}
                            className="font-medium text-sm hover:underline truncate max-w-[200px]"
                          >
                            {testCase.name}
                          </Link>
                          {isAiGenerated && (
                            <AgentTaskIndicator state="idle" size="sm" />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className={cn(
                          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
                          typeConfig?.color || 'bg-slate-100 text-slate-700'
                        )}>
                          <TypeIcon className="h-3 w-3" />
                          <span className="truncate max-w-[80px]">
                            {testCase.tcode || typeConfig?.label || testCase.task_type}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn('w-3 h-3 rounded-full mx-auto', {
                                'bg-red-500': testCase.criticality === 'critical',
                                'bg-amber-500': testCase.criticality === 'high',
                                'bg-blue-500': testCase.criticality === 'medium',
                                'bg-slate-400': testCase.criticality === 'low',
                              })} />
                            </TooltipTrigger>
                            <TooltipContent className="capitalize">
                              {testCase.criticality}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            testCase.default_assignee_class === 'agent' 
                              ? 'border-primary/30 bg-primary/5 text-primary' 
                              : ''
                          )}
                        >
                          {testCase.default_assignee_class === 'agent' ? (
                            <Bot className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {testCase.default_assignee_class === 'agent' ? 'Agent' : 'Human'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {testCase.default_service_role || '—'}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        {testCase.has_ir ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs text-muted-foreground">
                              {testCase.ir_step_count} steps
                            </span>
                          </div>
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {testCase.used_in_scenarios.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-primary hover:text-primary"
                            onClick={() => setSelectedScenariosCase(testCase.id)}
                          >
                            {testCase.used_in_scenarios.length} scenarios
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {testCase.last_pass_rate_pct > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={testCase.last_pass_rate_pct} 
                              className={cn(
                                'w-12 h-2',
                                testCase.last_pass_rate_pct >= 95 && '[&>div]:bg-emerald-500',
                                testCase.last_pass_rate_pct >= 80 && testCase.last_pass_rate_pct < 95 && '[&>div]:bg-amber-500',
                                testCase.last_pass_rate_pct < 80 && '[&>div]:bg-red-500'
                              )}
                            />
                            <span className="text-xs font-mono">
                              {testCase.last_pass_rate_pct}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <StatusBadge status={testCase.state} />
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            testCase.evidence_profile === 'full' && 'border-emerald-300 bg-emerald-50 text-emerald-700',
                            testCase.evidence_profile === 'minimal' && 'border-slate-300 bg-slate-50',
                            testCase.evidence_profile === 'none' && 'border-slate-200 text-slate-400'
                          )}
                        >
                          {testCase.evidence_profile}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                              <Link href={`/test-repository/tasks/${testCase.id}`}>
                                Open
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openEditSheet(testCase)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openDuplicateSheet(testCase)}>
                              Duplicate
                            </DropdownMenuItem>
                            {testCase.has_ir && (
                              <DropdownMenuItem onSelect={() => handleViewIR(testCase)}>
                                View IR
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onSelect={() => openDeleteDialog(testCase)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Scenarios Sheet */}
      <Sheet 
        open={!!selectedScenariosCase} 
        onOpenChange={() => setSelectedScenariosCase(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Used in Scenarios</SheetTitle>
            <SheetDescription>
              {selectedScenariosCase && (
                <>
                  Scenarios that include test case{' '}
                  <span className="font-mono">
                    {MOCK_TEST_CASES.find(c => c.id === selectedScenariosCase)?.code}
                  </span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-200px)] mt-6">
            <div className="space-y-2">
              {selectedScenariosCase && 
                getScenariosForCase(
                  MOCK_TEST_CASES.find(c => c.id === selectedScenariosCase)?.used_in_scenarios || []
                ).map(scenario => (
                  <Link
                    key={scenario.id}
                    href={`/test-repository/scenarios/${scenario.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {scenario.code}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {scenario.business_process}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">{scenario.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={scenario.last_pass_rate_pct} 
                            className="w-12 h-2"
                          />
                          <span className="text-xs font-mono">
                            {scenario.last_pass_rate_pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      {/* Import from Recording Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Import from Recording
            </DialogTitle>
            <DialogDescription>
              Record your SAP GUI interactions and automatically generate test cases with IR steps.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card className="border-dashed">
              <CardContent className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Start Recording</h4>
                <p className="page-description mt-1">
                  Launch the GUI Recorder to capture your SAP transactions.
                </p>
                <Button className="mt-4" size="sm">
                  Launch GUI Recorder
                </Button>
              </CardContent>
            </Card>
            
            <div className="text-sm text-muted-foreground">
              <h5 className="font-medium text-foreground mb-2">How it works:</h5>
              <ol className="list-decimal list-inside space-y-1">
                <li>Start the GUI Recorder</li>
                <li>Perform your SAP transaction</li>
                <li>Stop recording and review</li>
                <li>Generate test case with IR steps</li>
              </ol>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New / Edit / Duplicate Test Case sheet */}
      <NewTestCaseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        initialData={sheetInitialData}
      />

      {/* Delete confirmation dialog */}
      <DeleteTestCaseDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        testCase={deleteTarget}
      />
    </AppShell>
  )
}
