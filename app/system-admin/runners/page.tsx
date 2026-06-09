'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Layers,
  Plus,
  Search,
  MoreHorizontal,
  Settings,
  Activity,
  Play,
  Pause,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { KpiStatCard } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  RunnerPoolDetailSheet,
  RUNNER_KIND_COLORS,
} from '@/components/system-admin/runner-pool-detail-sheet'
import { ActiveRunnerDetailSheet } from '@/components/system-admin/active-runner-detail-sheet'
import {
  MOCK_RUNNER_POOLS,
  MOCK_ACTIVE_RUNNERS,
  MOCK_SAP_SYSTEMS,
  RUNNER_KIND_LABELS,
  type ActiveRunner,
  type RunnerKind,
  type RunnerPool,
  type RunnerState,
} from '@/lib/config-mock-data'

const STATE_CONFIG: Record<RunnerState, { icon: React.ElementType; label: string; className: string }> = {
  executing: { icon: Play, label: 'Executing', className: 'text-blue-600 dark:text-blue-400' },
  idle: { icon: Clock, label: 'Idle', className: 'text-emerald-600 dark:text-emerald-400' },
  draining: { icon: Pause, label: 'Draining', className: 'text-amber-600 dark:text-amber-400' },
  failed: { icon: XCircle, label: 'Failed', className: 'text-red-600 dark:text-red-400' },
}

