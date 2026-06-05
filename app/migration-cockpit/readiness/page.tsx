'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  Upload,
  RefreshCw,
  Calendar,
  FileJson,
  AlertTriangle,
  Code2,
  Target,
  Layers,
  ChevronDown,
  Plus,
  ArrowRight,
  Clock,
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
import { cn } from '@/lib/utils'

import { MOCK_MIGRATIONS } from '@/lib/migration-mock-data'

const migration = MOCK_MIGRATIONS[0]

const READINESS_SUMMARY = {
  source: 'SAP Readiness Check',
  ingested_at: '2026-04-28T10:00:00+05:30',
  version: '2.4.1',
  si_items: 96,
  abap_findings: 503,
  custom_code_lines: 245000,
  scope_recommendations: 12,
}

const SI_BY_SEVERITY = [
  { severity: 'Critical', count: 8, color: 'bg-red-500' },
  { severity: 'High', count: 24, color: 'bg-orange-500' },
  { severity: 'Medium', count: 42, color: 'bg-amber-500' },
  { severity: 'Low', count: 22, color: 'bg-emerald-500' },
]

const ABAP_BY_SEVERITY = [
  { severity: 'Critical', count: 45, color: 'bg-red-500' },
  { severity: 'High', count: 128, color: 'bg-orange-500' },
  { severity: 'Medium', count: 215, color: 'bg-amber-500' },
  { severity: 'Low', count: 115, color: 'bg-emerald-500' },
]

const EXTRACTED_SI = [
  { code: 'SAP_NOTE_2622437', title: 'Material Number Length Extension', severity: 'High', status: 'New' },
  { code: 'SAP_NOTE_2933229', title: 'Business Partner Mandatory Migration', severity: 'Critical', status: 'New' },
  { code: 'SAP_NOTE_2268093', title: 'Credit Management Simplification', severity: 'High', status: 'New' },
  { code: 'SAP_NOTE_2249880', title: 'New Asset Accounting', severity: 'Medium', status: 'Existing' },
  { code: 'SAP_NOTE_2220841', title: 'Extended Warehouse Management', severity: 'High', status: 'New' },
  { code: 'SAP_NOTE_2363246', title: 'MRP Live Activation', severity: 'Medium', status: 'New' },
  { code: 'SAP_NOTE_2600030', title: 'Profit Center Accounting Changes', severity: 'Medium', status: 'Existing' },
  { code: 'SAP_NOTE_2340562', title: 'Output Management Simplification', severity: 'High', status: 'New' },
]

const SCOPE_RECOMMENDATIONS = [
  { module: 'SD', recommendation: 'Include Credit Management scope item BD7', priority: 'High' },
  { module: 'MM', recommendation: 'Add Service Procurement scope items 2MV, 2MW', priority: 'Medium' },
  { module: 'FI', recommendation: 'Include Bank Account Management 1XK', priority: 'Low' },
  { module: 'PP', recommendation: 'Consider MRP Live scope items for improved planning', priority: 'Medium' },
]

