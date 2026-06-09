'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Bug, 
  Search, 
  Filter, 
  MoreHorizontal,
  Plus,
  AlertTriangle,
  AlertCircle,
  Play,
  Sparkles,
  Code,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  UserPlus,
  MessageSquare,
  Link2,
  RefreshCw,
  Rocket,
  Truck,
  ArrowUpDown,
  Loader2,
  FileText,
  Tag,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  MOCK_DEFECT_KPIS,
  DEFECT_SOURCE_LABELS,
  type Defect,
  type DefectSourceKind,
  type DefectSeverity,
  type DefectPriority,
  type DefectState,
  type ITSMSyncState,
} from '@/lib/defect-mock-data'

// Filter chips
const FILTER_CHIPS = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'critical-high-open', label: 'Critical & High Open', filter: (d: Defect) => (d.severity === 'Critical' || d.severity === 'High') && d.state !== 'Closed' && d.state !== 'Rejected' },
  { id: 'mine', label: 'Mine', filter: (d: Defect) => d.assignee?.id === 'u_1' },
  { id: 'aged', label: 'Aged > 7d', filter: (d: Defect) => { const days = (Date.now() - new Date(d.opened_at).getTime()) / (1000 * 60 * 60 * 24); return days > 7 && d.state !== 'Closed'; } },
  { id: 'cutover', label: 'Linked to Active Cutover', filter: (d: Defect) => !!d.migration },
  { id: 'test-failure', label: 'From Test Failure', filter: (d: Defect) => d.source_kind === 'test_failure' },
  { id: 'si-item', label: 'From SI Item', filter: (d: Defect) => d.source_kind === 'si_item' },
  { id: 'abap', label: 'From ABAP', filter: (d: Defect) => d.source_kind === 'abap_finding' },
]

