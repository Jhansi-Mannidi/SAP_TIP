'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  ArrowLeft,
  Bug,
  Play,
  Sparkles,
  AlertTriangle,
  Code,
  AlertCircle,
  Pencil,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Link2,
  MessageSquare,
  UserPlus,
  FileText,
  Shield,
  History,
  Lightbulb,
  Upload,
  Camera,
  Download,
  ChevronRight,
  Rocket,
  Truck,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Image,
  FileVideo,
  FileCode,
  File,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  MOCK_DEFECT_COMMENTS,
  MOCK_DEFECT_EVIDENCE,
  MOCK_ROOT_CAUSE_LINKS,
  MOCK_RESOLUTION_ACTIVITIES,
  DEFECT_SOURCE_LABELS,
  type Defect,
  type DefectSourceKind,
  type DefectSeverity,
  type DefectState,
  type ITSMSyncState,
  type DefectComment,
  type DefectEvidence,
  type RootCauseLink,
  type ResolutionActivity,
} from '@/lib/defect-mock-data'

// Team members available for assignment
const TEAM_MEMBERS = [
  { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'QA Lead' },
  { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'SAP Consultant' },
  { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'ABAP Developer' },
  { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Test Engineer' },
  { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Functional Analyst' },
] as const

const TEAMS = [
  'SD Functional',
  'MM Functional',
  'FI Functional',
  'CO Functional',
  'PP Functional',
  'ABAP Development',
] as const

function initialsOf(name: string) {
  return name.split(/[\s.]+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
}

function SeverityBadge({ severity, size = 'sm' }: { severity: DefectSeverity; size?: 'sm' | 'lg' }) {
  const config = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  }
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium', 
        config[severity],
        size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs'
      )}
    >
      {severity}
    </Badge>
  )
}

function StateBadge({ state, size = 'sm' }: { state: DefectState; size?: 'sm' | 'lg' }) {
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
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        config[state],
        size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs'
      )}
    >
      {state}
    </Badge>
  )
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

function ITSMSyncBadge({ state }: { state: ITSMSyncState }) {
  const config: Record<ITSMSyncState, { icon: React.ReactNode; color: string; label: string }> = {
    synced: { icon: <CheckCircle className="h-3 w-3" />, color: 'text-emerald-600 border-emerald-200 bg-emerald-50', label: 'Synced' },
    pending: { icon: <Clock className="h-3 w-3" />, color: 'text-amber-600 border-amber-200 bg-amber-50', label: 'Pending' },
    conflict: { icon: <XCircle className="h-3 w-3" />, color: 'text-red-600 border-red-200 bg-red-50', label: 'Conflict' },
    not_linked: { icon: <Link2 className="h-3 w-3" />, color: 'text-muted-foreground', label: 'Not Linked' },
  }
  const c = config[state]
  return (
    <Badge variant="outline" className={cn('text-xs gap-1', c.color)}>
      {c.icon}
      {c.label}
    </Badge>
  )
}