export default function RunnerPoolsPage() {
  const [activeTab, setActiveTab] = React.useState('pools')
  const [kindFilter, setKindFilter] = React.useState<string>('all')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [autoRefresh, setAutoRefresh] = React.useState(true)
  const [selectedPool, setSelectedPool] = React.useState<RunnerPool | null>(null)
  const [selectedRunner, setSelectedRunner] = React.useState<ActiveRunner | null>(null)

  const filteredPools = MOCK_RUNNER_POOLS.filter((pool) => {
    const matchesKind = kindFilter === 'all' || pool.kind === kindFilter
    const matchesSearch =
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesKind && matchesSearch
  })

  const filteredRunners = MOCK_ACTIVE_RUNNERS.filter((runner) => {
    const pool = MOCK_RUNNER_POOLS.find((p) => p.id === runner.pool_id)
    const matchesState = stateFilter === 'all' || runner.state === stateFilter
    const matchesSearch =
      runner.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runner.host_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pool?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (runner.current_execution?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesState && matchesSearch
  })

  const getPoolName = (poolId: string) => MOCK_RUNNER_POOLS.find((p) => p.id === poolId)?.name ?? poolId

  const getSystemSid = (systemId: string) =>
    MOCK_SAP_SYSTEMS.find((s) => s.id === systemId)?.sid ?? systemId

  const totalRunners = MOCK_ACTIVE_RUNNERS.length
  const executingRunners = MOCK_ACTIVE_RUNNERS.filter((r) => r.state === 'executing').length
  const idleRunners = MOCK_ACTIVE_RUNNERS.filter((r) => r.state === 'idle').length
  const drainingRunners = MOCK_ACTIVE_RUNNERS.filter((r) => r.state === 'draining').length
  const failedRunners = MOCK_ACTIVE_RUNNERS.filter((r) => r.state === 'failed').length
  const poolCount = MOCK_RUNNER_POOLS.length
  const avgUtilization = Math.round(
    MOCK_RUNNER_POOLS.reduce((sum, p) => sum + p.current_utilization, 0) / MOCK_RUNNER_POOLS.length,
  )

  const handleViewPoolRunners = () => {
    if (!selectedPool) return
    setSelectedPool(null)
    setActiveTab('active')
    setSearchQuery(getPoolName(selectedPool.id))
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Runner Pools</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Worker pools that execute tests against SAP systems. Sized to your throughput needs with
                  auto-scaling and live health monitoring.
                </p>
              </div>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/system-admin/runners/new">
                  <Plus className="h-4 w-4" />
                  <span>New Pool</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
              <KpiStatCard label="Pools" value={poolCount} icon={Layers} tone="brand" />
              <KpiStatCard label="Total Runners" value={totalRunners} icon={Activity} tone="neutral" />
              <KpiStatCard label="Executing" value={executingRunners} icon={Play} tone="info" />
              <KpiStatCard label="Idle" value={idleRunners} icon={Clock} tone="success" />
              <KpiStatCard
                label="Avg Utilization"
                value={avgUtilization}
                icon={Zap}
                tone="warning"
                suffix="%"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === 'pools' ? 'Search pools...' : 'Search runners...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              {activeTab === 'pools' ? (
                <Select value={kindFilter} onValueChange={setKindFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9">
                    <SelectValue placeholder="Runner Kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Kinds</SelectItem>
                    {(Object.keys(RUNNER_KIND_LABELS) as RunnerKind[]).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {RUNNER_KIND_LABELS[kind]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] h-9">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="executing">Executing</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="draining">Draining</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="h-9">
              <TabsTrigger value="pools" className="gap-1.5 text-xs sm:text-sm">
                <Layers className="h-3.5 w-3.5" />
                Pools
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] ml-1">
                  {MOCK_RUNNER_POOLS.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-1.5 text-xs sm:text-sm">
                <Activity className="h-3.5 w-3.5" />
                Active Runners
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] ml-1">
                  {totalRunners}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pools" className="space-y-3 mt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground tabular-nums">{filteredPools.length}</span> of{' '}
                  <span className="font-medium text-foreground tabular-nums">{MOCK_RUNNER_POOLS.length}</span>{' '}
                  pools
                </p>
                {(drainingRunners > 0 || failedRunners > 0) && (
                  <div className="flex gap-2 text-xs">
                    {drainingRunners > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        {drainingRunners} draining
                      </span>
                    )}
                    {failedRunners > 0 && (
                      <span className="text-red-600 dark:text-red-400">{failedRunners} failed</span>
                    )}
                  </div>
                )}
              </div>

              {filteredPools.length > 0 ? (
                <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead>Name</TableHead>
                        <TableHead>Kind</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead className="hidden md:table-cell">Auto-Scale</TableHead>
                        <TableHead className="hidden lg:table-cell">OS Image</TableHead>
                        <TableHead className="hidden sm:table-cell">Restricted To</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead className="w-[52px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPools.map((pool) => (
                        <TableRow
                          key={pool.id}
                          className="group cursor-pointer transition-colors"
                          onClick={() => setSelectedPool(pool)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                                <Layers className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-medium text-sm leading-snug">{pool.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn('text-[10px] font-normal border', RUNNER_KIND_COLORS[pool.kind])}
                            >
                              {RUNNER_KIND_LABELS[pool.kind]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm tabular-nums">{pool.capacity}</TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                            {pool.min_scale} – {pool.max_scale}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[180px] truncate">
                            {pool.os_image || '—'}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {pool.restricted_systems.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {pool.restricted_systems.slice(0, 2).map((sysId) => (
                                  <Badge key={sysId} variant="secondary" className="text-[10px] font-mono">
                                    {getSystemSid(sysId)}
                                  </Badge>
                                ))}
                                {pool.restricted_systems.length > 2 && (
                                  <Badge variant="outline" className="text-[10px]">
                                    +{pool.restricted_systems.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">All</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[90px]">
                              <Progress
                                value={pool.current_utilization}
                                className={cn(
                                  'h-1.5 flex-1',
                                  pool.current_utilization >= 80 && '[&>div]:bg-amber-500',
                                  pool.current_utilization >= 95 && '[&>div]:bg-red-500',
                                )}
                              />
                              <span className="text-xs font-mono w-9 text-right tabular-nums">
                                {pool.current_utilization}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedPool(pool)
                                      setActiveTab('active')
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Runners
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    <Pause className="h-4 w-4 mr-2" />
                                    Drain Pool
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed bg-muted/20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Layers className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <h3 className="font-semibold text-lg">No pools found</h3>
                  <p className="page-description mt-1 max-w-sm">
                    Create a runner pool to provision workers for test execution
                  </p>
                  <Button size="sm" className="mt-5 gap-2" asChild>
                    <Link href="/system-admin/runners/new">
                      <Plus className="h-4 w-4" />
                      New Pool
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-3 mt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground tabular-nums">{filteredRunners.length}</span> of{' '}
                  <span className="font-medium text-foreground tabular-nums">{totalRunners}</span> runners
                </p>
                <Button
                  variant={autoRefresh ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', autoRefresh && 'animate-spin')} />
                  Auto-refresh {autoRefresh ? 'On' : 'Off'}
                </Button>
              </div>

              {filteredRunners.length > 0 ? (
                <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead>Runner ID</TableHead>
                        <TableHead>Pool</TableHead>
                        <TableHead className="hidden md:table-cell">Host</TableHead>
                        <TableHead>Current Execution</TableHead>
                        <TableHead className="hidden lg:table-cell">Lease Until</TableHead>
                        <TableHead className="hidden sm:table-cell">CPU</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead className="w-[52px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRunners.map((runner) => {
                        const StateIcon = STATE_CONFIG[runner.state].icon

                        return (
                          <TableRow
                            key={runner.id}
                            className={cn(
                              'group cursor-pointer transition-colors',
                              runner.state === 'failed' && 'bg-red-50/40 dark:bg-red-950/10',
                            )}
                            onClick={() => setSelectedRunner(runner)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                    runner.state === 'executing' && 'bg-blue-500/10 text-blue-600',
                                    runner.state === 'idle' && 'bg-emerald-500/10 text-emerald-600',
                                    runner.state === 'draining' && 'bg-amber-500/10 text-amber-600',
                                    runner.state === 'failed' && 'bg-red-500/10 text-red-600',
                                  )}
                                >
                                  <Activity className="h-3.5 w-3.5" />
                                </div>
                                <span className="font-mono text-sm">{runner.id}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm max-w-[140px] truncate">
                              {getPoolName(runner.pool_id)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                              {runner.host_id}
                            </TableCell>
                            <TableCell>
                              {runner.current_execution ? (
                                <Link
                                  href={`/execution-console/runs/${runner.current_execution.id}`}
                                  className="text-sm text-primary hover:underline truncate max-w-[200px] block"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {runner.current_execution.name}
                                </Link>
                              ) : (
                                <div
                                  className={cn(
                                    'flex items-center gap-1.5',
                                    STATE_CONFIG[runner.state].className,
                                  )}
                                >
                                  <StateIcon
                                    className={cn(
                                      'h-3.5 w-3.5',
                                      runner.state === 'draining' && 'animate-pulse',
                                    )}
                                  />
                                  <span className="text-xs font-medium">
                                    {STATE_CONFIG[runner.state].label}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-mono">
                              {new Date(runner.lease_until).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center gap-1.5">
                                <Progress value={runner.cpu_utilization} className="h-1.5 w-10" />
                                <span className="text-[10px] font-mono tabular-nums">
                                  {runner.cpu_utilization}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {runner.health === 'healthy' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              ) : runner.health === 'degraded' ? (
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>
                              <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed bg-muted/20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                    <Activity className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <h3 className="font-semibold text-lg">No runners match your filters</h3>
                  <p className="page-description mt-1 max-w-sm">
                    Adjust search or state filters, or wait for pool provisioning to complete
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <RunnerPoolDetailSheet
        pool={selectedPool}
        open={!!selectedPool}
        onOpenChange={(open) => !open && setSelectedPool(null)}
        onViewRunners={handleViewPoolRunners}
      />

      <ActiveRunnerDetailSheet
        runner={selectedRunner}
        open={!!selectedRunner}
        onOpenChange={(open) => !open && setSelectedRunner(null)}
      />
    </AppShell>
  )
}