// Team members available for defect reassignment
const TEAM_MEMBERS = [
  { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'QA Lead' },
  { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'SAP Consultant' },
  { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'ABAP Developer' },
  { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Test Engineer' },
  { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Functional Analyst' },
] as const

function initialsOf(name: string) {
  return name.split(/[\s.]+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
}

function SeverityBadge({ severity }: { severity: DefectSeverity }) {
  const config = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  }
  return <Badge variant="outline" className={cn('text-xs font-medium', config[severity])}>{severity}</Badge>
}

function StateBadge({ state }: { state: DefectState }) {
  const config: Record<DefectState, string> = {
    Open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Triaged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'In Fix': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'Retest Pending': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Retest In Progress': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    Closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Rejected: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[state])}>{state}</Badge>
}

function SourceChip({ source }: { source: DefectSourceKind }) {
  const iconMap: Record<DefectSourceKind, React.ReactNode> = {
    test_failure: <Play className="h-3 w-3" />,
    healing_failure: <Sparkles className="h-3 w-3" />,
    si_item: <AlertTriangle className="h-3 w-3" />,
    abap_finding: <Code className="h-3 w-3" />,
    bp_violation: <AlertCircle className="h-3 w-3" />,
    manual: <Pencil className="h-3 w-3" />,
  }
  return (
    <Badge variant="outline" className="text-xs gap-1">
      {iconMap[source]}
      {DEFECT_SOURCE_LABELS[source]}
    </Badge>
  )
}

function ITSMSyncIcon({ state }: { state: ITSMSyncState }) {
  const config: Record<ITSMSyncState, { icon: React.ReactNode; color: string; label: string }> = {
    synced: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-emerald-500', label: 'Synced' },
    pending: { icon: <Clock className="h-4 w-4" />, color: 'text-amber-500', label: 'Sync Pending' },
    conflict: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-500', label: 'Sync Conflict' },
    not_linked: { icon: <Link2 className="h-4 w-4" />, color: 'text-muted-foreground', label: 'Not Linked' },
  }
  const c = config[state]
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex', c.color)}>{c.icon}</span>
        </TooltipTrigger>
        <TooltipContent>{c.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function AllDefectsPage() {
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedDefects, setSelectedDefects] = React.useState<string[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)
  
  // Advanced filters state
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [severityFilter, setSeverityFilter] = React.useState<string>('all')
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')

  // --- Row action dialogs state ---
  const [reassignDefect, setReassignDefect] = React.useState<Defect | null>(null)
  const [reassignTo, setReassignTo] = React.useState<string>('')
  const [reassignNote, setReassignNote] = React.useState<string>('')

  const [commentDefect, setCommentDefect] = React.useState<Defect | null>(null)
  const [commentText, setCommentText] = React.useState<string>('')
  const [commentIsInternal, setCommentIsInternal] = React.useState(false)

  const [itsmDefect, setItsmDefect] = React.useState<Defect | null>(null)

  // --- Log Defect dialog state ---
  const [logOpen, setLogOpen] = React.useState(false)
  const [logSubmitting, setLogSubmitting] = React.useState(false)
  const initialLogForm = React.useMemo(
    () => ({
      title: '',
      description: '',
      severity: '' as '' | DefectSeverity,
      priority: '' as '' | DefectPriority,
      source_kind: '' as '' | DefectSourceKind,
      module: '',
      assignee_id: '__unassigned__',
      transport: '',
      itsm_ref: '',
    }),
    [],
  )
  const [logForm, setLogForm] = React.useState(initialLogForm)
  const updateLogForm = React.useCallback(
    <K extends keyof typeof initialLogForm>(key: K, value: (typeof initialLogForm)[K]) => {
      setLogForm((prev) => ({ ...prev, [key]: value }))
    },
    [initialLogForm],
  )

  const handleOpenLogDefect = React.useCallback(() => {
    setLogForm(initialLogForm)
    setLogOpen(true)
  }, [initialLogForm])

  const isLogFormValid =
    logForm.title.trim().length >= 5 &&
    logForm.description.trim().length >= 10 &&
    logForm.severity !== '' &&
    logForm.priority !== '' &&
    logForm.source_kind !== '' &&
    logForm.module !== ''

  const handleSubmitLogDefect = React.useCallback(() => {
    if (!isLogFormValid) return
    setLogSubmitting(true)
    // Simulate async submit
    window.setTimeout(() => {
      const nextCode = `DEF-2026-${String(427 + MOCK_DEFECTS.length + 1).padStart(5, '0')}`
      toast.success('Defect logged', {
        description: `${nextCode} created${
          logForm.assignee_id !== '__unassigned__'
            ? ` and assigned to ${
                TEAM_MEMBERS.find((u) => u.id === logForm.assignee_id)?.name ?? 'team member'
              }`
            : ''
        }.`,
      })
      setLogSubmitting(false)
      setLogOpen(false)
    }, 650)
  }, [isLogFormValid, logForm.assignee_id])

  const handleOpenReassign = React.useCallback((defect: Defect) => {
    setReassignDefect(defect)
    setReassignTo(defect.assignee?.id ?? '')
    setReassignNote('')
  }, [])

  const handleOpenComment = React.useCallback((defect: Defect) => {
    setCommentDefect(defect)
    setCommentText('')
    setCommentIsInternal(false)
  }, [])

  const handleConfirmReassign = React.useCallback(() => {
    if (!reassignDefect || !reassignTo) return
    const newAssignee = TEAM_MEMBERS.find((u) => u.id === reassignTo)
    toast.success('Defect reassigned', {
      description: `${reassignDefect.code} assigned to ${newAssignee?.name ?? 'team member'}.`,
    })
    setReassignDefect(null)
  }, [reassignDefect, reassignTo])

  const handleSubmitComment = React.useCallback(() => {
    if (!commentDefect || !commentText.trim()) return
    toast.success(commentIsInternal ? 'Internal note added' : 'Comment posted', {
      description: `${commentDefect.code}: "${commentText.trim().slice(0, 60)}${
        commentText.trim().length > 60 ? '…' : ''
      }"`,
    })
    setCommentDefect(null)
  }, [commentDefect, commentText, commentIsInternal])

  const handleOpenItsmTicket = React.useCallback((defect: Defect) => {
    if (!defect.itsm_ref) return
    setItsmDefect(defect)
  }, [])

  const handleConfirmOpenItsm = React.useCallback(() => {
    if (!itsmDefect?.itsm_ref) return
    const url = `https://servicenow.example.com/nav_to.do?uri=incident.do%3Fsysparm_query=number%3D${itsmDefect.itsm_ref}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening ITSM ticket', {
      description: `${itsmDefect.itsm_ref} opened in a new tab.`,
    })
    setItsmDefect(null)
  }, [itsmDefect])

  const kpis = MOCK_DEFECT_KPIS

  // Apply filters
  const activeChip = FILTER_CHIPS.find(c => c.id === activeFilter)
  const filteredDefects = MOCK_DEFECTS.filter(d => {
    if (!activeChip?.filter(d)) return false
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()) && !d.code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (stateFilter !== 'all' && d.state !== stateFilter) return false
    if (severityFilter !== 'all' && d.severity !== severityFilter) return false
    if (sourceFilter !== 'all' && d.source_kind !== sourceFilter) return false
    return true
  }).sort((a, b) => {
    // Sort by severity desc, then opened_at asc
    const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity]
    }
    return new Date(a.opened_at).getTime() - new Date(b.opened_at).getTime()
  })

  const toggleDefectSelection = (id: string) => {
    setSelectedDefects(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedDefects.length === filteredDefects.length) {
      setSelectedDefects([])
    } else {
      setSelectedDefects(filteredDefects.map(d => d.id))
    }
  }

  return (
    <AppShell currentApp="defect-manager">
      <PageHeader
          title="Defects"
          description="Defect lifecycle from raise through closure. Auto-raised on test failure; manually raised for any observed issue. Synced to ITSM if configured."
          actions={
          <div className="flex items-center gap-2">
            {selectedDefects.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">{selectedDefects.length} selected</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/defect-manager/bulk-triage?ids=${selectedDefects.join(',')}`}>Bulk Triage</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/defect-manager/bulk-assign?ids=${selectedDefects.join(',')}`}>Bulk Assign</Link>
                </Button>
              </>
            )}
            <Button size="sm" onClick={handleOpenLogDefect}>
              <Plus className="h-4 w-4 mr-2" />
              Log Defect
            </Button>
          </div>
          }
        />

        {/* KPI Strip */}
        <StaggerGrid columns="grid-cols-2 sm:grid-cols-5" className="gap-4" fast>
          <Card className="bg-blue-50/80 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value text-blue-700">{kpis.open_total}</div>
                  <div className="text-xs text-blue-600/70 font-medium">Open Total</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-100">
                  <Bug className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50/80 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value text-red-700">{kpis.critical_open}</div>
                  <div className="text-xs text-red-600/70 font-medium">Critical Open</div>
                </div>
                <div className="p-2 rounded-lg bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50/80 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value text-orange-700">{kpis.high_open}</div>
                  <div className="text-xs text-orange-600/70 font-medium">High Open</div>
                </div>
                <div className="p-2 rounded-lg bg-orange-100">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-violet-50/80 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value text-violet-700">{kpis.in_fix}</div>
                  <div className="text-xs text-violet-600/70 font-medium">In Fix</div>
                </div>
                <div className="p-2 rounded-lg bg-violet-100">
                  <Code className="h-4 w-4 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50/80 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value text-emerald-700">{kpis.mttr_hours}h</div>
                  <div className="text-xs text-emerald-600/70 font-medium">MTTC (30d)</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_CHIPS.map(chip => (
            <Button
              key={chip.id}
              variant={activeFilter === chip.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(chip.id)}
              className={cn(
                'rounded-full transition-all duration-200',
                activeFilter === chip.id 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' 
                  : 'bg-white hover:bg-gray-50 hover:border-gray-300'
              )}
            >
              {chip.label}
            </Button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search defects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shadow-sm hover:shadow-md transition-shadow">
                <Filter className="h-4 w-4" />
                Filters
                {(stateFilter !== 'all' || severityFilter !== 'all' || sourceFilter !== 'all') && (
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {[stateFilter !== 'all', severityFilter !== 'all', sourceFilter !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[340px] sm:w-[400px] p-0 bg-gray-50/50">
              <div className="bg-white border-b px-6 py-4">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <Filter className="h-4 w-4 text-indigo-600" />
                    </div>
                    Filter Defects
                  </SheetTitle>
                  <p className="page-description mt-1">
                    Narrow down defects by applying filters
                  </p>
                </SheetHeader>
              </div>
              
              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* State Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-blue-50">
                      <AlertCircle className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <Label className="text-sm font-semibold text-gray-700">State</Label>
                  </div>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger className="bg-gray-50/80 border-gray-200 hover:bg-gray-100/80 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          All States
                        </span>
                      </SelectItem>
                      <SelectItem value="Open">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Open
                        </span>
                      </SelectItem>
                      <SelectItem value="Triaged">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Triaged
                        </span>
                      </SelectItem>
                      <SelectItem value="Assigned">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          Assigned
                        </span>
                      </SelectItem>
                      <SelectItem value="In Fix">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-violet-500" />
                          In Fix
                        </span>
                      </SelectItem>
                      <SelectItem value="Retest Pending">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-500" />
                          Retest Pending
                        </span>
                      </SelectItem>
                      <SelectItem value="Retest In Progress">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-teal-500" />
                          Retest In Progress
                        </span>
                      </SelectItem>
                      <SelectItem value="Closed">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Closed
                        </span>
                      </SelectItem>
                      <SelectItem value="Rejected">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-500" />
                          Rejected
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-red-50">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <Label className="text-sm font-semibold text-gray-700">Severity</Label>
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="bg-gray-50/80 border-gray-200 hover:bg-gray-100/80 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          All Severities
                        </span>
                      </SelectItem>
                      <SelectItem value="Critical">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Critical
                        </span>
                      </SelectItem>
                      <SelectItem value="High">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500" />
                          High
                        </span>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value="Low">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          Low
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source Filter */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-violet-50">
                      <Code className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <Label className="text-sm font-semibold text-gray-700">Source</Label>
                  </div>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="bg-gray-50/80 border-gray-200 hover:bg-gray-100/80 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          All Sources
                        </span>
                      </SelectItem>
                      <SelectItem value="test_failure">
                        <span className="flex items-center gap-2">
                          <Play className="h-3 w-3 text-red-500" />
                          Test Failure
                        </span>
                      </SelectItem>
                      <SelectItem value="healing_failure">
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          Healing Failure
                        </span>
                      </SelectItem>
                      <SelectItem value="si_item">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          SI Item
                        </span>
                      </SelectItem>
                      <SelectItem value="abap_finding">
                        <span className="flex items-center gap-2">
                          <Code className="h-3 w-3 text-violet-500" />
                          ABAP Finding
                        </span>
                      </SelectItem>
                      <SelectItem value="bp_violation">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-blue-500" />
                          BP Violation
                        </span>
                      </SelectItem>
                      <SelectItem value="manual">
                        <span className="flex items-center gap-2">
                          <Pencil className="h-3 w-3 text-gray-500" />
                          Manual
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters Summary */}
                {(stateFilter !== 'all' || severityFilter !== 'all' || sourceFilter !== 'all') && (
                  <div className="bg-indigo-50/80 rounded-xl p-4 border border-indigo-100">
                    <p className="text-xs font-medium text-indigo-700 mb-2">Active Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {stateFilter !== 'all' && (
                        <Badge variant="secondary" className="bg-white text-indigo-700 border border-indigo-200 gap-1">
                          State: {stateFilter}
                          <button onClick={() => setStateFilter('all')} className="ml-1 hover:text-indigo-900">
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {severityFilter !== 'all' && (
                        <Badge variant="secondary" className="bg-white text-indigo-700 border border-indigo-200 gap-1">
                          Severity: {severityFilter}
                          <button onClick={() => setSeverityFilter('all')} className="ml-1 hover:text-indigo-900">
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {sourceFilter !== 'all' && (
                        <Badge variant="secondary" className="bg-white text-indigo-700 border border-indigo-200 gap-1">
                          Source: {DEFECT_SOURCE_LABELS[sourceFilter as DefectSourceKind]}
                          <button onClick={() => setSourceFilter('all')} className="ml-1 hover:text-indigo-900">
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-6 py-4">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-gray-50 hover:bg-gray-100" 
                    onClick={() => { setStateFilter('all'); setSeverityFilter('all'); setSourceFilter('all'); }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all" 
                    onClick={() => setIsFiltersOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {filteredDefects.map(defect => (
            <Card key={defect.id} className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={selectedDefects.includes(defect.id)}
                  onCheckedChange={() => toggleDefectSelection(defect.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link 
                      href={`/defect-manager/defects/${defect.id}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {defect.code}
                    </Link>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={defect.severity} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/defect-manager/defects/${defect.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenReassign(defect)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenComment(defect)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </DropdownMenuItem>
                          {defect.itsm_ref && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => handleOpenItsmTicket(defect)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open ITSM Ticket
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-1 line-clamp-2">{defect.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <StateBadge state={defect.state} />
                    <SourceChip source={defect.source_kind} />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{defect.assignee?.name || 'Unassigned'}</span>
                    <span>{formatRelativeTime(defect.opened_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={selectedDefects.length === filteredDefects.length && filteredDefects.length > 0}
                      onCheckedChange={toggleAllSelection}
                    />
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Migration</TableHead>
                  <TableHead>Transport</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>ITSM</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDefects.map(defect => (
                  <TableRow key={defect.id} className="group">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedDefects.includes(defect.id)}
                        onCheckedChange={() => toggleDefectSelection(defect.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/defect-manager/defects/${defect.id}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {defect.code}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block text-sm">{defect.title}</span>
                    </TableCell>
                    <TableCell><SeverityBadge severity={defect.severity} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{defect.priority}</Badge>
                    </TableCell>
                    <TableCell><StateBadge state={defect.state} /></TableCell>
                    <TableCell><SourceChip source={defect.source_kind} /></TableCell>
                    <TableCell>
                      {defect.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{defect.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{defect.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {defect.migration && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Rocket className="h-3 w-3" />
                          {defect.migration.name.substring(0, 15)}...
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {defect.transport && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Truck className="h-3 w-3" />
                          {defect.transport.number}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(defect.opened_at)}</span>
                          </TooltipTrigger>
                          <TooltipContent>{new Date(defect.opened_at).toLocaleString()}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {defect.itsm_ref && (
                          <a 
                            href="#" 
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {defect.itsm_ref}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <ITSMSyncIcon state={defect.itsm_sync_state} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/defect-manager/defects/${defect.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenReassign(defect)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenComment(defect)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                          </DropdownMenuItem>
                          {defect.itsm_ref && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => handleOpenItsmTicket(defect)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open ITSM Ticket
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Results count */}
        <div className="text-sm text-muted-foreground text-center lg:text-left">
          Showing {filteredDefects.length} of {MOCK_DEFECTS.length} defects
        </div>

      {/* Reassign Dialog */}
      <Dialog
        open={reassignDefect !== null}
        onOpenChange={(open) => !open && setReassignDefect(null)}
      >
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    Reassign defect
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    {reassignDefect && (
                      <>
                        <span className="font-mono font-semibold text-foreground">
                          {reassignDefect.code}
                        </span>{' '}
                        — {reassignDefect.title.slice(0, 60)}
                        {reassignDefect.title.length > 60 ? '…' : ''}
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-5">
            {/* Current assignee */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current assignee
              </Label>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-muted/40">
                {reassignDefect?.assignee ? (
                  <>
                    <Avatar className="h-8 w-8 ring-1 ring-border">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                        {initialsOf(reassignDefect.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {reassignDefect.assignee.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {reassignDefect.assignee.email}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="page-breadcrumb">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    Unassigned
                  </div>
                )}
              </div>
            </div>

            {/* Pick new assignee */}
            <div className="space-y-2">
              <Label
                htmlFor="reassign-to"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Reassign to
              </Label>
              <Select value={reassignTo} onValueChange={setReassignTo}>
                <SelectTrigger id="reassign-to" className="h-10">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_MEMBERS.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id}
                      disabled={member.id === reassignDefect?.assignee?.id}
                    >
                      <div className="flex items-center gap-2.5 py-0.5">
                        <Avatar className="h-7 w-7 ring-1 ring-border">
                          <AvatarFallback className="bg-muted text-foreground text-[10px] font-semibold">
                            {initialsOf(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-medium text-foreground">
                            {member.name}
                            {member.id === reassignDefect?.assignee?.id && (
                              <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                                (current)
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Optional handover note */}
            <div className="space-y-2">
              <Label
                htmlFor="reassign-note"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Handover note
                <span className="ml-1 text-muted-foreground/70 normal-case font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="reassign-note"
                value={reassignNote}
                onChange={(e) => setReassignNote(e.target.value)}
                placeholder="Add context for the new assignee — what's been tried, where to start, blockers…"
                className="min-h-[88px] text-sm resize-none focus-visible:ring-brand/40"
              />
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setReassignDefect(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReassign}
              disabled={!reassignTo || reassignTo === reassignDefect?.assignee?.id}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <UserPlus className="h-4 w-4" />
              Reassign defect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog
        open={commentDefect !== null}
        onOpenChange={(open) => !open && setCommentDefect(null)}
      >
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    Add comment
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    {commentDefect && (
                      <>
                        Comment on{' '}
                        <span className="font-mono font-semibold text-foreground">
                          {commentDefect.code}
                        </span>
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="comment-text"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Your comment
              </Label>
              <Textarea
                id="comment-text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share an update, link a fix, mention a teammate with @, or describe blockers…"
                className="min-h-[120px] text-sm resize-none focus-visible:ring-brand/40"
                autoFocus
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Markdown supported.</span>
                <span className={cn(commentText.length > 1000 && 'text-destructive')}>
                  {commentText.length} / 2000
                </span>
              </div>
            </div>

            {/* Internal note toggle */}
            <div
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                commentIsInternal
                  ? 'border-brand/40 bg-brand-soft/40'
                  : 'border-border bg-muted/30'
              )}
            >
              <Switch
                id="comment-internal"
                checked={commentIsInternal}
                onCheckedChange={setCommentIsInternal}
                className="mt-0.5 data-[state=checked]:bg-brand"
              />
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor="comment-internal"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Internal note
                </Label>
                <p className="section-description text-[11px] mt-0.5">
                  Visible only to the QA team. Customers and ITSM watchers won&apos;t see this comment.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setCommentDefect(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || commentText.length > 2000}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <MessageSquare className="h-4 w-4" />
              {commentIsInternal ? 'Post internal note' : 'Post comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open ITSM Ticket Dialog */}
      <Dialog
        open={itsmDefect !== null}
        onOpenChange={(open) => !open && setItsmDefect(null)}
      >
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden gap-0">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    Open ITSM ticket
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Continue in ServiceNow to manage this incident.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-3">
            <div className="rounded-lg border border-border bg-muted/30 divide-y divide-border">
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Defect
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">
                  {itsmDefect?.code}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ITSM reference
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {itsmDefect?.itsm_ref}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System
                </span>
                <span className="text-sm font-medium text-foreground">ServiceNow</span>
              </div>
            </div>
            <p className="page-description text-[11px] flex items-start gap-1.5">
              <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" />
              The ticket will open in a new tab. You may need to authenticate with your corporate SSO.
            </p>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setItsmDefect(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOpenItsm}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <ExternalLink className="h-4 w-4" />
              Open in ServiceNow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Defect Dialog */}
      <Dialog open={logOpen} onOpenChange={(open) => !logSubmitting && setLogOpen(open)}>
        <DialogContent className="sm:max-w-[640px] p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background shrink-0">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <Bug className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    Log a new defect
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Manually raise a defect for an observed issue. It will be synced to your ITSM if configured.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 sm:px-6 py-5 space-y-6">
              {/* Section: Summary */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-brand" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Summary
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-title" className="text-xs font-medium">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="log-title"
                    value={logForm.title}
                    onChange={(e) => updateLogForm('title', e.target.value)}
                    placeholder="e.g., ME21N: ZTERM not validated when posting to vendor"
                    className="h-10 focus-visible:ring-brand/40"
                    maxLength={140}
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Short, action-oriented summary</span>
                    <span className={cn(logForm.title.length > 120 && 'text-amber-600')}>
                      {logForm.title.length} / 140
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-description" className="text-xs font-medium">
                    Description &amp; steps to reproduce <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="log-description"
                    value={logForm.description}
                    onChange={(e) => updateLogForm('description', e.target.value)}
                    placeholder={
                      'What happened, what was expected, and the steps to reproduce.\n\n1. Open ME21N\n2. ...\n\nExpected: ...\nActual: ...'
                    }
                    className="min-h-[140px] text-sm font-mono leading-relaxed resize-none focus-visible:ring-brand/40"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Markdown supported. Minimum 10 characters.</span>
                    <span>{logForm.description.length} chars</span>
                  </div>
                </div>
              </section>

              {/* Section: Classification */}
              <section className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-brand" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Classification
                  </h3>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Severity <span className="text-destructive">*</span>
                  </Label>
                  <StaggerGrid columns="grid-cols-2 sm:grid-cols-4" className="gap-2" fast>
                    {(
                      [
                        { value: 'Critical', tone: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' },
                        { value: 'High', tone: 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100' },
                        { value: 'Medium', tone: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' },
                        { value: 'Low', tone: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                      ] as const
                    ).map((opt) => {
                      const active = logForm.severity === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateLogForm('severity', opt.value)}
                          className={cn(
                            'h-9 rounded-md border text-xs font-semibold transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                            active
                              ? `${opt.tone} ring-2 ring-offset-1 ring-offset-background`
                              : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                          )}
                        >
                          {opt.value}
                        </button>
                      )
                    })}
                  </StaggerGrid>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <StaggerGrid columns="grid-cols-4" className="gap-2" fast>
                    {(['P1', 'P2', 'P3', 'P4'] as const).map((p) => {
                      const active = logForm.priority === p
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateLogForm('priority', p)}
                          className={cn(
                            'h-9 rounded-md border font-mono text-sm font-semibold transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                            active
                              ? 'border-brand bg-brand text-brand-foreground shadow-sm'
                              : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                          )}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </StaggerGrid>
                </div>

                {/* Source + Module */}
                <StaggerGrid columns="grid-cols-1 sm:grid-cols-2" className="gap-4" fast>
                  <div className="space-y-2">
                    <Label htmlFor="log-source" className="text-xs font-medium">
                      Source <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={logForm.source_kind}
                      onValueChange={(v) => updateLogForm('source_kind', v as DefectSourceKind)}
                    >
                      <SelectTrigger id="log-source" className="h-10">
                        <SelectValue placeholder="How was it found?" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(DEFECT_SOURCE_LABELS) as [DefectSourceKind, string][]).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log-module" className="text-xs font-medium">
                      Module <span className="text-destructive">*</span>
                    </Label>
                    <Select value={logForm.module} onValueChange={(v) => updateLogForm('module', v)}>
                      <SelectTrigger id="log-module" className="h-10">
                        <SelectValue placeholder="SAP module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SD">SD — Sales &amp; Distribution</SelectItem>
                        <SelectItem value="MM">MM — Materials Management</SelectItem>
                        <SelectItem value="FI">FI — Finance</SelectItem>
                        <SelectItem value="CO">CO — Controlling</SelectItem>
                        <SelectItem value="PP">PP — Production Planning</SelectItem>
                        <SelectItem value="HR">HR — Human Resources</SelectItem>
                        <SelectItem value="PM">PM — Plant Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </StaggerGrid>
              </section>

              {/* Section: Assignment */}
              <section className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5 text-brand" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Assignment
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-assignee" className="text-xs font-medium">
                    Assignee
                    <span className="ml-1 text-muted-foreground/70 font-normal">(optional)</span>
                  </Label>
                  <Select
                    value={logForm.assignee_id}
                    onValueChange={(v) => updateLogForm('assignee_id', v)}
                  >
                    <SelectTrigger id="log-assignee" className="h-10">
                      <SelectValue placeholder="Leave unassigned for triage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__unassigned__">
                        <div className="flex items-center gap-2.5 py-0.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                            <UserPlus className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">Unassigned — triage queue</span>
                        </div>
                      </SelectItem>
                      {TEAM_MEMBERS.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2.5 py-0.5">
                            <Avatar className="h-7 w-7 ring-1 ring-border">
                              <AvatarFallback className="bg-muted text-foreground text-[10px] font-semibold">
                                {initialsOf(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                              <span className="text-sm font-medium text-foreground">{member.name}</span>
                              <span className="text-[11px] text-muted-foreground">{member.role}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* Section: References */}
              <section className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-brand" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    References
                    <span className="ml-1.5 text-muted-foreground/70 normal-case font-normal">
                      (optional)
                    </span>
                  </h3>
                </div>

                <StaggerGrid columns="grid-cols-1 sm:grid-cols-2" className="gap-4" fast>
                  <div className="space-y-2">
                    <Label
                      htmlFor="log-transport"
                      className="text-xs font-medium flex items-center gap-1.5"
                    >
                      <Truck className="h-3 w-3" />
                      Transport request
                    </Label>
                    <Input
                      id="log-transport"
                      value={logForm.transport}
                      onChange={(e) => updateLogForm('transport', e.target.value.toUpperCase())}
                      placeholder="STAK900123"
                      className="h-10 font-mono text-sm focus-visible:ring-brand/40"
                      maxLength={12}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="log-itsm"
                      className="text-xs font-medium flex items-center gap-1.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                      ITSM reference
                    </Label>
                    <Input
                      id="log-itsm"
                      value={logForm.itsm_ref}
                      onChange={(e) => updateLogForm('itsm_ref', e.target.value.toUpperCase())}
                      placeholder="INC0012345"
                      className="h-10 font-mono text-sm focus-visible:ring-brand/40"
                      maxLength={12}
                    />
                  </div>
                </StaggerGrid>
              </section>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setLogOpen(false)}
              disabled={logSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitLogDefect}
              disabled={!isLogFormValid || logSubmitting}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90 min-w-[140px]"
            >
              {logSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Log defect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
