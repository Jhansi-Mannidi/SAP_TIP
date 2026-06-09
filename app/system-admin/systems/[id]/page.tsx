'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Server, 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Settings,
  Trash2,
  Activity,
  ArrowLeft,
  Plus,
  RefreshCw,
  Network,
  Clock,
  MapPin,
  Database,
  FileText,
  Plug,
  Eye,
  MoreHorizontal,
  Lock,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { 
  MOCK_SAP_SYSTEMS, 
  SYSTEM_KIND_LABELS, 
  LANDSCAPE_ROLE_COLORS,
  MOCK_RFC_DESTINATIONS,
  type LandscapeRole,
  type HealthStatus,
} from '@/lib/config-mock-data'

function SystemHealthBadge({ health, size = 'default' }: { health: HealthStatus; size?: 'default' | 'lg' }) {
  const config = {
    healthy: { icon: CheckCircle2, label: 'Healthy', className: 'text-emerald-600 dark:text-emerald-400' },
    degraded: { icon: AlertTriangle, label: 'Degraded', className: 'text-amber-600 dark:text-amber-400' },
    unhealthy: { icon: XCircle, label: 'Unhealthy', className: 'text-red-600 dark:text-red-400' },
    unknown: { icon: HelpCircle, label: 'Unknown', className: 'text-muted-foreground' },
  }
  
  const { icon: Icon, label, className } = config[health]
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
  
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Icon className={iconSize} />
      <span className={size === 'lg' ? 'text-base font-medium' : 'text-sm'}>{label}</span>
    </div>
  )
}

