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
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  MOCK_RUNNER_POOLS, 
  MOCK_ACTIVE_RUNNERS,
  MOCK_SAP_SYSTEMS,
  RUNNER_KIND_LABELS,
  type RunnerKind,
  type RunnerState,
  type HealthStatus,
} from '@/lib/config-mock-data'

const RUNNER_KIND_COLORS: Record<RunnerKind, string> = {
  'sap_gui_windows': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'fiori_browser': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'api_runner': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  'hybrid': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const STATE_CONFIG: Record<RunnerState, { icon: React.ElementType; label: string; className: string }> = {
  'executing': { icon: Play, label: 'Executing', className: 'text-blue-600 dark:text-blue-400' },
  'idle': { icon: Clock, label: 'Idle', className: 'text-emerald-600 dark:text-emerald-400' },
  'draining': { icon: Pause, label: 'Draining', className: 'text-amber-600 dark:text-amber-400' },
  'failed': { icon: XCircle, label: 'Failed', className: 'text-red-600 dark:text-red-400' },
}

export default function RunnerPoolsPage() {
  const [activeTab, setActiveTab] = React.useState('pools')
  const [kindFilter, setKindFilter] = React.useState<string>('all')
  const [autoRefresh, setAutoRefresh] = React.useState(true)
  
  const filteredPools = MOCK_RUNNER_POOLS.filter(pool => 
    kindFilter === 'all' || pool.kind === kindFilter
  )
  
  const getPoolName = (poolId: string) => {
    const pool = MOCK_RUNNER_POOLS.find(p => p.id === poolId)
    return pool?.name || poolId
  }
  
  const getSystemSid = (systemId: string) => {
    const system = MOCK_SAP_SYSTEMS.find(s => s.id === systemId)
    return system?.sid || systemId
  }
  
  // KPIs
  const totalRunners = MOCK_ACTIVE_RUNNERS.length
  const executingRunners = MOCK_ACTIVE_RUNNERS.filter(r => r.state === 'executing').length
  const idleRunners = MOCK_ACTIVE_RUNNERS.filter(r => r.state === 'idle').length
  const drainingRunners = MOCK_ACTIVE_RUNNERS.filter(r => r.state === 'draining').length
  const failedRunners = MOCK_ACTIVE_RUNNERS.filter(r => r.state === 'failed').length

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Runner Pools</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Worker pools that execute Tests against SAP systems. Sized to your throughput needs.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>New Pool</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="pools">
                <Layers className="h-4 w-4 mr-2" />
                Pools
              </TabsTrigger>
              <TabsTrigger value="active">
                <Activity className="h-4 w-4 mr-2" />
                Active Runners
              </TabsTrigger>
            </TabsList>
            
            {/* Pools Tab */}
            <TabsContent value="pools" className="space-y-4">
              <div className="flex items-center gap-3">
                <Select value={kindFilter} onValueChange={setKindFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Runner Kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Kinds</SelectItem>
                    <SelectItem value="sap_gui_windows">SAP GUI Windows</SelectItem>
                    <SelectItem value="fiori_browser">Fiori Browser</SelectItem>
                    <SelectItem value="api_runner">API Runner</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Kind</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Auto-Scale</TableHead>
                      <TableHead className="hidden lg:table-cell">OS Image</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Restricted To</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPools.map((pool) => (
                      <TableRow key={pool.id}>
                        <TableCell className="font-medium">{pool.name}</TableCell>
                        <TableCell>
                          <Badge className={cn('font-normal', RUNNER_KIND_COLORS[pool.kind])}>
                            {RUNNER_KIND_LABELS[pool.kind]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{pool.capacity}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {pool.min_scale} - {pool.max_scale}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                          {pool.os_image || '—'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pool.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {pool.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{pool.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {pool.restricted_systems.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {pool.restricted_systems.map((sysId) => (
                                <Badge key={sysId} variant="secondary" className="text-xs font-mono">
                                  {getSystemSid(sysId)}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">All</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <Progress value={pool.current_utilization} className="h-2 flex-1" />
                            <span className="text-sm font-mono w-10 text-right">
                              {pool.current_utilization}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Runners
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Pause className="h-4 w-4 mr-2" />
                                Drain Pool
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Active Runners Tab */}
            <TabsContent value="active" className="space-y-4">
              {/* KPI Strip */}
              <StaggerGrid columns="grid-cols-2 md:grid-cols-5" className="gap-4" fast>
                <Card>
                  <CardContent>
                    <div className="stat-value">{totalRunners}</div>
                    <div className="text-sm text-muted-foreground">Total Runners</div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-950/30">
                  <CardContent>
                    <div className="stat-value text-blue-700 dark:text-blue-400">{executingRunners}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-500">Executing</div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 dark:bg-emerald-950/30">
                  <CardContent>
                    <div className="stat-value text-emerald-700 dark:text-emerald-400">{idleRunners}</div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-500">Idle</div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-950/30">
                  <CardContent>
                    <div className="stat-value text-amber-700 dark:text-amber-400">{drainingRunners}</div>
                    <div className="text-sm text-amber-600 dark:text-amber-500">Draining</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/30">
                  <CardContent>
                    <div className="stat-value text-red-700 dark:text-red-400">{failedRunners}</div>
                    <div className="text-sm text-red-600 dark:text-red-500">Failed</div>
                  </CardContent>
                </Card>
              </StaggerGrid>
              
              {/* Auto-refresh toggle */}
              <div className="flex items-center justify-between">
                <p className="page-description">
                  Live view of runner instances
                </p>
                <Button 
                  variant={autoRefresh ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={cn('h-4 w-4 mr-2', autoRefresh && 'animate-spin')} />
                  Auto-refresh {autoRefresh ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Runner ID</TableHead>
                      <TableHead>Pool</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Current Execution</TableHead>
                      <TableHead>Lease Until</TableHead>
                      <TableHead>CPU</TableHead>
                      <TableHead>Memory</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ACTIVE_RUNNERS.map((runner) => {
                      const StateIcon = STATE_CONFIG[runner.state].icon
                      
                      return (
                        <TableRow key={runner.id} className={cn(
                          runner.state === 'failed' && 'bg-red-50/50 dark:bg-red-950/20'
                        )}>
                          <TableCell className="font-mono text-sm">{runner.id}</TableCell>
                          <TableCell className="text-sm">{getPoolName(runner.pool_id)}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                            {runner.host_id}
                          </TableCell>
                          <TableCell>
                            {runner.current_execution ? (
                              <Link 
                                href={`/test-design/executions/${runner.current_execution.id}`}
                                className="text-sm text-primary hover:underline truncate max-w-[200px] block"
                              >
                                {runner.current_execution.name}
                              </Link>
                            ) : (
                              <div className={cn('flex items-center gap-1.5', STATE_CONFIG[runner.state].className)}>
                                <StateIcon className="h-4 w-4" />
                                <span className="text-sm">{STATE_CONFIG[runner.state].label}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(runner.lease_until).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={runner.cpu_utilization} className="h-2 w-12" />
                              <span className="text-xs font-mono">{runner.cpu_utilization}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={runner.memory_utilization} className="h-2 w-12" />
                              <span className="text-xs font-mono">{runner.memory_utilization}%</span>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Logs
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Force Release Lease
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Drain Runner
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
