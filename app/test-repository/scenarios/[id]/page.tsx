'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { TaskDefinitionGraph, ValidationPanel } from '@/components/task-definition-graph'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { AuditTrailTable } from '@/components/audit-trail-table'
import { ScenarioCoveragePanel } from '@/components/test-repository/scenario-coverage-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ArrowLeft,
  Play,
  Pencil,
  Copy,
  Archive,
  MoreHorizontal,
  Send,
  GitBranch,
  List,
  Plus,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Clock,
  FileSignature,
  GripVertical,
  Search,
  Download,
  Upload,
  Bot,
  User,
  Layers,
  RefreshCw,
  AlertTriangle,
  Link2,
  ExternalLink,
  Settings2,
  Database,
  FileCode2,
  Trash2,
  Camera,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  MOCK_TEST_SCENARIOS,
  getScenarioAuditEvents, 
  MOCK_SCENARIO_DETAIL, 
  MOCK_SCENARIO_TASKS,
  type ScenarioTask 
} from '@/lib/mock-data'
import { formatDistanceToNow, format } from 'date-fns'

// Task type labels
const taskTypeLabels: Record<string, string> = {
  verify_master_data_exists: 'Verify Master Data',
  run_transaction: 'Run Transaction',
  assert_data_state: 'Assert Data State',
  release_document: 'Release Document',
  sign_off_scenario: 'Sign Off',
  capture_evidence: 'Capture Evidence',
  set_test_data: 'Set Test Data',
}