function ProductiveGuardBanner() {
  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            PRODUCTIVE SYSTEM — Restricted Operations
          </p>
          <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
            Destructive operations require dual approval. Read-only access outside cutover windows.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SystemDetailPage() {
  const params = useParams()
  const systemId = params.id as string
  
  const system = MOCK_SAP_SYSTEMS.find(s => s.id === systemId) || MOCK_SAP_SYSTEMS[0]
  const rfcDestinations = MOCK_RFC_DESTINATIONS.filter(r => r.system_id === system.id)
  
  const recentEvents = [
    { id: 1, event: 'Connectivity test passed', timestamp: '2 mins ago', status: 'success' },
    { id: 2, event: 'Health check completed', timestamp: '15 mins ago', status: 'success' },
    { id: 3, event: 'RFC connection pool resized', timestamp: '1 hour ago', status: 'info' },
    { id: 4, event: 'Client 200 sync completed', timestamp: '2 hours ago', status: 'success' },
    { id: 5, event: 'Kernel version detected: 753', timestamp: '1 day ago', status: 'info' },
  ]
  
  const connectivityTests = [
    { id: 1, timestamp: '2026-05-07T14:30:00+05:30', result: 'success', latency: 45, initiator: 'P.Sharma' },
    { id: 2, timestamp: '2026-05-07T10:00:00+05:30', result: 'success', latency: 52, initiator: 'System' },
    { id: 3, timestamp: '2026-05-06T16:45:00+05:30', result: 'success', latency: 48, initiator: 'K.Iyer' },
    { id: 4, timestamp: '2026-05-06T09:00:00+05:30', result: 'failed', latency: 0, initiator: 'System' },
    { id: 5, timestamp: '2026-05-05T14:30:00+05:30', result: 'success', latency: 51, initiator: 'System' },
  ]
  
  const abapProviders = [
    { id: 1, name: 'Voltus ABAP Analyzer', status: 'healthy', lastCall: '5 mins ago' },
    { id: 2, name: 'SAP ATC Remote', status: 'healthy', lastCall: '1 hour ago' },
    { id: 3, name: 'SAP Joule', status: 'degraded', lastCall: '2 hours ago' },
  ]

  return (
    <AppShell currentApp="system-admin" isProductiveSystem={system.is_productive}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-4">
              <Link href="/system-admin" className="hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                SAP Systems
              </Link>
              <span>/</span>
              <span>{system.sid}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'h-14 w-14 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xl',
                  system.is_productive ? 'bg-red-500' : 'bg-indigo-500'
                )}>
                  {system.sid.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="page-title">{system.display_name}</h1>
                    {system.is_productive && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Shield className="h-5 w-5 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>Productive System</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline">{SYSTEM_KIND_LABELS[system.kind]}</Badge>
                    <Badge className={cn('text-white', LANDSCAPE_ROLE_COLORS[system.landscape_role])}>
                      {system.landscape_role}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {system.region}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Metadata
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
                <Button variant="outline" size="sm">
                  <Plug className="h-4 w-4 mr-2" />
                  Add RFC
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Audit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Decommission
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {system.is_productive && <ProductiveGuardBanner />}
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="rfc">RFC Destinations</TabsTrigger>
              <TabsTrigger value="abap">ABAP Analysis</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivity Tests</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="gap-4" fast>
                {/* Connection Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Host</span>
                      <span className="text-sm font-mono">{system.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Port</span>
                      <span className="text-sm font-mono">{system.port}</span>
                    </div>
                    {system.message_server && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Message Server</span>
                        <span className="text-sm font-mono truncate max-w-[150px]">{system.message_server}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Versioning Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Versioning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kernel Release</span>
                      <span className="text-sm font-mono">{system.kernel_release || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Support Pack</span>
                      <span className="text-sm font-mono">{system.support_pack || '—'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Health</span>
                      <SystemHealthBadge health={system.health} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Default Client</span>
                      <span className="text-sm font-mono">{system.default_client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Productive</span>
                      <span className="text-sm">{system.is_productive ? 'Yes' : 'No'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* iHub Connector Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plug className="h-4 w-4" />
                      iHub Connector
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Linked Connector</span>
                      <span className="text-sm font-mono">{system.linked_ihub_connector || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className="text-emerald-600">Connected</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Last Health Check Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last Health Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timestamp</span>
                      <span className="text-sm">
                        {new Date(system.last_health_check).toLocaleString()}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Run Now
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Recent Events Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recentEvents.slice(0, 4).map((event) => (
                        <div key={event.id} className="flex items-start gap-2 text-sm">
                          {event.status === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <Activity className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{event.event}</p>
                            <p className="caption-text">{event.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </StaggerGrid>
            </TabsContent>
            
            {/* Clients Tab */}
            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Clients</CardTitle>
                      <CardDescription>SAP clients registered for this system</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Productive</TableHead>
                        <TableHead>Locked</TableHead>
                        <TableHead>Recent Activity</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {system.clients.map((client) => (
                        <TableRow key={client.id} className={cn(
                          'relative',
                          client.is_productive && 'bg-red-50/50 dark:bg-red-950/20'
                        )}>
                          {client.is_productive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                          )}
                          <TableCell className="font-mono text-lg font-bold">{client.client_number}</TableCell>
                          <TableCell>{client.description}</TableCell>
                          <TableCell>
                            {client.is_productive ? (
                              <Shield className="h-4 w-4 text-red-500" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {client.is_locked ? (
                              <Lock className="h-4 w-4 text-amber-500" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{client.recent_activity}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* RFC Destinations Tab */}
            <TabsContent value="rfc">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>RFC Destinations</CardTitle>
                      <CardDescription>Registered RFC connections using this system</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Destination
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {rfcDestinations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>NTU Reference</TableHead>
                          <TableHead>Pool Size</TableHead>
                          <TableHead>Health</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfcDestinations.map((rfc) => (
                          <TableRow key={rfc.id}>
                            <TableCell className="font-mono font-medium">{rfc.name}</TableCell>
                            <TableCell className="font-mono">{rfc.client}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{rfc.ntu_ref}</TableCell>
                            <TableCell>{rfc.pool_size}</TableCell>
                            <TableCell>
                              <SystemHealthBadge health={rfc.health} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No RFC destinations registered for this system
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* ABAP Analysis Tab */}
            <TabsContent value="abap">
              <Card>
                <CardHeader>
                  <CardTitle>ABAP Analysis Providers</CardTitle>
                  <CardDescription>Code analysis providers connected to this system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Call</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {abapProviders.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell className="font-medium">{provider.name}</TableCell>
                          <TableCell>
                            <SystemHealthBadge health={provider.status as HealthStatus} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{provider.lastCall}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Test Call</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Connectivity Tests Tab */}
            <TabsContent value="connectivity">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Connectivity Test History</CardTitle>
                      <CardDescription>Historical connectivity test results and latency</CardDescription>
                    </div>
                    <Button size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Run Test
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Latency</TableHead>
                        <TableHead>Initiator</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connectivityTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="text-sm">
                            {new Date(test.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {test.result === 'success' ? (
                              <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono">
                            {test.latency > 0 ? `${test.latency}ms` : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{test.initiator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Audit Tab */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>System Audit Log</CardTitle>
                  <CardDescription>Configuration changes and access events for this system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>View the full audit trail for this system</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link href="/system-admin/audit">View Audit Trail</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
