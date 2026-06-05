'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
  Bug,
  TestTube2,
  GitBranch,
  ArrowRight,
  MoreHorizontal,
  Play,
  Info,
  Filter,
  RefreshCw,
  X,
  Loader2,
  Eye,
  Pause,
  RotateCcw,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge, PriorityBadge } from '@/components/status-badge'
import { FilterDrawer, ActiveFilters, type FilterConfig } from '@/components/filter-drawer'
import { useFilters, useFilteredData, useDebounce } from '@/lib/filter-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MOCK_TEST_SUITES,
  MOCK_DEFECTS,
  MOCK_TRANSPORTS,
  MOCK_MIGRATION,
  mockActivities,
  mockDashboardMetrics,
  mockTestRuns,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { 
  AnimatedNumber, 
  AnimatedProgressRing, 
  AnimatedCard, 
  AnimatedList, 
  AnimatedListItem,
  staggerContainer,
  staggerContainerFast,
  staggerItem,
  staggerItemScale,
  cardHover,
  fadeInUp
} from '@/lib/animations'

// Filter configuration
const filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'multiselect',
    options: [
      { value: 'Running', label: 'Running', count: 2 },
      { value: 'Passed', label: 'Passed', count: 3 },
      { value: 'Failed', label: 'Failed', count: 1 },
      { value: 'Healed', label: 'Healed', count: 2 },
      { value: 'Scheduled', label: 'Scheduled', count: 4 },
    ],
  },
  {
    key: 'module',
    label: 'Module',
    type: 'multiselect',
    options: [
      { value: 'SD', label: 'SD - Sales', count: 12 },
      { value: 'MM', label: 'MM - Materials', count: 8 },
      { value: 'FI', label: 'FI - Finance', count: 15 },
      { value: 'CO', label: 'CO - Controlling', count: 6 },
      { value: 'PP', label: 'PP - Production', count: 4 },
    ],
  },
  {
    key: 'assignee',
    label: 'Assignee',
    type: 'select',
    options: [
      { value: 'priya', label: 'Priya Sharma' },
      { value: 'agent', label: 'Voltus Agent' },
      { value: 'rahul', label: 'Rahul Mehta' },
      { value: 'anita', label: 'Anita Desai' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Time Period',
    type: 'daterange',
  },
  {
    key: 'criticalOnly',
    label: 'Priority',
    type: 'checkbox',
    placeholder: 'Show critical items only',
  },
]

const initialFilters = {
  status: [] as string[],
  module: [] as string[],
  assignee: '',
  dateRange: 'all',
  criticalOnly: false,
}

// Color variants for KPI cards with faded backgrounds
const cardColorVariants = {
  blue: {
    bg: 'bg-blue-50/80',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hover: 'hover:bg-blue-50'
  },
  green: {
    bg: 'bg-emerald-50/80',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hover: 'hover:bg-emerald-50'
  },
  red: {
    bg: 'bg-red-50/80',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    hover: 'hover:bg-red-50'
  },
  amber: {
    bg: 'bg-amber-50/80',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    hover: 'hover:bg-amber-50'
  },
  purple: {
    bg: 'bg-violet-50/80',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    hover: 'hover:bg-violet-50'
  },
  cyan: {
    bg: 'bg-cyan-50/80',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    hover: 'hover:bg-cyan-50'
  },
  indigo: {
    bg: 'bg-indigo-50/80',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    hover: 'hover:bg-indigo-50'
  },
  default: {
    bg: 'bg-white',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    hover: 'hover:bg-gray-50/50'
  }
}

// Metric Card Component with Animation
function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  onClick,
  animated = false,
  colorVariant = 'default',
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
  description?: string
  onClick?: () => void
  animated?: boolean
  colorVariant?: keyof typeof cardColorVariants
}) {
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.]/g, '')) 
    : value
  const suffix = typeof value === 'string' 
    ? value.replace(/[0-9.]/g, '') 
    : ''
  
  const colors = cardColorVariants[colorVariant]

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02, y: -4 } : { y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card 
        className={cn(
          'h-full relative overflow-hidden group border-0 shadow-sm',
          colors.bg,
          colors.hover,
          'transition-all duration-300',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div
            initial={animated ? { scale: 0, rotate: -180 } : undefined}
            animate={animated ? { scale: 1, rotate: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
            className={cn('p-2 rounded-lg', colors.iconBg)}
          >
            <Icon className={cn('h-4 w-4', colors.iconColor)} />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div 
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            initial={animated ? { opacity: 0, y: 10 } : undefined}
            animate={animated ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {animated && !isNaN(numericValue) ? (
              <AnimatedNumber value={numericValue} suffix={suffix} />
            ) : (
              value
            )}
          </motion.div>
          {(change || description) && (
            <motion.div 
              className="flex items-center gap-1.5 mt-2"
              initial={animated ? { opacity: 0, y: 5 } : undefined}
              animate={animated ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              {change && (
                <span className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  changeType === 'increase' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                  changeType === 'decrease' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  !changeType && 'bg-muted text-muted-foreground'
                )}>
                  {changeType === 'increase' && <TrendingUp className="h-3 w-3" />}
                  {changeType === 'decrease' && <TrendingDown className="h-3 w-3" />}
                  {change}
                </span>
              )}
              {description && (
                <span className="text-xs text-muted-foreground">{description}</span>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Test Suite Progress Ring
function ProgressRing({
  passed,
  failed,
  healed,
  total,
}: {
  passed: number
  failed: number
  healed: number
  total: number
}) {
  const passedPercent = (passed / total) * 100
  const healedPercent = (healed / total) * 100
  const failedPercent = (failed / total) * 100
  const percentage = Math.round(((passed + healed) / total) * 100)

  return (
    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/30"
        />
        {/* Passed segment */}
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${passedPercent} ${100 - passedPercent}`}
          className="text-emerald-500"
        />
        {/* Healed segment */}
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${healedPercent} ${100 - healedPercent}`}
          strokeDashoffset={`-${passedPercent}`}
          className="text-amber-500"
        />
        {/* Failed segment */}
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${failedPercent} ${100 - failedPercent}`}
          strokeDashoffset={`-${passedPercent + healedPercent}`}
          className="text-red-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-semibold",
          percentage > 100 ? "text-lg text-red-500" : "text-xl"
        )}>
          {percentage}%
        </span>
      </div>
    </div>
  )
}

// Activity Item Component
function ActivityItem({
  action,
  actor,
  timestamp,
  details,
}: {
  action: string
  actor: { name: string; class: 'human' | 'agent' }
  timestamp: string
  details?: string
}) {
  const initials = actor.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            'text-xs',
            actor.class === 'agent'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {actor.class === 'agent' ? 'AI' : initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{actor.name}</span>
          {actor.class === 'agent' && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3 w-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Generated by Voltus AI Agent</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-sm text-foreground">{action}</p>
        {details && (
          <p className="caption-text mt-0.5">{details}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
          {new Date(timestamp).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
          })}
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const metrics = mockDashboardMetrics
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [runAllDialog, setRunAllDialog] = React.useState(false)
  const [selectedRun, setSelectedRun] = React.useState<typeof mockTestRuns[0] | null>(null)
  const [detailsDialog, setDetailsDialog] = React.useState(false)
  
  // Filter state
  const {
    filters,
    setFilter,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
  } = useFilters(initialFilters)

  // Filter test runs based on active filters
  const filteredTestRuns = React.useMemo(() => {
    return mockTestRuns.filter(run => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(run.state)) {
        return false
      }
      // Module filter
      if (filters.module.length > 0) {
        const hasModule = run.suite.modules.some(m => filters.module.includes(m))
        if (!hasModule) return false
      }
      // Assignee filter
      if (filters.assignee) {
        const assigneeMatch = filters.assignee === 'agent' 
          ? run.triggered_by.class === 'agent'
          : run.triggered_by.name.toLowerCase().includes(filters.assignee)
        if (!assigneeMatch) return false
      }
      return true
    })
  }, [filters])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  // Handle run all scheduled
  const handleRunAllScheduled = async () => {
    setRunAllDialog(false)
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  // View run details
  const handleViewDetails = (run: typeof mockTestRuns[0]) => {
    setSelectedRun(run)
    setDetailsDialog(true)
  }

  return (
    <AppShell currentApp="dashboard">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">
              Test Execution Dashboard
            </h1>
            <p className="page-description mt-1">
              Star Cement S/4HANA Migration — Quality Assurance Overview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterDrawer
              filters={filterConfigs}
              values={filters}
              onChange={(key, value) => setFilter(key as keyof typeof filters, value)}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" onClick={() => setRunAllDialog(true)}>
              <Play className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Run All Scheduled</span>
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <ActiveFilters
            filters={filterConfigs}
            values={filters}
            onClear={(key) => clearFilter(key as keyof typeof filters)}
            onClearAll={resetFilters}
          />
        )}

        {/* Metrics Grid with Animations */}
        <motion.div 
          className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MetricCard
              title="Test Scenarios"
              value={metrics.totalScenarios}
              description={`${metrics.totalTestSuites} suites`}
              icon={TestTube2}
              onClick={() => window.location.href = '/test-repository/scenarios'}
              animated
              colorVariant="blue"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title="Pass Rate"
              value={`${metrics.passRate}%`}
              change={`${metrics.healingRate}% auto-healed`}
              changeType="increase"
              icon={CheckCircle2}
              onClick={() => window.location.href = '/analytics/pass-rate'}
              animated
              colorVariant="green"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title="Open Defects"
              value={metrics.openDefects}
              description={`${metrics.criticalDefects} critical`}
              icon={Bug}
              onClick={() => window.location.href = '/defect-manager'}
              animated
              colorVariant="red"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title="Days to Cutover"
              value={metrics.daysToCutover}
              description={`${metrics.cutoverReadiness}% ready`}
              icon={Activity}
              onClick={() => window.location.href = '/cutover'}
              animated
              colorVariant="indigo"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid gap-4 sm:gap-6 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Test Execution Summary */}
          <motion.div
            className="lg:col-span-2"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden h-full">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                <div>
                  <CardTitle className="text-base sm:text-lg">Test Execution Summary</CardTitle>
                  <CardDescription>
                    Recent test suite executions and their status
                  </CardDescription>
                </div>
                <Link href="/execution-console">
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardHeader>
            <CardContent className="sm: sm:">
              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-border">
                {filteredTestRuns.map((run) => (
                  <div 
                    key={run.id} 
                    className="p-4 space-y-2"
                    onClick={() => handleViewDetails(run)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{run.suite.name}</div>
                        <div className="text-xs text-muted-foreground">{run.suite.code}</div>
                      </div>
                      <StatusBadge status={run.state} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={((run.passed + run.healed) / run.total) * 100}
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {run.passed + run.healed}/{run.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {run.suite.modules.slice(0, 2).map((mod) => (
                          <Badge key={mod} variant="outline" className="font-mono text-xs">
                            {mod}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className={cn(
                            'text-[10px]',
                            run.triggered_by.class === 'agent' && 'bg-primary text-primary-foreground'
                          )}>
                            {run.triggered_by.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {run.triggered_by.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[280px]">Test Suite</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestRuns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No test runs match the current filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTestRuns.map((run) => (
                        <TableRow 
                          key={run.id} 
                          className="cursor-pointer"
                          onClick={() => handleViewDetails(run)}
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{run.suite.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {run.suite.code}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {run.suite.modules.slice(0, 2).map((mod) => (
                                <Badge key={mod} variant="outline" className="font-mono text-xs">
                                  {mod}
                                </Badge>
                              ))}
                              {run.suite.modules.length > 2 && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  +{run.suite.modules.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={run.state} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={((run.passed + run.healed) / run.total) * 100}
                                className="w-16 h-2"
                              />
                              <span className="text-xs text-muted-foreground">
                                {run.passed + run.healed}/{run.total}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={cn(
                                  'text-xs',
                                  run.triggered_by.class === 'agent' && 'bg-primary text-primary-foreground'
                                )}>
                                  {run.triggered_by.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {run.triggered_by.name.split(' ')[0]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(run)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Tests
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Run
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Retry Failed
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bug className="h-4 w-4 mr-2" />
                                  View Defects
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            </Card>
          </motion.div>

          {/* Test Results Overview */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent">
                <CardTitle className="text-base sm:text-lg">Migration Progress</CardTitle>
                <CardDescription>S/4HANA Cutover Readiness</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="flex items-center justify-center py-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
                >
                  <ProgressRing
                    passed={metrics.passRate}
                    failed={100 - metrics.passRate - metrics.healingRate}
                    healed={metrics.healingRate}
                    total={100}
                  />
                </motion.div>
                <motion.div 
                  className="space-y-3 mt-4"
                  variants={staggerContainerFast}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={staggerItem}>
                    <Link href="/migration-cockpit/si-items" className="flex items-center justify-between hover:bg-accent/50 p-2 -mx-2 rounded-md transition-colors group">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">SI Items Closed</span>
                      </div>
                      <span className="text-sm font-medium">{metrics.siItemsClosed}/{metrics.siItemsTotal}</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <Link href="/migration-cockpit/abap" className="flex items-center justify-between hover:bg-accent/50 p-2 -mx-2 rounded-md transition-colors group">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">ABAP Remediated</span>
                      </div>
                      <span className="text-sm font-medium">{metrics.abapFindingsClosed}/{metrics.abapFindingsTotal}</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <Link href="/analytics/bp-coverage" className="flex items-center justify-between hover:bg-accent/50 p-2 -mx-2 rounded-md transition-colors group">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm">BP Coverage</span>
                      </div>
                      <span className="text-sm font-medium">{metrics.coveragePercent}%</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Open Defects */}
          <motion.div variants={staggerItemScale} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-transparent via-red-500/5 to-transparent">
                <div>
                  <CardTitle className="text-base sm:text-lg">Open Defects</CardTitle>
                  <CardDescription>Requiring attention</CardDescription>
                </div>
                <Link href="/defect-manager">
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_DEFECTS
                    .filter(
                      (d) =>
                        d.state === 'Open' ||
                        d.state === 'In_Fix' ||
                        d.state === 'Triaged' ||
                        d.state === 'Assigned'
                    )
                    .slice(0, 4)
                    .map((defect, idx) => (
                      <motion.div
                        key={defect.code}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Link
                          href={`/defect-manager/${defect.code}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer block group"
                        >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">
                            {defect.code}
                          </span>
                          <PriorityBadge priority={defect.priority} />
                        </div>
                        <p className="text-sm font-medium mt-1 line-clamp-1">
                          {defect.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs font-mono">
                            {defect.source_kind}
                          </Badge>
                          <StatusBadge status={defect.state} />
                        </div>
                      </div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Transports */}
          <motion.div variants={staggerItemScale} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-transparent via-amber-500/5 to-transparent">
                <div>
                  <CardTitle className="text-base sm:text-lg">Pending Transports</CardTitle>
                  <CardDescription>Awaiting test completion</CardDescription>
                </div>
                <Link href="/transports">
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_TRANSPORTS
                    .filter(
                      (t) =>
                        t.state !== 'Released_PROD' && t.state !== 'Released_QAS'
                    )
                    .slice(0, 4)
                    .map((transport, idx) => (
                      <motion.div
                        key={transport.tr_number}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Link
                          href={`/transports/${transport.tr_number}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer block group"
                        >
                      <GitBranch className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono font-medium">
                            {transport.tr_number}
                          </span>
                          {transport.risk_score > 0.7 && (
                            <Badge variant="destructive" className="text-xs">High Risk</Badge>
                          )}
                        </div>
                        <p className="caption-text mt-1 line-clamp-1">
                          {transport.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <StatusBadge status={transport.state} />
                            <span className="text-xs text-muted-foreground">
                              {transport.linked_test_count} tests linked
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            variants={staggerItemScale} 
            whileHover={{ y: -2 }} 
            transition={{ duration: 0.2 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest actions across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="divide-y divide-border">
                    {mockActivities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx }}
                      >
                        <ActivityItem
                          action={activity.action}
                          actor={activity.actor}
                          timestamp={activity.timestamp}
                          details={activity.details}
                        />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Run All Scheduled Dialog */}
      <Dialog open={runAllDialog} onOpenChange={setRunAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run All Scheduled Tests</DialogTitle>
            <DialogDescription>
              This will start execution of all 6 scheduled test suites. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled suites:</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total test cases:</span>
                <span className="font-medium">164</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated duration:</span>
                <span className="font-medium">~45 minutes</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRunAllDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunAllScheduled}>
              <Play className="h-4 w-4 mr-2" />
              Start Execution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRun?.suite.name}</DialogTitle>
            <DialogDescription>{selectedRun?.suite.code}</DialogDescription>
          </DialogHeader>
          {selectedRun && (
            <div className="space-y-4">
              <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <StatusBadge status={selectedRun.state} />
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Triggered By</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={cn(
                        'text-xs',
                        selectedRun.triggered_by.class === 'agent' && 'bg-primary text-primary-foreground'
                      )}>
                        {selectedRun.triggered_by.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{selectedRun.triggered_by.name}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={((selectedRun.passed + selectedRun.healed) / selectedRun.total) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-sm font-medium">
                      {Math.round(((selectedRun.passed + selectedRun.healed) / selectedRun.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Modules</div>
                  <div className="flex gap-1 flex-wrap">
                    {selectedRun.suite.modules.map((mod) => (
                      <Badge key={mod} variant="outline" className="font-mono text-xs">
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>
              </StaggerGrid>
              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-2">Test Results</div>
                <StaggerGrid columns="grid-cols-4" className="gap-2 text-center" fast>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedRun.passed}
                    </div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {selectedRun.healed}
                    </div>
                    <div className="text-xs text-muted-foreground">Healed</div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {selectedRun.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-lg font-semibold">{selectedRun.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </StaggerGrid>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
            <Link href="/execution-console">
              <Button>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
