'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  ChevronLeft,
  Play,
  Pause,
  X,
  GripVertical,
  Clock,
  Layers,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { AnimatedNumber, staggerContainer, staggerItem } from '@/lib/animations'

interface QueueItem {
  id: string
  name: string
  code: string
  module: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  scenarios: number
  estimatedDuration: string
  status: 'queued' | 'running' | 'paused'
  progress?: number
  triggeredBy: {
    name: string
    initials: string
  }
  scheduledAt: string
}

const initialQueue: QueueItem[] = [
  {
    id: 'q1',
    name: 'OTC End-to-End Regression',
    code: 'TS_OTC_REG_001',
    module: 'SD',
    priority: 'Critical',
    scenarios: 45,
    estimatedDuration: '2h 15m',
    status: 'running',
    progress: 32,
    triggeredBy: { name: 'Voltus Agent', initials: 'VA' },
    scheduledAt: '2024-01-15T09:00:00',
  },
  {
    id: 'q2',
    name: 'FI Period Close',
    code: 'TS_FI_CLOSE_001',
    module: 'FI',
    priority: 'High',
    scenarios: 28,
    estimatedDuration: '1h 30m',
    status: 'queued',
    triggeredBy: { name: 'Priya Sharma', initials: 'PS' },
    scheduledAt: '2024-01-15T11:30:00',
  },
  {
    id: 'q3',
    name: 'MM Procurement Cycle',
    code: 'TS_MM_PROC_001',
    module: 'MM',
    priority: 'Medium',
    scenarios: 34,
    estimatedDuration: '1h 45m',
    status: 'queued',
    triggeredBy: { name: 'Rahul Kumar', initials: 'RK' },
    scheduledAt: '2024-01-15T13:00:00',
  },
  {
    id: 'q4',
    name: 'PP Production Planning',
    code: 'TS_PP_PLAN_001',
    module: 'PP',
    priority: 'Low',
    scenarios: 22,
    estimatedDuration: '55m',
    status: 'queued',
    triggeredBy: { name: 'Amit Singh', initials: 'AS' },
    scheduledAt: '2024-01-15T14:45:00',
  },
  {
    id: 'q5',
    name: 'CO Cost Center Accounting',
    code: 'TS_CO_CCA_001',
    module: 'CO',
    priority: 'Medium',
    scenarios: 18,
    estimatedDuration: '45m',
    status: 'paused',
    progress: 56,
    triggeredBy: { name: 'Priya Sharma', initials: 'PS' },
    scheduledAt: '2024-01-15T15:30:00',
  },
]

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Critical': return 'text-red-600 bg-red-50 dark:bg-red-950/50'
    case 'High': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/50'
    case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50'
    case 'Low': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
    default: return 'text-muted-foreground bg-muted'
  }
}

export default function ExecutionQueuePage() {
  const [queue, setQueue] = React.useState<QueueItem[]>(initialQueue)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const runningItem = queue.find(item => item.status === 'running')
  const queuedItems = queue.filter(item => item.status === 'queued')
  const pausedItems = queue.filter(item => item.status === 'paused')

  const totalScenarios = queue.reduce((sum, item) => sum + item.scenarios, 0)
  const completedScenarios = runningItem ? Math.floor((runningItem.progress || 0) * runningItem.scenarios / 100) : 0

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleMoveUp = (id: string) => {
    const index = queue.findIndex(item => item.id === id)
    if (index > 0 && queue[index].status === 'queued' && queue[index - 1].status === 'queued') {
      const newQueue = [...queue]
      ;[newQueue[index], newQueue[index - 1]] = [newQueue[index - 1], newQueue[index]]
      setQueue(newQueue)
    }
  }

  const handleMoveDown = (id: string) => {
    const index = queue.findIndex(item => item.id === id)
    if (index < queue.length - 1 && queue[index].status === 'queued' && queue[index + 1].status === 'queued') {
      const newQueue = [...queue]
      ;[newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]]
      setQueue(newQueue)
    }
  }

  const handleRemove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  const handlePause = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'paused' as const } : item
    ))
  }

  const handleResume = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'running' as const } : item
    ))
  }

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/execution-console">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="page-title">Execution Queue</h1>
              <p className="page-description">
                Manage and prioritize test suite executions
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={queue.length} />
                    </p>
                    <p className="caption-text">Total in Queue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Play className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={runningItem ? 1 : 0} />
                    </p>
                    <p className="caption-text">Running</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={queuedItems.length} />
                    </p>
                    <p className="caption-text">Waiting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Pause className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={pausedItems.length} />
                    </p>
                    <p className="caption-text">Paused</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Currently Running */}
        {runningItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-emerald-500/50 bg-emerald-500/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-emerald-500"
                    />
                    <CardTitle className="text-base">Currently Running</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handlePause(runningItem.id)}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{runningItem.name}</p>
                    <p className="page-description">{runningItem.code}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono">{runningItem.module}</Badge>
                    <Badge className={getPriorityColor(runningItem.priority)}>{runningItem.priority}</Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{runningItem.progress}% ({Math.floor((runningItem.progress || 0) * runningItem.scenarios / 100)}/{runningItem.scenarios} scenarios)</span>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  >
                    <Progress value={runningItem.progress} className="h-2" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Queue List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Queued Executions</CardTitle>
            <CardDescription>
              Drag to reorder or use the controls to manage queue priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {queue.filter(item => item.status !== 'running').map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-3 border rounded-lg',
                      item.status === 'paused' && 'bg-amber-500/5 border-amber-500/30'
                    )}
                  >
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.status === 'paused' && (
                          <Badge variant="outline" className="text-amber-600">Paused ({item.progress}%)</Badge>
                        )}
                      </div>
                      <p className="page-description">{item.code}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">{item.module}</Badge>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      <span className="text-sm text-muted-foreground">{item.scenarios} scenarios</span>
                      <span className="text-sm text-muted-foreground">{item.estimatedDuration}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.status === 'paused' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleResume(item.id)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Resume</TooltipContent>
                        </Tooltip>
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveUp(item.id)}
                                disabled={queue.findIndex(q => q.id === item.id) === 0 || item.status !== 'queued'}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move Up</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMoveDown(item.id)}
                                disabled={queue.findIndex(q => q.id === item.id) === queue.length - 1 || item.status !== 'queued'}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move Down</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove from Queue</TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {queue.filter(item => item.status !== 'running').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No items in queue</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
