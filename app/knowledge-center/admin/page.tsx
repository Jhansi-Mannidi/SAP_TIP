'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Settings,
  Database,
  RefreshCw,
  FileText,
  Code2,
  Target,
  Book,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  History,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  Upload,
  Shield,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
import { cn } from '@/lib/utils'

// Ingestion sources
const INGESTION_SOURCES = [
  {
    id: 'src_1',
    name: 'SAP Help Portal',
    type: 'external',
    status: 'active',
    lastSync: '2026-05-07T10:00:00+05:30',
    nextSync: '2026-05-08T10:00:00+05:30',
    documentsIndexed: 12450,
    syncFrequency: 'daily',
    health: 'healthy',
  },
  {
    id: 'src_2',
    name: 'SAP Best Practices Explorer',
    type: 'external',
    status: 'active',
    lastSync: '2026-05-07T06:00:00+05:30',
    nextSync: '2026-05-08T06:00:00+05:30',
    documentsIndexed: 3200,
    syncFrequency: 'daily',
    health: 'healthy',
  },
  {
    id: 'src_3',
    name: 'Internal Confluence',
    type: 'internal',
    status: 'active',
    lastSync: '2026-05-07T14:00:00+05:30',
    nextSync: '2026-05-07T20:00:00+05:30',
    documentsIndexed: 890,
    syncFrequency: '6 hours',
    health: 'healthy',
  },
  {
    id: 'src_4',
    name: 'SharePoint Documents',
    type: 'internal',
    status: 'paused',
    lastSync: '2026-05-05T10:00:00+05:30',
    documentsIndexed: 456,
    syncFrequency: 'daily',
    health: 'warning',
  },
  {
    id: 'src_5',
    name: 'SAP Notes (OSS)',
    type: 'external',
    status: 'active',
    lastSync: '2026-05-07T08:00:00+05:30',
    nextSync: '2026-05-08T08:00:00+05:30',
    documentsIndexed: 8920,
    syncFrequency: 'daily',
    health: 'healthy',
  },
]

// Recent sync jobs
const SYNC_JOBS = [
  { id: 'job_1', source: 'SAP Help Portal', status: 'completed', started: '2026-05-07T10:00:00+05:30', duration: '45m', docsProcessed: 125, errors: 0 },
  { id: 'job_2', source: 'Internal Confluence', status: 'completed', started: '2026-05-07T14:00:00+05:30', duration: '12m', docsProcessed: 34, errors: 0 },
  { id: 'job_3', source: 'SAP Notes (OSS)', status: 'completed', started: '2026-05-07T08:00:00+05:30', duration: '1h 20m', docsProcessed: 892, errors: 3 },
  { id: 'job_4', source: 'SAP Best Practices Explorer', status: 'running', started: '2026-05-07T15:30:00+05:30', duration: '10m', docsProcessed: 45, errors: 0 },
  { id: 'job_5', source: 'SharePoint Documents', status: 'failed', started: '2026-05-05T10:00:00+05:30', duration: '5m', docsProcessed: 0, errors: 1 },
]

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return new Date(dateString).toLocaleDateString()
}

export default function KBAdminPage() {
  const totalDocs = INGESTION_SOURCES.reduce((acc, src) => acc + src.documentsIndexed, 0)
  const activeSources = INGESTION_SOURCES.filter(s => s.status === 'active').length
  const healthySources = INGESTION_SOURCES.filter(s => s.health === 'healthy').length
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">KB Administration</h1>
                <p className="page-description mt-1">
                  Manage ingestion sources, sync schedules, and content quality
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link href="/knowledge-center/admin/audit">
                    <History className="h-4 w-4" />
                    Audit Log
                  </Link>
                </Button>
                <Button size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Add Source
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{totalDocs.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total Documents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{activeSources}/{INGESTION_SOURCES.length}</div>
                      <div className="text-xs text-muted-foreground">Active Sources</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{healthySources}/{INGESTION_SOURCES.length}</div>
                      <div className="text-xs text-muted-foreground">Healthy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Running Jobs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerGrid>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs defaultValue="sources" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sources">Ingestion Sources</TabsTrigger>
              <TabsTrigger value="jobs">Sync Jobs</TabsTrigger>
              <TabsTrigger value="quality">Content Quality</TabsTrigger>
            </TabsList>
            
            {/* Sources Tab */}
            <TabsContent value="sources">
              <Card>
                <CardHeader>
                  <CardTitle>Ingestion Sources</CardTitle>
                  <CardDescription>Configure and manage KB content sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {INGESTION_SOURCES.map(source => (
                        <TableRow key={source.id}>
                          <TableCell className="font-medium">{source.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {source.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={source.status === 'active' ? 'default' : 'secondary'}
                              className={cn(
                                source.status === 'active' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              )}
                            >
                              {source.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{source.documentsIndexed.toLocaleString()}</TableCell>
                          <TableCell>{formatRelativeTime(source.lastSync)}</TableCell>
                          <TableCell>{source.syncFrequency}</TableCell>
                          <TableCell>
                            {source.health === 'healthy' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : source.health === 'warning' ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-rose-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Sync Now
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {source.status === 'active' ? (
                                  <DropdownMenuItem>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <Play className="h-4 w-4 mr-2" />
                                    Resume
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sync Jobs</CardTitle>
                  <CardDescription>View and manage synchronization jobs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SYNC_JOBS.map(job => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.source}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={cn(
                                job.status === 'completed' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                                job.status === 'running' && 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                                job.status === 'failed' && 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              )}
                            >
                              {job.status === 'running' && (
                                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              )}
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatRelativeTime(job.started)}</TableCell>
                          <TableCell>{job.duration}</TableCell>
                          <TableCell>{job.docsProcessed}</TableCell>
                          <TableCell>
                            {job.errors > 0 ? (
                              <Badge variant="destructive">{job.errors}</Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Quality Tab */}
            <TabsContent value="quality">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Coverage</CardTitle>
                    <CardDescription>KB coverage by content type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Book className="h-4 w-4 text-muted-foreground" />
                          Domain Articles
                        </span>
                        <span>12,450</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          BP Scope Items
                        </span>
                        <span>3,200</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Org Articles
                        </span>
                        <span>890</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-muted-foreground" />
                          Z-Objects
                        </span>
                        <span>156</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                    <CardDescription>Content quality indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Embedding Coverage</div>
                        <div className="text-xs text-muted-foreground">Documents with vector embeddings</div>
                      </div>
                      <div className="stat-value text-emerald-600">98.5%</div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Freshness Score</div>
                        <div className="text-xs text-muted-foreground">Content updated within 30 days</div>
                      </div>
                      <div className="stat-value text-emerald-600">87%</div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Link Validity</div>
                        <div className="text-xs text-muted-foreground">Working cross-references</div>
                      </div>
                      <div className="stat-value text-amber-600">94%</div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <div className="font-medium">Duplicate Rate</div>
                        <div className="text-xs text-muted-foreground">Detected duplicates</div>
                      </div>
                      <div className="stat-value text-emerald-600">1.2%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
