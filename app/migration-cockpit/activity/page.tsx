'use client'

import * as React from 'react'
import { 
  Activity,
  Search,
  Filter,
  Calendar,
  Users,
  Bot,
  FileText,
  Play,
  CheckCircle2,
  AlertCircle,
  Settings,
  Database,
  Upload,
  Download,
  GitBranch,
  Shield,
  Clock,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Mock Activity Data
const MOCK_ACTIVITIES = [
  { id: 'a1', timestamp: '2026-05-07T14:30:00', actor: { name: 'P.Sharma', type: 'human', role: 'Migration Manager' }, action: 'approved', entity: 'Cutover Task: Enable production users', category: 'cutover' },
  { id: 'a2', timestamp: '2026-05-07T14:15:00', actor: { name: 'Executor Agent', type: 'agent' }, action: 'completed', entity: 'Data Load: Business Partners to S/4', category: 'data_migration' },
  { id: 'a3', timestamp: '2026-05-07T13:45:00', actor: { name: 'J.Rao', type: 'human', role: 'QA Lead' }, action: 'signed', entity: 'Sign-Off Section: Test Execution Evidence', category: 'signoff' },
  { id: 'a4', timestamp: '2026-05-07T12:30:00', actor: { name: 'Healing Agent', type: 'agent' }, action: 'proposed', entity: 'Healing Promotion: VA01 Extra Modal Fix', category: 'healing' },
  { id: 'a5', timestamp: '2026-05-07T11:00:00', actor: { name: 'M.Reddy', type: 'human', role: 'Test Engineer' }, action: 'resolved', entity: 'Hypercare Issue: ATP Check Timeout', category: 'hypercare' },
  { id: 'a6', timestamp: '2026-05-07T10:30:00', actor: { name: 'Executor Agent', type: 'agent' }, action: 'started', entity: 'Phase: Data Migration', category: 'cutover' },
  { id: 'a7', timestamp: '2026-05-07T09:15:00', actor: { name: 'S.Kumar', type: 'human', role: 'Senior Test Engineer' }, action: 'updated', entity: 'Readiness Gate: Performance Testing', category: 'readiness' },
  { id: 'a8', timestamp: '2026-05-06T18:00:00', actor: { name: 'Executor Agent', type: 'agent' }, action: 'completed', entity: 'Phase: Pre-Cutover Preparation', category: 'cutover' },
  { id: 'a9', timestamp: '2026-05-06T16:30:00', actor: { name: 'P.Sharma', type: 'human', role: 'Migration Manager' }, action: 'approved', entity: 'SI Item: Custom ATP check logic', category: 'si_item' },
  { id: 'a10', timestamp: '2026-05-06T15:00:00', actor: { name: 'Discovery Agent', type: 'agent' }, action: 'detected', entity: 'BP Violation: Missing Credit Check', category: 'bp_violation' },
  { id: 'a11', timestamp: '2026-05-06T14:00:00', actor: { name: 'J.Rao', type: 'human', role: 'QA Lead' }, action: 'reviewed', entity: 'ABAP Finding: Z_SD_PRICING', category: 'abap' },
  { id: 'a12', timestamp: '2026-05-06T12:00:00', actor: { name: 'Executor Agent', type: 'agent' }, action: 'executed', entity: 'Test Suite: Star Cement Cutover Validation', category: 'test_execution' },
]

const actionConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  approved: { color: 'text-emerald-500', icon: CheckCircle2 },
  completed: { color: 'text-emerald-500', icon: CheckCircle2 },
  signed: { color: 'text-emerald-500', icon: CheckCircle2 },
  started: { color: 'text-blue-500', icon: Play },
  proposed: { color: 'text-violet-500', icon: GitBranch },
  resolved: { color: 'text-emerald-500', icon: CheckCircle2 },
  updated: { color: 'text-amber-500', icon: Settings },
  detected: { color: 'text-red-500', icon: AlertCircle },
  reviewed: { color: 'text-blue-500', icon: FileText },
  executed: { color: 'text-blue-500', icon: Play },
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  cutover: { label: 'Cutover', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  data_migration: { label: 'Data Migration', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  signoff: { label: 'Sign-Off', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  healing: { label: 'Healing', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  hypercare: { label: 'Hypercare', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  readiness: { label: 'Readiness', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  si_item: { label: 'SI Item', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  bp_violation: { label: 'BP Violation', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  abap: { label: 'ABAP', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  test_execution: { label: 'Test Execution', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [actorFilter, setActorFilter] = React.useState<string>('all')

  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    const matchesSearch = activity.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.actor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter
    const matchesActor = actorFilter === 'all' || 
                         (actorFilter === 'human' && activity.actor.type === 'human') ||
                         (actorFilter === 'agent' && activity.actor.type === 'agent')
    return matchesSearch && matchesCategory && matchesActor
  })

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(activity)
    return acc
  }, {} as Record<string, typeof MOCK_ACTIVITIES>)

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="page-title">Activity Timeline</h1>
                <p className="page-description mt-1">
                  Complete audit trail of migration activities
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Log
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cutover">Cutover</SelectItem>
                  <SelectItem value="data_migration">Data Migration</SelectItem>
                  <SelectItem value="signoff">Sign-Off</SelectItem>
                  <SelectItem value="healing">Healing</SelectItem>
                  <SelectItem value="hypercare">Hypercare</SelectItem>
                  <SelectItem value="readiness">Readiness</SelectItem>
                  <SelectItem value="test_execution">Test Execution</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actorFilter} onValueChange={setActorFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Actor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actors</SelectItem>
                  <SelectItem value="human">Humans</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, activities]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {date === new Date().toDateString() ? 'Today' : 
                     date === new Date(Date.now() - 86400000).toDateString() ? 'Yesterday' : date}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="space-y-3 pl-2">
                  {activities.map((activity, idx) => {
                    const ActionIcon = actionConfig[activity.action]?.icon || Activity
                    const actionColor = actionConfig[activity.action]?.color || 'text-muted-foreground'
                    const category = categoryConfig[activity.category]
                    
                    return (
                      <div key={activity.id} className="flex gap-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                            activity.actor.type === 'agent' ? 'bg-violet-500/10' : 'bg-primary/10'
                          )}>
                            {activity.actor.type === 'agent' ? (
                              <Bot className="h-4 w-4 text-violet-500" />
                            ) : (
                              <span className="text-xs font-semibold text-primary">
                                {activity.actor.name.split(/[.\s]/).map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            )}
                          </div>
                          {idx < activities.length - 1 && (
                            <div className="w-px h-full bg-border min-h-[24px]" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <Card className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{activity.actor.name}</span>
                                {activity.actor.type === 'human' && 'role' in activity.actor && (
                                  <Badge variant="outline" className="text-xs">
                                    {activity.actor.role}
                                  </Badge>
                                )}
                                <span className={cn('text-sm', actionColor)}>{activity.action}</span>
                              </div>
                              <p className="page-description mt-1">
                                {activity.entity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline" className={cn('text-xs', category?.color)}>
                                {category?.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