export default function ReadinessPage() {
  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="p-4 md:p-6">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Link href="/migration-cockpit" className="hover:text-foreground">Migrations</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href={`/migration-cockpit/${migration.id}`} className="hover:text-foreground">{migration.name}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">Readiness</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">SAP Readiness Check</h1>
                <p className="page-description mt-1">
                  Ingest and analyze SAP Readiness Check results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload New Check
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="p-4 md:p-6">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileJson className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{READINESS_SUMMARY.source}</h3>
                    <p className="page-description">
                      Version {READINESS_SUMMARY.version} · Ingested {new Date(READINESS_SUMMARY.ingested_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  9 days ago
                </Badge>
              </div>
              
              <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4 mt-6" fast>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">SI Items</span>
                  </div>
                  <div className="stat-value">{READINESS_SUMMARY.si_items}</div>
                </div>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Code2 className="h-4 w-4" />
                    <span className="text-xs">ABAP Findings</span>
                  </div>
                  <div className="stat-value">{READINESS_SUMMARY.abap_findings}</div>
                </div>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Layers className="h-4 w-4" />
                    <span className="text-xs">Custom Code Lines</span>
                  </div>
                  <div className="stat-value">{(READINESS_SUMMARY.custom_code_lines / 1000).toFixed(0)}K</div>
                </div>
                <div className="p-4 rounded-lg bg-background/80">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Target className="h-4 w-4" />
                    <span className="text-xs">Scope Recommendations</span>
                  </div>
                  <div className="stat-value">{READINESS_SUMMARY.scope_recommendations}</div>
                </div>
              </StaggerGrid>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex-1 px-4 md:px-6 pb-6">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="si-items">Extracted SI Items</TabsTrigger>
              <TabsTrigger value="abap">Extracted ABAP Findings</TabsTrigger>
              <TabsTrigger value="scope">Recommended Scope</TabsTrigger>
              <TabsTrigger value="compare">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <StaggerGrid columns="grid-cols-1 md:grid-cols-2" className="gap-6" fast>
                {/* SI by Severity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">SI Items by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {SI_BY_SEVERITY.map(item => (
                        <div key={item.severity} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">{item.severity}</div>
                          <div className="flex-1">
                            <Progress 
                              value={(item.count / READINESS_SUMMARY.si_items) * 100} 
                              className={cn('h-4', `[&>div]:${item.color}`)}
                            />
                          </div>
                          <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ABAP by Severity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ABAP Findings by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ABAP_BY_SEVERITY.map(item => (
                        <div key={item.severity} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">{item.severity}</div>
                          <div className="flex-1">
                            <Progress 
                              value={(item.count / READINESS_SUMMARY.abap_findings) * 100} 
                              className={cn('h-4', `[&>div]:${item.color}`)}
                            />
                          </div>
                          <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Code Breakdown */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Custom Code Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
                      <div className="p-4 rounded-lg border text-center">
                        <div className="stat-value">156</div>
                        <div className="text-xs text-muted-foreground">Z-Programs</div>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <div className="stat-value">89</div>
                        <div className="text-xs text-muted-foreground">Z-Classes</div>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <div className="stat-value">67</div>
                        <div className="text-xs text-muted-foreground">Function Groups</div>
                      </div>
                      <div className="p-4 rounded-lg border text-center">
                        <div className="stat-value">34</div>
                        <div className="text-xs text-muted-foreground">BAdI Implementations</div>
                      </div>
                    </StaggerGrid>
                  </CardContent>
                </Card>
              </StaggerGrid>
            </TabsContent>

            <TabsContent value="si-items">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Extracted Simplification Items</CardTitle>
                    <CardDescription>Items matched to your migration scope</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Generate SI Items Worklist
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SI Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {EXTRACTED_SI.map(item => (
                        <TableRow key={item.code}>
                          <TableCell>
                            <code className="text-xs font-mono">{item.code}</code>
                          </TableCell>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.severity === 'Critical' ? 'destructive' :
                              item.severity === 'High' ? 'default' :
                              'secondary'
                            }>
                              {item.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="abap">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Extracted ABAP Findings</CardTitle>
                    <CardDescription>Custom code impact analysis results</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Generate ABAP Worklist
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                    <div className="text-center text-muted-foreground">
                      <Code2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">503 ABAP findings extracted</p>
                      <p className="text-xs">Click to view detailed analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scope">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Recommended Scope Additions</CardTitle>
                    <CardDescription>SAP-suggested scope items based on your system analysis</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Update Migration Scope
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SCOPE_RECOMMENDATIONS.map((rec, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="font-mono">{rec.module}</Badge>
                          <span className="text-sm">{rec.recommendation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            rec.priority === 'High' ? 'destructive' :
                            rec.priority === 'Medium' ? 'default' :
                            'secondary'
                          }>
                            {rec.priority}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compare">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compare Readiness Checks</CardTitle>
                  <CardDescription>Compare current ingest with previous versions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                    <div className="text-center text-muted-foreground">
                      <RefreshCw className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No previous ingests to compare</p>
                      <p className="text-xs">Upload another Readiness Check to enable comparison</p>
                    </div>
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