export default function TestScenarioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string
  
  // State
  const [isLoading, setIsLoading] = React.useState(true)
  const [viewMode, setViewMode] = React.useState<'graph' | 'list'>('graph')
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [expandedTaskId, setExpandedTaskId] = React.useState<string | null>(null)
  const [isPropertiesOpen, setIsPropertiesOpen] = React.useState(true)
  const [isTaskPickerOpen, setIsTaskPickerOpen] = React.useState(false)
  const [isGenerateOpen, setIsGenerateOpen] = React.useState(false)
  const [generateIntent, setGenerateIntent] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('tasks')
  
  // --- Prerequisites state ---
  type PrereqType = 'test_data' | 'system_state' | 'prior_scenario'
  type Prerequisite = {
    id: string
    type: PrereqType
    description: string
    scenario_id?: string
  }
  const [prerequisites, setPrerequisites] = React.useState<Prerequisite[]>(() =>
    MOCK_SCENARIO_DETAIL.prerequisites.map((p, i) => ({
      id: `prereq_${i + 1}`,
      type: p.type as PrereqType,
      description: p.description,
      scenario_id: (p as { scenario_id?: string }).scenario_id,
    }))
  )
  const [isPrereqDialogOpen, setIsPrereqDialogOpen] = React.useState(false)
  const [editingPrereqId, setEditingPrereqId] = React.useState<string | null>(null)
  const [prereqDraft, setPrereqDraft] = React.useState<{
    type: PrereqType
    description: string
    scenario_id: string
  }>({ type: 'test_data', description: '', scenario_id: '' })
  const [confirmDeletePrereqId, setConfirmDeletePrereqId] = React.useState<string | null>(null)
  
  const openAddPrereqDialog = React.useCallback(() => {
    setEditingPrereqId(null)
    setPrereqDraft({ type: 'test_data', description: '', scenario_id: '' })
    setIsPrereqDialogOpen(true)
  }, [])
  
  const openEditPrereqDialog = React.useCallback((prereq: Prerequisite) => {
    setEditingPrereqId(prereq.id)
    setPrereqDraft({
      type: prereq.type,
      description: prereq.description,
      scenario_id: prereq.scenario_id ?? '',
    })
    setIsPrereqDialogOpen(true)
  }, [])
  
  const handleSavePrereq = React.useCallback(() => {
    const description = prereqDraft.description.trim()
    if (!description) return
    const scenario_id =
      prereqDraft.type === 'prior_scenario' && prereqDraft.scenario_id.trim()
        ? prereqDraft.scenario_id.trim()
        : undefined
    
    if (editingPrereqId) {
      setPrerequisites((prev) =>
        prev.map((p) =>
          p.id === editingPrereqId
            ? { ...p, type: prereqDraft.type, description, scenario_id }
            : p
        )
      )
    } else {
      setPrerequisites((prev) => [
        ...prev,
        {
          id: `prereq_${Date.now()}`,
          type: prereqDraft.type,
          description,
          scenario_id,
        },
      ])
    }
    setIsPrereqDialogOpen(false)
    setEditingPrereqId(null)
  }, [editingPrereqId, prereqDraft])
  
  const handleDeletePrereq = React.useCallback((id: string) => {
    setPrerequisites((prev) => prev.filter((p) => p.id !== id))
    setConfirmDeletePrereqId(null)
  }, [])
  
  // Load scenario data
  const scenario = React.useMemo(() => {
    return MOCK_SCENARIO_DETAIL
  }, [])
  
  const tasks = React.useMemo(() => {
    return MOCK_SCENARIO_TASKS
  }, [])
  
  const selectedTask = React.useMemo(() => {
    if (!selectedTaskId) return null
    return tasks.find(t => t.id === selectedTaskId) || null
  }, [selectedTaskId, tasks])
  
  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  // Handlers
  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsPropertiesOpen(true)
  }
  
  const handleDuplicateTask = (taskId: string) => {
    console.log('Duplicate task:', taskId)
  }
  
  const handleRemoveTask = (taskId: string) => {
    console.log('Remove task:', taskId)
  }
  
  const handleSetPredecessors = (taskId: string) => {
    console.log('Set predecessors:', taskId)
  }
  
  if (isLoading) {
    return (
      <AppShell currentApp="test-repository">
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AppShell>
    )
  }
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-background">
          <div className="p-4 md:p-6">
            {/* Breadcrumb & Back */}
            <div className="page-breadcrumb mb-4">
              <Link 
                href="/test-repository/scenarios" 
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Scenarios
              </Link>
              <span>/</span>
              <span>Test Repository</span>
              <span>/</span>
              <span>Test Scenarios</span>
              <span>/</span>
              <span className="text-foreground">{scenario.code}</span>
            </div>
            
            {/* Title Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="page-title">{scenario.name}</h1>
                  <span className="text-lg text-muted-foreground font-mono">{scenario.code}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={scenario.state} />
                  <Badge variant="outline" className="font-mono">
                    v{scenario.version}
                  </Badge>
                  <Badge variant="secondary">
                    {scenario.business_process}
                  </Badge>
                  {scenario.modules.map(mod => (
                    <Badge key={mod} variant="outline" className="font-mono text-xs">
                      {mod}
                    </Badge>
                  ))}
                  
                  {/* Mini sparkline / pass rate */}
                  <div className="flex items-center gap-2 ml-2">
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${scenario.last_pass_rate_pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-emerald-600">
                        {scenario.last_pass_rate_pct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg mr-2">
                  <Button
                    variant={viewMode === 'graph' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-r-none gap-1"
                    onClick={() => setViewMode('graph')}
                  >
                    <GitBranch className="h-4 w-4" />
                    Graph
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-l-none gap-1"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                    List
                  </Button>
                </div>
                
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Metadata
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export to Test Pack
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Tasks
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Deprecate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 md:px-6">
            <TabsList className="h-10">
              <TabsTrigger value="overview" className="gap-1">
                <LayoutGrid className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1">
                <Layers className="h-4 w-4" />
                Tasks ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="prerequisites" className="gap-1">
                <Database className="h-4 w-4" />
                Prerequisites
              </TabsTrigger>
              <TabsTrigger value="coverage" className="gap-1">
                <Shield className="h-4 w-4" />
                Coverage
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1">
                <Clock className="h-4 w-4" />
                Execution History
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-1">
                Comments ({scenario.comments.length})
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1">
                <FileCode2 className="h-4 w-4" />
                Audit
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="h-full m-0 p-6 overflow-auto">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {scenario.description.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Success Criteria */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Success Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min Pass Rate</span>
                      <span className="font-medium">{scenario.success_criteria.pass_rate_pct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Failed Critical</span>
                      <span className="font-medium">{scenario.success_criteria.max_failed_critical_cases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Healed %</span>
                      <span className="font-medium">{scenario.success_criteria.max_healed_pct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target Runner Pool</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {scenario.success_criteria.target_runner_pool}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
                      <div>
                        <p className="stat-value">{tasks.length}</p>
                        <p className="page-description">Total Tasks</p>
                      </div>
                      <div>
                        <p className="stat-value">
                          {tasks.filter(t => t.default_assignee_class === 'agent').length}
                        </p>
                        <p className="page-description">Agent Tasks</p>
                      </div>
                      <div>
                        <p className="stat-value">
                          {tasks.filter(t => t.criticality === 'critical').length}
                        </p>
                        <p className="page-description">Critical Tasks</p>
                      </div>
                      <div>
                        <p className="stat-value">
                          {scenario.execution_history.length}
                        </p>
                        <p className="page-description">Executions</p>
                      </div>
                    </StaggerGrid>
                  </CardContent>
                </Card>
                
                {/* Tags & Scope */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tags & Scope</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {scenario.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">BP Scope Items</Label>
                      <div className="flex flex-wrap gap-2">
                        {scenario.bp_scope_items.map(item => (
                          <Badge key={item} variant="outline" className="font-mono">{item}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Linked Migrations</Label>
                      <div className="flex flex-wrap gap-2">
                        {scenario.linked_migrations.map(mig => (
                          <Badge key={mig} variant="outline" className="font-mono">{mig}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Tasks Tab (Process Template) */}
            <TabsContent value="tasks" className="h-full m-0 flex flex-col">
              {/* Task Toolbar */}
              <div className="flex-shrink-0 p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setIsTaskPickerOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setIsGenerateOpen(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Tasks from Intent
                  </Button>
                  <Button size="sm" variant="outline">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Auto-Layout
                  </Button>
                  <Button size="sm" variant="outline">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Validate
                  </Button>
                </div>
                
                {selectedTask && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    {isPropertiesOpen ? 'Hide' : 'Show'} Properties
                  </Button>
                )}
              </div>
              
              {/* Graph/List + Properties Panel */}
              <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {viewMode === 'graph' ? (
                    <div className="flex-1 p-4">
                      <TaskDefinitionGraph
                        tasks={tasks}
                        selectedTaskId={selectedTaskId}
                        onSelectTask={setSelectedTaskId}
                        onEditTask={handleEditTask}
                        onDuplicateTask={handleDuplicateTask}
                        onRemoveTask={handleRemoveTask}
                        onSetPredecessors={handleSetPredecessors}
                        className="h-full"
                      />
                    </div>
                  ) : (
                    /* List Mode with inline editing and sticky validation panel */
                    <div className="flex-1 flex overflow-hidden">
                      {/* Task List */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-2">
                            {tasks
                              .sort((a, b) => a.order - b.order)
                              .map(task => (
                                <TaskListItem
                                  key={task.id}
                                  task={task}
                                  isSelected={task.id === selectedTaskId}
                                  isExpanded={task.id === expandedTaskId}
                                  onClick={() => setSelectedTaskId(task.id)}
                                  onEdit={() => handleEditTask(task.id)}
                                  onToggleExpand={() => setExpandedTaskId(
                                    expandedTaskId === task.id ? null : task.id
                                  )}
                                />
                              ))
                            }
                          </div>
                          
                          {/* Add Task Section at bottom */}
                          <div className="mt-4 pt-4 border-t border-dashed flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setIsTaskPickerOpen(true)}
                              className="gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add Task
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setIsGenerateOpen(true)}
                              className="gap-1"
                            >
                              <Sparkles className="h-4 w-4" />
                              Generate Tasks from Intent
                            </Button>
                          </div>
                        </ScrollArea>
                      </div>
                      
                      {/* Sticky Validation Panel - Right Side */}
                      <div className="w-72 border-l bg-muted/20 flex flex-col overflow-hidden">
                        <div className="p-3 border-b bg-background">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Validation
                          </h4>
                        </div>
                        <ScrollArea className="flex-1 p-3">
                          <ValidationPanel tasks={tasks} compact />
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                  
                  {/* Validation Panel (Graph mode only - at bottom) */}
                  {viewMode === 'graph' && (
                    <div className="flex-shrink-0 p-4 border-t">
                      <ValidationPanel tasks={tasks} />
                    </div>
                  )}
                </div>
                
                {/* Properties Drawer (Graph mode only) */}
                {viewMode === 'graph' && isPropertiesOpen && selectedTask && (
                  <div className="w-80 border-l bg-background flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h3 className="font-semibold">Task Properties</h3>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => setIsPropertiesOpen(false)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <TaskPropertiesForm task={selectedTask} />
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Prerequisites Tab */}
            <TabsContent value="prerequisites" className="h-full m-0 p-4 sm:p-6 overflow-auto">
              <div className="section-card">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 sm:p-5 border-b border-border">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight">Prerequisites</h3>
                    <p className="caption-text">
                      Required conditions before this scenario can execute
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground mr-2">
                      <span>
                        <span className="font-mono tabular-nums font-semibold text-foreground">
                          {prerequisites.length}
                        </span>{' '}
                        total
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={openAddPrereqDialog}
                      className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                    >
                      <Plus className="h-4 w-4" />
                      Add Prerequisite
                    </Button>
                  </div>
                </div>

                {/* List */}
                <div className="p-4 sm:p-5">
                  {prerequisites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                        <Database className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        No prerequisites yet
                      </p>
                      <p className="caption-text mt-1 max-w-xs">
                        Add the test data, system state, or prior scenarios that must be in place before this scenario can run.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4 gap-1.5"
                        onClick={openAddPrereqDialog}
                      >
                        <Plus className="h-4 w-4" />
                        Add Prerequisite
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      {prerequisites.map((prereq) => {
                        const typeMeta =
                          prereq.type === 'test_data'
                            ? { label: 'Test Data', icon: Database, pill: 'pill-brand' }
                            : prereq.type === 'system_state'
                            ? { label: 'System State', icon: Shield, pill: 'pill-info' }
                            : { label: 'Prior Scenario', icon: GitBranch, pill: 'pill-success' }
                        const TypeIcon = typeMeta.icon
                        return (
                          <li
                            key={prereq.id}
                            className={cn(
                              'group flex flex-col sm:flex-row sm:items-start gap-3 p-3.5 sm:p-4',
                              'rounded-xl border border-border bg-card transition-all duration-150',
                              'hover:border-foreground/15 hover:shadow-sm'
                            )}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={cn('pill', typeMeta.pill)}>
                                    {typeMeta.label}
                                  </span>
                                  {prereq.scenario_id && (
                                    <Link
                                      href={`/test-repository/scenarios/${prereq.scenario_id}`}
                                      className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-brand hover:underline underline-offset-2"
                                    >
                                      {prereq.scenario_id}
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  )}
                                </div>
                                <p className="text-sm text-foreground leading-relaxed break-words">
                                  {prereq.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 self-end sm:self-start">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Edit prerequisite"
                                onClick={() => openEditPrereqDialog(prereq)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                aria-label="Remove prerequisite"
                                onClick={() => setConfirmDeletePrereqId(prereq.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Coverage Tab */}
            <TabsContent value="coverage" className="h-full m-0 p-6 overflow-auto">
              <ScenarioCoveragePanel
                scenarioCode={scenario.code}
                scenarioName={scenario.name}
                businessProcess={scenario.business_process}
                bpScopeItems={scenario.bp_scope_items}
                tasks={tasks}
                passRatePct={scenario.last_pass_rate_pct}
              />
            </TabsContent>
            
            {/* Execution History Tab */}
            <TabsContent value="history" className="h-full m-0 p-6 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Execution History</CardTitle>
                  <CardDescription>
                    Recent test runs for this scenario
                  </CardDescription>
                </CardHeader>
                <CardContent className="card-bleed-x card-bleed-b">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Run ID</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Results</TableHead>
                        <TableHead>Triggered By</TableHead>
                        <TableHead>Sign-off</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenario.execution_history.map((run) => (
                        <TableRow key={run.run_id}>
                          <TableCell>
                            <span className="font-mono text-sm">{run.run_id}</span>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="text-sm">
                                  {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                                </TooltipTrigger>
                                <TooltipContent>
                                  {format(new Date(run.started_at), 'PPpp')}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-sm">
                            {Math.round(run.duration_ms / 1000 / 60)}m {Math.round((run.duration_ms / 1000) % 60)}s
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={run.state} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-emerald-600">{run.passed}P</span>
                              {run.healed > 0 && <span className="text-amber-600">{run.healed}H</span>}
                              {run.failed > 0 && <span className="text-red-600">{run.failed}F</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {run.triggered_by === 'Voltus AI' ? (
                                <AgentTaskIndicator state="idle" size="sm" />
                              ) : (
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {run.triggered_by.split('.').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-sm">{run.triggered_by}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={run.sign_off === 'Approved' ? 'default' : 'destructive'}
                              className={run.sign_off === 'Approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                            >
                              {run.sign_off}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Comments Tab */}
            <TabsContent value="comments" className="h-full m-0 p-6 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scenario.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className={cn(
                        "h-8 w-8",
                        comment.avatar === 'AI' && 'bg-primary text-primary-foreground'
                      )}>
                        <AvatarFallback className="text-xs">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="page-description">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">PS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea placeholder="Add a comment... Use @mentions to notify team members" />
                      <div className="flex justify-end">
                        <Button size="sm">Post Comment</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Audit Tab */}
            <TabsContent value="audit" className="h-full m-0 p-6 overflow-auto">
              <AuditTrailTable events={getScenarioAuditEvents(scenarioId)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Task Sheet */}
      <Sheet open={isTaskPickerOpen} onOpenChange={setIsTaskPickerOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Add Task</SheetTitle>
            <SheetDescription>
              Search and select a test case or create a new task
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search test cases..." className="pl-10" />
            </div>
            
            <div className="space-y-2">
              <p className="page-description">Recent Test Cases</p>
              {['TC_VERIFY_CUSTOMER', 'TC_CREATE_SO', 'TC_POST_GI', 'TC_QA_SIGNOFF'].map(tc => (
                <div key={tc} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{tc}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Generate from Intent Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Tasks from Intent
            </DialogTitle>
            <DialogDescription>
              Describe what you want to test and Voltus AI Agent will generate the task definitions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Describe what you want to test (e.g. 'Sales order with credit hold and manual release for vendor in Germany')"
              value={generateIntent}
              onChange={(e) => setGenerateIntent(e.target.value)}
              className="min-h-[120px]"
            />
            
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Bot className="h-4 w-4 text-primary mt-0.5" />
              <p className="page-description">
                Voltus AI Agent will generate the Scenario draft based on SAP knowledge base and existing test patterns.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsGenerateOpen(false)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Prerequisite Dialog */}
      <Dialog open={isPrereqDialogOpen} onOpenChange={setIsPrereqDialogOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    {editingPrereqId ? 'Edit prerequisite' : 'Add prerequisite'}
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Specify the condition that must be true before this scenario can run.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </Label>
              <StaggerGrid columns="grid-cols-3" className="gap-2" fast>
                {(
                  [
                    { value: 'test_data', label: 'Test Data', icon: Database },
                    { value: 'system_state', label: 'System', icon: Shield },
                    { value: 'prior_scenario', label: 'Prior Scenario', icon: GitBranch },
                  ] as const
                ).map((option) => {
                  const isSelected = prereqDraft.type === option.value
                  const OptionIcon = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setPrereqDraft((d) => ({ ...d, type: option.value }))
                      }
                      className={cn(
                        'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                        isSelected
                          ? 'border-brand bg-brand-soft text-brand-soft-foreground shadow-xs'
                          : 'border-border bg-card text-foreground hover:border-foreground/20 hover:bg-muted/40'
                      )}
                      aria-pressed={isSelected}
                    >
                      <OptionIcon
                        className={cn(
                          'h-4 w-4',
                          isSelected ? 'text-brand' : 'text-muted-foreground'
                        )}
                      />
                      <span className="leading-tight text-center">{option.label}</span>
                    </button>
                  )
                })}
              </StaggerGrid>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="prereq-description"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="prereq-description"
                value={prereqDraft.description}
                onChange={(e) =>
                  setPrereqDraft((d) => ({ ...d, description: e.target.value }))
                }
                placeholder={
                  prereqDraft.type === 'test_data'
                    ? 'e.g. Customer 1000234 must exist in plant 1000 with credit limit > 50,000 INR'
                    : prereqDraft.type === 'system_state'
                    ? 'e.g. Plant 1000 must be open for sales in company code 1000'
                    : 'e.g. MM Procurement smoke must have run successfully in last 24h'
                }
                className="min-h-[96px] text-sm resize-none focus-visible:ring-brand/40"
              />
            </div>

            {prereqDraft.type === 'prior_scenario' && (
              <div className="space-y-2">
                <Label
                  htmlFor="prereq-scenario-id"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Linked scenario ID
                  <span className="ml-1 text-muted-foreground/70 normal-case font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="prereq-scenario-id"
                  value={prereqDraft.scenario_id}
                  onChange={(e) =>
                    setPrereqDraft((d) => ({ ...d, scenario_id: e.target.value }))
                  }
                  placeholder="e.g. sc_3"
                  className="font-mono text-sm focus-visible:ring-brand/40"
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsPrereqDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePrereq}
              disabled={!prereqDraft.description.trim()}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {editingPrereqId ? 'Save changes' : 'Add prerequisite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Prerequisite Confirmation */}
      <Dialog
        open={confirmDeletePrereqId !== null}
        onOpenChange={(open) => !open && setConfirmDeletePrereqId(null)}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </span>
              Remove prerequisite?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              This will remove the prerequisite from the scenario. You can add it back later, but any links to prior scenarios will need to be re-entered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 mt-2">
            <Button variant="outline" onClick={() => setConfirmDeletePrereqId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDeletePrereqId) handleDeletePrereq(confirmDeletePrereqId)
              }}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

// Task type icons
const taskTypeIcons: Record<string, React.ElementType> = {
  verify_master_data_exists: Database,
  run_transaction: Play,
  assert_data_state: CheckCircle2,
  release_document: Send,
  sign_off_scenario: FileSignature,
  capture_evidence: Camera,
  set_test_data: Settings2,
}

// Task List Item Component with inline editor
function TaskListItem({ 
  task, 
  isSelected, 
  isExpanded,
  onClick, 
  onEdit,
  onToggleExpand,
}: { 
  task: ScenarioTask
  isSelected: boolean
  isExpanded: boolean
  onClick: () => void
  onEdit: () => void
  onToggleExpand: () => void
}) {
  const TaskIcon = taskTypeIcons[task.task_type] || Layers
  
  return (
    <div className={cn(
      'border rounded-lg transition-all',
      isSelected && 'border-primary ring-1 ring-primary/20',
      isExpanded && 'bg-muted/20'
    )}>
      {/* Main Row */}
      <div
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 p-3 cursor-pointer transition-colors',
          'hover:bg-muted/30',
        )}
      >
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Order Number */}
        <Badge variant="outline" className="font-mono text-xs shrink-0 w-8 justify-center">
          {task.order}
        </Badge>
        
        {/* Task Type Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                'p-1.5 rounded-md shrink-0',
                task.task_type === 'run_transaction' && 'bg-blue-100 text-blue-700',
                task.task_type === 'verify_master_data_exists' && 'bg-slate-100 text-slate-700',
                task.task_type === 'assert_data_state' && 'bg-emerald-100 text-emerald-700',
                task.task_type === 'release_document' && 'bg-amber-100 text-amber-700',
                task.task_type === 'sign_off_scenario' && 'bg-purple-100 text-purple-700',
                task.task_type === 'capture_evidence' && 'bg-pink-100 text-pink-700',
                task.task_type === 'set_test_data' && 'bg-indigo-100 text-indigo-700',
              )}>
                <TaskIcon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>{taskTypeLabels[task.task_type]}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Task Name & Code */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{task.name}</p>
            {task.tcode && (
              <Badge variant="secondary" className="font-mono text-xs shrink-0">
                {task.tcode}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Assignee Class */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-xs shrink-0',
                task.default_assignee_class === 'agent' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {task.default_assignee_class === 'agent' ? (
                  <Bot className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">
                  {task.default_assignee_class === 'agent' ? 'Agent' : task.default_service_role || 'Human'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {task.default_assignee_class === 'agent' 
                ? 'Automated by AI Agent' 
                : `Assigned to ${task.default_service_role || 'Human'}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Criticality Dot */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', {
                'bg-red-500': task.criticality === 'critical',
                'bg-amber-500': task.criticality === 'high',
                'bg-blue-500': task.criticality === 'medium',
                'bg-slate-400': task.criticality === 'low',
              })} />
            </TooltipTrigger>
            <TooltipContent className="capitalize">{task.criticality} criticality</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Evidence Profile */}
        {task.evidence_capture_profile && task.evidence_capture_profile !== 'none' && (
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs shrink-0',
              task.evidence_capture_profile === 'full' && 'border-emerald-300 bg-emerald-50 text-emerald-700',
              task.evidence_capture_profile === 'minimal' && 'border-slate-300 bg-slate-50 text-slate-600',
            )}
          >
            <Camera className="h-3 w-3 mr-1" />
            {task.evidence_capture_profile}
          </Badge>
        )}
        
        {/* Retry Policy Summary */}
        {task.retry_policy && task.retry_policy.max_attempts > 1 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs shrink-0">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {task.retry_policy.max_attempts}x
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Retry {task.retry_policy.max_attempts} times with {task.retry_policy.backoff_ms}ms backoff
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Healing Indicator */}
        {task.healing_enabled && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 rounded bg-amber-50">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Self-healing enabled</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Expand/Collapse */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
        >
          {isExpanded ? 'Collapse' : 'Edit'}
        </Button>
        
        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit in Panel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link2 className="h-4 w-4 mr-2" />
              Set Predecessors
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Inline Editor (expanded) */}
      {isExpanded && (
        <div className="border-t bg-background p-4">
          <TaskInlineEditor task={task} />
        </div>
      )}
    </div>
  )
}

// Inline Editor Component for List Mode
function TaskInlineEditor({ task }: { task: ScenarioTask }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Column 1: Basic Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">Basic Info</h4>
        
        <div className="space-y-2">
          <Label className="text-xs">Name</Label>
          <Input defaultValue={task.name} />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs">Description</Label>
          <Textarea defaultValue={task.description} className="min-h-[80px] text-sm" />
        </div>
        
        <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
          <div className="space-y-2">
            <Label className="text-xs">Task Type</Label>
            <Select defaultValue={task.task_type}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verify_master_data_exists">Verify Master Data</SelectItem>
                <SelectItem value="run_transaction">Run Transaction</SelectItem>
                <SelectItem value="assert_data_state">Assert Data State</SelectItem>
                <SelectItem value="release_document">Release Document</SelectItem>
                <SelectItem value="sign_off_scenario">Sign Off</SelectItem>
                <SelectItem value="capture_evidence">Capture Evidence</SelectItem>
                <SelectItem value="set_test_data">Set Test Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Criticality</Label>
            <Select defaultValue={task.criticality}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </StaggerGrid>
      </div>
      
      {/* Column 2: Assignment & Evidence */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">Assignment & Evidence</h4>
        
        <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
          <div className="space-y-2">
            <Label className="text-xs">Assignee Class</Label>
            <Select defaultValue={task.default_assignee_class}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent (Automated)</SelectItem>
                <SelectItem value="human">Human</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Service Role</Label>
            <Input 
              defaultValue={task.default_service_role || ''} 
              placeholder="e.g., QA Lead"
              className="h-9"
              disabled={task.default_assignee_class === 'agent'}
            />
          </div>
        </StaggerGrid>
        
        <div className="space-y-2">
          <Label className="text-xs">Evidence Capture</Label>
          <Select defaultValue={task.evidence_capture_profile || 'none'}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full (Screenshots + Data)</SelectItem>
              <SelectItem value="minimal">Minimal (Data only)</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
          <div className="space-y-0.5">
            <Label className="text-xs font-medium">Healing Enabled</Label>
            <p className="caption-text">Allow AI auto-heal</p>
          </div>
          <Switch defaultChecked={task.healing_enabled} />
        </div>
      </div>
      
      {/* Column 3: Retry & IR */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground">Retry & IR Reference</h4>
        
        <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
          <div className="space-y-2">
            <Label className="text-xs">Max Attempts</Label>
            <Input 
              type="number" 
              defaultValue={task.retry_policy?.max_attempts || 1} 
              min={1} 
              max={5}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Backoff (ms)</Label>
            <Input 
              type="number" 
              defaultValue={task.retry_policy?.backoff_ms || 1000}
              step={500}
              className="h-9"
            />
          </div>
        </StaggerGrid>
        
        <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
          <div className="space-y-2">
            <Label className="text-xs">T-Code</Label>
            <Input defaultValue={task.tcode || ''} placeholder="VA01" className="font-mono h-9" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">IR Reference</Label>
            <div className="flex gap-1">
              <Input defaultValue={task.ir_id || ''} placeholder="ir_xxx" className="font-mono h-9" />
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </StaggerGrid>
        
        <div className="space-y-2">
          <Label className="text-xs">Predecessors</Label>
          <div className="flex flex-wrap gap-1">
            {task.predecessors.length > 0 ? (
              task.predecessors.map(pred => (
                <Badge key={pred} variant="secondary" className="font-mono text-xs">
                  {pred}
                  <button className="ml-1 hover:text-destructive">
                    <XCircle className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No predecessors (start task)</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

// Task Properties Form Component
function TaskPropertiesForm({ task }: { task: ScenarioTask }) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Task Type</Label>
          <Select defaultValue={task.task_type}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verify_master_data_exists">Verify Master Data</SelectItem>
              <SelectItem value="run_transaction">Run Transaction</SelectItem>
              <SelectItem value="assert_data_state">Assert Data State</SelectItem>
              <SelectItem value="release_document">Release Document</SelectItem>
              <SelectItem value="sign_off_scenario">Sign Off</SelectItem>
              <SelectItem value="capture_evidence">Capture Evidence</SelectItem>
              <SelectItem value="set_test_data">Set Test Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Assignee Class</Label>
          <Select defaultValue={task.default_assignee_class}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Agent (Automated)
                </div>
              </SelectItem>
              <SelectItem value="human">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Human
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {task.default_assignee_class === 'human' && (
          <div className="space-y-2">
            <Label>Service Role</Label>
            <Input defaultValue={task.default_service_role || ''} placeholder="e.g., QA Lead" />
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Criticality</Label>
          <Select defaultValue={task.criticality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      {/* Evidence & Healing */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Evidence Capture</Label>
          <Select defaultValue={task.evidence_capture_profile || 'none'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full (Screenshots + Data)</SelectItem>
              <SelectItem value="minimal">Minimal (Data only)</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Healing Enabled</Label>
            <p className="caption-text">
              Allow AI to auto-heal test failures
            </p>
          </div>
          <Switch defaultChecked={task.healing_enabled} />
        </div>
      </div>
      
      <Separator />
      
      {/* Retry Policy */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Retry Policy</Label>
        <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
          <div className="space-y-2">
            <Label className="text-xs">Max Attempts</Label>
            <Input 
              type="number" 
              defaultValue={task.retry_policy?.max_attempts || 1} 
              min={1} 
              max={5}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Backoff (ms)</Label>
            <Input 
              type="number" 
              defaultValue={task.retry_policy?.backoff_ms || 1000}
              step={500}
            />
          </div>
        </StaggerGrid>
      </div>
      
      <Separator />
      
      {/* IR Reference */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>T-Code</Label>
          <Input defaultValue={task.tcode || ''} placeholder="e.g., VA01" className="font-mono" />
        </div>
        
        <div className="space-y-2">
          <Label>IR Reference</Label>
          <div className="flex gap-2">
            <Input defaultValue={task.ir_id || ''} placeholder="ir_xxx" className="font-mono" />
            <Button variant="outline" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Save */}
      <Button className="w-full">Save Changes</Button>
    </div>
  )
}