// State lifecycle visualization
function StateLifecycle({ currentState }: { currentState: DefectState }) {
  const states: DefectState[] = ['Open', 'Triaged', 'Assigned', 'In Fix', 'Retest Pending', 'Retest In Progress', 'Closed']
  const currentIndex = states.indexOf(currentState)
  
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {states.map((state, index) => {
        const isActive = state === currentState
        const isPast = index < currentIndex
        const isFuture = index > currentIndex
        
        return (
          <React.Fragment key={state}>
            <div 
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                isActive && 'bg-primary text-primary-foreground',
                isPast && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                isFuture && 'bg-muted text-muted-foreground'
              )}
            >
              {state}
            </div>
            {index < states.length - 1 && (
              <ChevronRight className={cn('h-4 w-4 flex-shrink-0', isPast ? 'text-emerald-500' : 'text-muted-foreground')} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Evidence thumbnail
function EvidenceThumbnail({ evidence }: { evidence: DefectEvidence }) {
  const iconMap: Record<string, React.ReactNode> = {
    screenshot: <Image className="h-8 w-8" />,
    video: <FileVideo className="h-8 w-8" />,
    log: <FileCode className="h-8 w-8" />,
    document: <File className="h-8 w-8" />,
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            {iconMap[evidence.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{evidence.title}</p>
            <p className="caption-text truncate">{evidence.file_name}</p>
            <p className="caption-text">{evidence.file_size_kb} KB</p>
            <div className="flex items-center gap-2 mt-2">
              {evidence.signature_verified ? (
                <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-200">
                  <Shield className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs gap-1 text-amber-600 border-amber-200">
                  <Shield className="h-3 w-3" />
                  Unverified
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Root cause card
function RootCauseCard({ link }: { link: RootCauseLink }) {
  const iconMap: Record<string, React.ReactNode> = {
    si_item: <AlertTriangle className="h-5 w-5" />,
    abap_finding: <Code className="h-5 w-5" />,
    bp_violation: <AlertCircle className="h-5 w-5" />,
    zobject: <FileCode className="h-5 w-5" />,
    transport: <Truck className="h-5 w-5" />,
  }
  
  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            {iconMap[link.entity_type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{link.entity_title}</p>
              {link.ai_suggested && (
                <Badge variant="outline" className="text-xs gap-1 text-violet-600 border-violet-200">
                  <Sparkles className="h-3 w-3" />
                  AI
                </Badge>
              )}
            </div>
            <p className="caption-text mt-1">{link.summary}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{link.entity_state}</Badge>
              <span className="text-xs text-muted-foreground">Linked by {link.linked_by}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Activity item
function ActivityItem({ activity }: { activity: ResolutionActivity }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center',
          activity.actor_type === 'agent' ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'
        )}>
          {activity.actor_type === 'agent' ? <Sparkles className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </div>
        <div className="flex-1 w-px bg-border" />
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{activity.actor}</span>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</span>
        </div>
        <p className="page-description">{activity.action}</p>
        {activity.details && (
          <p className="text-sm mt-1">{activity.details}</p>
        )}
      </div>
    </div>
  )
}

export default function DefectDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = React.useState('summary')

  // --- Action dialog state ---
  const [isTriageOpen, setIsTriageOpen] = React.useState(false)
  const [isReassignOpen, setIsReassignOpen] = React.useState(false)
  const [isCommentOpen, setIsCommentOpen] = React.useState(false)
  const [isSourceOpen, setIsSourceOpen] = React.useState(false)
  const [isItsmOpen, setIsItsmOpen] = React.useState(false)

  // Find defect
  const defect = MOCK_DEFECTS.find(d => d.id === params.id) || MOCK_DEFECTS[0]

  // --- Triage form state ---
  const [triageSeverity, setTriageSeverity] = React.useState<DefectSeverity>(defect.severity)
  const [triagePriority, setTriagePriority] = React.useState(defect.priority)
  const [triageAssigneeId, setTriageAssigneeId] = React.useState(defect.assignee?.id ?? '__unassigned__')
  const [triageTeam, setTriageTeam] = React.useState(defect.assigned_team ?? '')

  // --- Reassign form state ---
  const [reassignTo, setReassignTo] = React.useState(defect.assignee?.id ?? '')
  const [reassignNote, setReassignNote] = React.useState('')

  // --- Comment form state ---
  const [commentText, setCommentText] = React.useState('')
  const [commentIsInternal, setCommentIsInternal] = React.useState(false)

  // Reset form state when opening each dialog
  const openTriage = React.useCallback(() => {
    setTriageSeverity(defect.severity)
    setTriagePriority(defect.priority)
    setTriageAssigneeId(defect.assignee?.id ?? '__unassigned__')
    setTriageTeam(defect.assigned_team ?? '')
    setIsTriageOpen(true)
  }, [defect])

  const openReassign = React.useCallback(() => {
    setReassignTo(defect.assignee?.id ?? '')
    setReassignNote('')
    setIsReassignOpen(true)
  }, [defect])

  const openComment = React.useCallback(() => {
    setCommentText('')
    setCommentIsInternal(false)
    setIsCommentOpen(true)
  }, [])

  const handleSaveTriage = React.useCallback(() => {
    const assignee =
      triageAssigneeId !== '__unassigned__'
        ? TEAM_MEMBERS.find((u) => u.id === triageAssigneeId)
        : null
    toast.success('Triage saved', {
      description: `${defect.code}: ${triageSeverity}/${triagePriority}${
        assignee ? ` → ${assignee.name}` : ''
      }${triageTeam ? ` (${triageTeam})` : ''}`,
    })
    setIsTriageOpen(false)
  }, [defect.code, triageSeverity, triagePriority, triageAssigneeId, triageTeam])

  const handleConfirmReassign = React.useCallback(() => {
    if (!reassignTo) return
    const assignee = TEAM_MEMBERS.find((u) => u.id === reassignTo)
    toast.success('Defect reassigned', {
      description: `${defect.code} assigned to ${assignee?.name ?? 'team member'}.`,
    })
    setIsReassignOpen(false)
  }, [defect.code, reassignTo])

  const handleSubmitComment = React.useCallback(() => {
    if (!commentText.trim()) return
    toast.success(commentIsInternal ? 'Internal note added' : 'Comment posted', {
      description: `${defect.code}: "${commentText.trim().slice(0, 60)}${
        commentText.trim().length > 60 ? '…' : ''
      }"`,
    })
    setIsCommentOpen(false)
  }, [defect.code, commentText, commentIsInternal])

  const handleConfirmOpenItsm = React.useCallback(() => {
    if (!defect.itsm_ref) return
    const url = `https://servicenow.example.com/nav_to.do?uri=incident.do%3Fsysparm_query=number%3D${defect.itsm_ref}`
    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening ITSM ticket', {
      description: `${defect.itsm_ref} opened in a new tab.`,
    })
    setIsItsmOpen(false)
  }, [defect.itsm_ref])

  const handleOpenSourceExternal = React.useCallback(() => {
    if (!defect.source_ref) return
    toast.success('Opening source artifact', {
      description: `Navigating to ${defect.source_ref}…`,
    })
    setIsSourceOpen(false)
  }, [defect.source_ref])
  const comments = MOCK_DEFECT_COMMENTS.filter(c => c.defect_id === defect.id)
  const evidence = MOCK_DEFECT_EVIDENCE.filter(e => e.defect_id === defect.id)
  const rootCauseLinks = MOCK_ROOT_CAUSE_LINKS.filter(r => r.defect_id === defect.id)
  const activities = MOCK_RESOLUTION_ACTIVITIES.filter(a => a.defect_id === defect.id)
  
  // AI suggestion for root cause
  const aiSuggestion = rootCauseLinks.find(r => r.ai_suggested)

  return (
    <AppShell currentApp="defect-manager">
              {/* Back link */}
        <Link href="/defect-manager" className="page-breadcrumb hover:text-foreground w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Defects
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="page-title">{defect.code}</h1>
              <SeverityBadge severity={defect.severity} size="lg" />
              <Badge variant="outline" className="text-sm">{defect.priority}</Badge>
              <StateBadge state={defect.state} size="lg" />
            </div>
            <p className="text-lg">{defect.title}</p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={openTriage}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Triage
            </Button>
            <Button variant="outline" size="sm" onClick={openReassign}>
              <UserPlus className="h-4 w-4 mr-2" />
              Reassign
            </Button>
            <Button variant="outline" size="sm" onClick={openComment}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Comment
            </Button>
            {defect.source_ref && (
              <Button variant="outline" size="sm" onClick={() => setIsSourceOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                View Source
              </Button>
            )}
            {defect.itsm_ref && (
              <Button variant="outline" size="sm" onClick={() => setIsItsmOpen(true)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open ITSM
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="root-cause">Root Cause</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left - Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {defect.description.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>
                        }
                        if (line.match(/^\d\./)) {
                          return <p key={i} className="ml-4">{line}</p>
                        }
                        return <p key={i}>{line}</p>
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Comments ({comments.length})</span>
                      <Button variant="ghost" size="sm">View All</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {comments.slice(0, 3).map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {comment.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
                          </div>
                          <p className="page-description mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                      <div className="flex justify-end mt-2">
                        <Button size="sm">Post Comment</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities.slice(0, 5).map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right - Quick info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Severity</span>
                      <SeverityBadge severity={defect.severity} />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Priority</span>
                      <Badge variant="outline">{defect.priority}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">State</span>
                      <StateBadge state={defect.state} />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Source</span>
                      <SourceChip source={defect.source_kind} />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Opened</span>
                      <span className="text-sm">{formatRelativeTime(defect.opened_at)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Opened By</span>
                      <span className="text-sm">{defect.opened_by.name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Assignee</span>
                      {defect.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {defect.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{defect.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                    {defect.assigned_team && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Team</span>
                          <span className="text-sm">{defect.assigned_team}</span>
                        </div>
                      </>
                    )}
                    {defect.migration && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Migration</span>
                          <Link href={`/migration-cockpit/${defect.migration.id}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                            <Rocket className="h-3 w-3" />
                            {defect.migration.name.substring(0, 20)}...
                          </Link>
                        </div>
                      </>
                    )}
                    {defect.transport && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Transport</span>
                          <Link href={`/transports/${defect.transport.id}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                            <Truck className="h-3 w-3" />
                            {defect.transport.number}
                          </Link>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ITSM Sync</span>
                      <div className="flex items-center gap-2">
                        {defect.itsm_ref && (
                          <a href="#" className="text-sm text-primary hover:underline">{defect.itsm_ref}</a>
                        )}
                        <ITSMSyncBadge state={defect.itsm_sync_state} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Evidence Tab */}
          <TabsContent value="evidence" className="mt-6 space-y-6">
            {defect.source_kind === 'test_failure' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Test Execution Replay</CardTitle>
                  <CardDescription>View the test execution that raised this defect</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="page-description">Replay Surface</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Open Full Replay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Attached Evidence ({evidence.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Paste Screenshot
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.map(ev => (
                <EvidenceThumbnail key={ev.id} evidence={ev} />
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Verify All Signatures
              </Button>
            </div>
          </TabsContent>

          {/* Root Cause Tab */}
          <TabsContent value="root-cause" className="mt-6 space-y-6">
            {/* AI Suggestion Banner */}
            {aiSuggestion && (
              <Card className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Voltus AI Agent Suggestion</p>
                      <p className="page-description mt-1">
                        This defect appears to be caused by <strong>{aiSuggestion.entity_title}</strong>. {aiSuggestion.summary}
                      </p>
                      <p className="caption-text mt-1">Confidence: {aiSuggestion.ai_confidence}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        Dismiss
                      </Button>
                      <Button size="sm" className="gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Linked Root Causes ({rootCauseLinks.length})</h3>
              <Button variant="outline" size="sm">
                <Link2 className="h-4 w-4 mr-2" />
                Link Root Cause
              </Button>
            </div>

            <div className="space-y-3">
              {rootCauseLinks.map(link => (
                <RootCauseCard key={link.id} link={link} />
              ))}
            </div>
          </TabsContent>

          {/* Resolution Tab */}
          <TabsContent value="resolution" className="mt-6 space-y-6">
            {/* State Lifecycle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">State Lifecycle</CardTitle>
              </CardHeader>
              <CardContent>
                <StateLifecycle currentState={defect.state} />
              </CardContent>
            </Card>

            {/* State Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {defect.state === 'In Fix' && (
                  <Button size="sm">Mark Retest Pending</Button>
                )}
                {defect.state === 'Retest Pending' && (
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Trigger Retest
                  </Button>
                )}
                {defect.state === 'Retest In Progress' && (
                  <>
                    <Button size="sm" variant="outline">Mark Retest Failed</Button>
                    <Button size="sm">Close Defect</Button>
                  </>
                )}
                {defect.state !== 'Closed' && defect.state !== 'Rejected' && (
                  <Button size="sm" variant="destructive">Reject Defect</Button>
                )}
              </CardContent>
            </Card>

            {/* Resolution Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resolution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
                <CardDescription>Complete history of all changes to this defect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{activity.actor}</span>
                          <Badge variant={activity.actor_type === 'agent' ? 'secondary' : 'outline'} className="text-xs">
                            {activity.actor_type}
                          </Badge>
                        </div>
                        <p className="text-sm">{activity.action}</p>
                        {activity.details && (
                          <p className="page-description">{activity.details}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs gap-1 text-emerald-600">
                        <Shield className="h-3 w-3" />
                        Signed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      {/* ============ Triage Dialog ============ */}
      <Dialog open={isTriageOpen} onOpenChange={setIsTriageOpen}>
        <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background shrink-0">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    Triage defect
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Confirm severity &amp; priority, then route to the right owner.{' '}
                    <span className="font-mono font-semibold text-foreground">{defect.code}</span>
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            {/* Severity */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Severity
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
                  const active = triageSeverity === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTriageSeverity(opt.value)}
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
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </Label>
              <StaggerGrid columns="grid-cols-4" className="gap-2" fast>
                {(['P1', 'P2', 'P3', 'P4'] as const).map((p) => {
                  const active = triagePriority === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTriagePriority(p)}
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

            <StaggerGrid columns="grid-cols-1 sm:grid-cols-2" className="gap-4" fast>
              {/* Assignee */}
              <div className="space-y-2">
                <Label htmlFor="triage-assignee" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assign to
                </Label>
                <Select value={triageAssigneeId} onValueChange={setTriageAssigneeId}>
                  <SelectTrigger id="triage-assignee" className="h-10">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__unassigned__">
                      <span className="text-sm">Unassigned — triage queue</span>
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

              {/* Team */}
              <div className="space-y-2">
                <Label htmlFor="triage-team" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Team
                </Label>
                <Select value={triageTeam} onValueChange={setTriageTeam}>
                  <SelectTrigger id="triage-team" className="h-10">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAMS.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </StaggerGrid>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2 shrink-0">
            <Button variant="outline" onClick={() => setIsTriageOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTriage}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <CheckCircle className="h-4 w-4" />
              Save triage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Reassign Dialog ============ */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
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
                    <span className="font-mono font-semibold text-foreground">{defect.code}</span> —{' '}
                    {defect.title.slice(0, 60)}
                    {defect.title.length > 60 ? '…' : ''}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current assignee
              </Label>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-muted/40">
                {defect.assignee ? (
                  <>
                    <Avatar className="h-8 w-8 ring-1 ring-border">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                        {initialsOf(defect.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {defect.assignee.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {defect.assignee.email}
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

            <div className="space-y-2">
              <Label htmlFor="reassign-to" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                      disabled={member.id === defect.assignee?.id}
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
                            {member.id === defect.assignee?.id && (
                              <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                                (current)
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{member.role}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reassign-note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Handover note
                <span className="ml-1 text-muted-foreground/70 normal-case font-normal">(optional)</span>
              </Label>
              <Textarea
                id="reassign-note"
                value={reassignNote}
                onChange={(e) => setReassignNote(e.target.value)}
                placeholder="Context for the new assignee — what's been tried, where to start…"
                className="min-h-[88px] text-sm resize-none focus-visible:ring-brand/40"
              />
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsReassignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReassign}
              disabled={!reassignTo || reassignTo === defect.assignee?.id}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <UserPlus className="h-4 w-4" />
              Reassign defect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Comment Dialog ============ */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
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
                    Comment on{' '}
                    <span className="font-mono font-semibold text-foreground">{defect.code}</span>
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment-text" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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

            <div
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                commentIsInternal
                  ? 'border-brand/40 bg-brand-soft/40'
                  : 'border-border bg-muted/30',
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
                  Visible only to the QA team. Customers and ITSM watchers won&apos;t see this.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsCommentOpen(false)}>
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

      {/* ============ View Source Dialog ============ */}
      <Dialog open={isSourceOpen} onOpenChange={setIsSourceOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    View source artifact
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    Jump to the origin of this defect for full context.
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
                  {defect.code}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Source type
                </span>
                <span className="text-sm font-medium text-foreground">
                  {DEFECT_SOURCE_LABELS[defect.source_kind]}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference ID
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {defect.source_ref}
                </span>
              </div>
            </div>
            <p className="page-description text-[11px] flex items-start gap-1.5">
              <ExternalLink className="h-3 w-3 mt-0.5 shrink-0" />
              The source artifact will open in its native viewer (test run, SI item, ABAP scan, etc.).
            </p>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsSourceOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleOpenSourceExternal}
              className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Eye className="h-4 w-4" />
              View source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============ Open ITSM Dialog ============ */}
      <Dialog open={isItsmOpen} onOpenChange={setIsItsmOpen}>
        <DialogContent className="sm:max-w-[460px] p-0 gap-0 overflow-hidden">
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
                  {defect.code}
                </span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ITSM reference
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {defect.itsm_ref}
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
            <Button variant="outline" onClick={() => setIsItsmOpen(false)}>
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
    </AppShell>
  )
}
