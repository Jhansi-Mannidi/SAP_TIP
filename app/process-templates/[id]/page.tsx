'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  GitBranch,
  List,
  Plus,
  Sparkles,
  LayoutGrid,
  Clock,
  GripVertical,
  Search,
  Bot,
  User,
  Layers,
  AlertTriangle,
  Database,
  CheckCircle2,
  Settings2,
  Workflow,
  FileCheck,
  ShieldCheck,
  Wrench,
  Zap,
  ArrowRight,
  Flag,
  Timer,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  MOCK_PROCESS_TEMPLATE,
  PROCESS_TASK_CATEGORIES,
  PROCESS_TASK_LABELS,
  type ProcessTemplateTask,
  type ProcessTaskCategory,
  type ProcessTaskType,
} from '@/lib/mock-data'

// Category icons
const categoryIcons: Record<ProcessTaskCategory, React.ElementType> = {
  data_prep: Database,
  execution: Zap,
  lifecycle: Workflow,
  verification: FileCheck,
  sign_off: ShieldCheck,
  healing: Wrench,
}

// Task category colors
const categoryColors: Record<ProcessTaskCategory, string> = {
  data_prep: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  execution: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  lifecycle: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  verification: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  sign_off: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  healing: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
}

const categoryBgColors: Record<ProcessTaskCategory, string> = {
  data_prep: 'bg-blue-500',
  execution: 'bg-emerald-500',
  lifecycle: 'bg-violet-500',
  verification: 'bg-amber-500',
  sign_off: 'bg-rose-500',
  healing: 'bg-cyan-500',
}

export default function ProcessTemplateDesignerPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string
  
  // State
  const [viewMode, setViewMode] = React.useState<'graph' | 'list'>('graph')
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [isTaskPickerOpen, setIsTaskPickerOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<ProcessTaskCategory | 'all'>('all')
  
  const template = MOCK_PROCESS_TEMPLATE
  const tasks = template.tasks
  
  const selectedTask = React.useMemo(() => {
    if (!selectedTaskId) return null
    return tasks.find(t => t.id === selectedTaskId) || null
  }, [selectedTaskId, tasks])
  
  // Group tasks by parallel groups and order
  const taskGroups = React.useMemo(() => {
    const groups: { tasks: ProcessTemplateTask[]; isParallel: boolean }[] = []
    let currentGroup: ProcessTemplateTask[] = []
    let currentParallelGroup: string | undefined = undefined
    
    tasks.forEach((task, idx) => {
      if (task.parallel_group) {
        if (task.parallel_group === currentParallelGroup) {
          currentGroup.push(task)
        } else {
          if (currentGroup.length > 0) {
            groups.push({ tasks: currentGroup, isParallel: currentParallelGroup !== undefined })
          }
          currentGroup = [task]
          currentParallelGroup = task.parallel_group
        }
      } else {
        if (currentGroup.length > 0) {
          groups.push({ tasks: currentGroup, isParallel: currentParallelGroup !== undefined })
        }
        currentGroup = [task]
        currentParallelGroup = undefined
      }
    })
    
    if (currentGroup.length > 0) {
      groups.push({ tasks: currentGroup, isParallel: currentParallelGroup !== undefined })
    }
    
    return groups
  }, [tasks])
  
  // Stats
  const stats = React.useMemo(() => {
    const byCategory: Record<string, number> = {}
    let totalDuration = 0
    let criticalPathDuration = 0
    let milestones = 0
    
    tasks.forEach(task => {
      byCategory[task.category] = (byCategory[task.category] || 0) + 1
      totalDuration += task.duration_estimate_mins || 0
      if (task.is_critical_path) {
        criticalPathDuration += task.duration_estimate_mins || 0
      }
      if (task.is_milestone) {
        milestones++
      }
    })
    
    return { byCategory, totalDuration, criticalPathDuration, milestones }
  }, [tasks])
  
  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    const remaining = mins % 60
    return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`
  }

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/process-templates" className="hover:text-foreground transition-colors">
                Process Templates
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">{template.code}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 mt-0.5">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="page-title">{template.name}</h1>
                    <Badge variant="outline" className="font-mono text-xs">{template.version}</Badge>
                    <StatusBadge status={template.state === 'Published' ? 'Completed_Passed' : template.state === 'Draft' ? 'Pending' : 'Failed'} />
                    <Badge variant="secondary" className="capitalize">{template.template_type}</Badge>
                  </div>
                  <p className="page-description mt-1 max-w-2xl">{template.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:inline">Run Template</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Clone Template
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GitBranch className="h-4 w-4 mr-2" />
                      Create Version
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tasks.length}</span>
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{stats.milestones}</span>
                <span className="text-muted-foreground">Milestones</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDuration(stats.totalDuration)}</span>
                <span className="text-muted-foreground">Total Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span className="font-medium">{formatDuration(stats.criticalPathDuration)}</span>
                <span className="text-muted-foreground">Critical Path</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Task Palette (Left) */}
          <div className="hidden lg:flex w-64 border-r flex-col bg-muted/30">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm mb-3">Task Type Registry</h3>
              <Button 
                onClick={() => setIsTaskPickerOpen(true)} 
                size="sm" 
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {(Object.entries(PROCESS_TASK_CATEGORIES) as [ProcessTaskCategory, typeof PROCESS_TASK_CATEGORIES[ProcessTaskCategory]][]).map(([category, config]) => {
                  const CategoryIcon = categoryIcons[category]
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn('w-2 h-2 rounded-full', categoryBgColors[category])} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {config.label}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {config.tasks.map((taskType) => (
                          <div
                            key={taskType}
                            draggable
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-grab hover:bg-accent transition-colors"
                          >
                            <CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate">{PROCESS_TASK_LABELS[taskType]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
          
          {/* Graph View (Center) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="border-b p-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'graph' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('graph')}
                >
                  <GitBranch className="h-4 w-4 mr-1" />
                  Graph
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 lg:hidden" onClick={() => setIsTaskPickerOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate from Intent</span>
                </Button>
              </div>
            </div>
            
            {/* Graph Canvas */}
            <ScrollArea className="flex-1">
              <div className="p-6 min-w-[600px]">
                {viewMode === 'graph' ? (
                  <div className="space-y-3">
                    {/* Phases Legend */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      {(Object.entries(PROCESS_TASK_CATEGORIES) as [ProcessTaskCategory, typeof PROCESS_TASK_CATEGORIES[ProcessTaskCategory]][]).map(([cat, config]) => (
                        <div key={cat} className="flex items-center gap-2 text-xs">
                          <div className={cn('w-3 h-3 rounded', categoryBgColors[cat])} />
                          <span className="text-muted-foreground">{config.label}</span>
                          <Badge variant="secondary" className="text-[10px] h-4">{stats.byCategory[cat] || 0}</Badge>
                        </div>
                      ))}
                    </div>
                    
                    {/* Task Flow */}
                    <div className="relative">
                      {taskGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="mb-4">
                          {group.isParallel ? (
                            <div className="flex items-start gap-4">
                              {/* Parallel branch indicator */}
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                  {group.tasks.length}
                                </div>
                                <div className="w-px h-full bg-border" />
                              </div>
                              {/* Parallel tasks */}
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {group.tasks.map((task) => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    isSelected={selectedTaskId === task.id}
                                    onClick={() => setSelectedTaskId(task.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-4">
                              {/* Sequential indicator */}
                              <div className="flex flex-col items-center">
                                <div className={cn(
                                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                                  group.tasks[0]?.is_milestone ? 'bg-rose-500 text-white' : 'bg-muted'
                                )}>
                                  {group.tasks[0]?.order}
                                </div>
                                {groupIdx < taskGroups.length - 1 && (
                                  <div className="w-px h-8 bg-border" />
                                )}
                              </div>
                              {/* Single task */}
                              <div className="flex-1">
                                {group.tasks.map((task) => (
                                  <TaskCard
                                    key={task.id}
                                    task={task}
                                    isSelected={selectedTaskId === task.id}
                                    onClick={() => setSelectedTaskId(task.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <TaskListRow
                        key={task.id}
                        task={task}
                        isSelected={selectedTaskId === task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Properties Panel (Right) */}
          {selectedTask && (
            <div className="hidden xl:block w-80 border-l bg-muted/20 overflow-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Task Properties</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTaskId(null)}>
                  Close
                </Button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Task Name</Label>
                  <Input value={selectedTask.name} className="mt-1" />
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea value={selectedTask.description} className="mt-1" rows={3} />
                </div>
                
                <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select value={selectedTask.category}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROCESS_TASK_CATEGORIES).map(([cat, config]) => (
                          <SelectItem key={cat} value={cat}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Task Type</Label>
                    <Select value={selectedTask.task_type}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCESS_TASK_CATEGORIES[selectedTask.category].tasks.map((type) => (
                          <SelectItem key={type} value={type}>{PROCESS_TASK_LABELS[type]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </StaggerGrid>
                
                <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
                  <div>
                    <Label className="text-xs text-muted-foreground">Assignee Class</Label>
                    <Select value={selectedTask.assignee_class}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="human">Human</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Duration (mins)</Label>
                    <Input type="number" value={selectedTask.duration_estimate_mins || ''} className="mt-1" />
                  </div>
                </StaggerGrid>
                
                {selectedTask.service_role && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Service Role</Label>
                    <Input value={selectedTask.service_role} className="mt-1" />
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Milestone</Label>
                    <Switch checked={selectedTask.is_milestone} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Critical Path</Label>
                    <Switch checked={selectedTask.is_critical_path} />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-xs text-muted-foreground">Predecessors</Label>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTask.predecessors.length > 0 ? (
                      selectedTask.predecessors.map((predId) => {
                        const predTask = tasks.find(t => t.id === predId)
                        return (
                          <Badge key={predId} variant="secondary" className="text-xs">
                            #{predTask?.order} {predTask?.name.slice(0, 15)}...
                          </Badge>
                        )
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">No predecessors (start task)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task Picker Sheet */}
        <Sheet open={isTaskPickerOpen} onOpenChange={setIsTaskPickerOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Add Task</SheetTitle>
              <SheetDescription>
                Select a task type from the registry to add to your template.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search task types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeCategory === 'all' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </Button>
                {(Object.entries(PROCESS_TASK_CATEGORIES) as [ProcessTaskCategory, typeof PROCESS_TASK_CATEGORIES[ProcessTaskCategory]][]).map(([cat, config]) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {(Object.entries(PROCESS_TASK_CATEGORIES) as [ProcessTaskCategory, typeof PROCESS_TASK_CATEGORIES[ProcessTaskCategory]][])
                    .filter(([cat]) => activeCategory === 'all' || activeCategory === cat)
                    .flatMap(([category, config]) => 
                      config.tasks
                        .filter(type => PROCESS_TASK_LABELS[type].toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((taskType) => {
                          const CategoryIcon = categoryIcons[category as ProcessTaskCategory]
                          return (
                            <Card 
                              key={taskType} 
                              className="cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => {
                                // Would add task here
                                setIsTaskPickerOpen(false)
                              }}
                            >
                              <CardContent className="flex items-center gap-3">
                                <div className={cn('w-8 h-8 rounded flex items-center justify-center', categoryBgColors[category as ProcessTaskCategory])}>
                                  <CategoryIcon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{PROCESS_TASK_LABELS[taskType]}</div>
                                  <div className="text-xs text-muted-foreground">{config.label}</div>
                                </div>
                                <Plus className="h-4 w-4 text-muted-foreground" />
                              </CardContent>
                            </Card>
                          )
                        })
                    )}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  )
}

// Task Card Component
function TaskCard({ 
  task, 
  isSelected, 
  onClick 
}: { 
  task: ProcessTemplateTask
  isSelected: boolean
  onClick: () => void 
}) {
  const CategoryIcon = categoryIcons[task.category]
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary shadow-md',
              task.is_milestone && 'border-rose-500/50',
              task.is_critical_path && 'border-l-4 border-l-rose-500'
            )}
            onClick={onClick}
          >
            <CardContent>
              <div className="flex items-start gap-2">
                <div className={cn('w-6 h-6 rounded flex items-center justify-center shrink-0', categoryBgColors[task.category])}>
                  <CategoryIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{task.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={cn('text-[10px] h-4', categoryColors[task.category])}>
                      {PROCESS_TASK_LABELS[task.task_type]}
                    </Badge>
                    {task.assignee_class === 'agent' ? (
                      <Bot className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <User className="h-3 w-3 text-muted-foreground" />
                    )}
                    {task.duration_estimate_mins && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {task.duration_estimate_mins}m
                      </span>
                    )}
                  </div>
                </div>
                {task.is_milestone && (
                  <Flag className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{task.name}</p>
          <p className="caption-text mt-1">{task.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Task List Row Component
function TaskListRow({ 
  task, 
  isSelected, 
  onClick 
}: { 
  task: ProcessTemplateTask
  isSelected: boolean
  onClick: () => void 
}) {
  const CategoryIcon = categoryIcons[task.category]
  
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent',
        isSelected && 'ring-2 ring-primary bg-accent',
        task.is_critical_path && 'border-l-4 border-l-rose-500'
      )}
      onClick={onClick}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      
      <div className={cn(
        'w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-medium',
        task.is_milestone ? 'bg-rose-500 text-white' : 'bg-muted'
      )}>
        {task.order}
      </div>
      
      <div className={cn('w-8 h-8 rounded flex items-center justify-center shrink-0', categoryBgColors[task.category])}>
        <CategoryIcon className="h-4 w-4 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{task.name}</div>
        <div className="text-xs text-muted-foreground truncate">{task.description}</div>
      </div>
      
      <Badge variant="secondary" className={cn('text-xs shrink-0 hidden sm:flex', categoryColors[task.category])}>
        {PROCESS_TASK_LABELS[task.task_type]}
      </Badge>
      
      {task.assignee_class === 'agent' ? (
        <Badge variant="outline" className="text-xs shrink-0 gap-1">
          <Bot className="h-3 w-3" />
          Agent
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs shrink-0 gap-1">
          <User className="h-3 w-3" />
          {task.service_role || 'Human'}
        </Badge>
      )}
      
      {task.duration_estimate_mins && (
        <span className="text-xs text-muted-foreground shrink-0 hidden md:flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {task.duration_estimate_mins}m
        </span>
      )}
      
      {task.is_milestone && (
        <Flag className="h-4 w-4 text-rose-500 shrink-0" />
      )}
    </div>
  )
}
