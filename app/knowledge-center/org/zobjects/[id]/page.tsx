'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Edit,
  Code2,
  FileText,
  ChevronRight,
  GitBranch,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Play,
  History,
  Users,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import { MOCK_ORG_ZOBJECTS } from '@/lib/kb-mock-data'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ZObjectDetailPage() {
  const params = useParams()
  const zobjId = params.id as string
  
  const zobj = MOCK_ORG_ZOBJECTS.find(z => z.id === zobjId) || MOCK_ORG_ZOBJECTS[0]
  
  // Sample code snippet
  const sampleCode = `*----------------------------------------------------------------------*
* Z-Object: ${zobj.name}
* Description: ${zobj.description}
* Module: ${zobj.module}
*----------------------------------------------------------------------*
REPORT ${zobj.name}.

DATA: lv_matnr TYPE matnr,
      lt_mara  TYPE TABLE OF mara,
      ls_mara  TYPE mara.

* Selection Screen
PARAMETERS: p_werks TYPE werks_d OBLIGATORY.

START-OF-SELECTION.
  SELECT * FROM mara INTO TABLE lt_mara
    WHERE mtart = 'FERT'.
  
  LOOP AT lt_mara INTO ls_mara.
    WRITE: / ls_mara-matnr, ls_mara-maktx.
  ENDLOOP.`

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/knowledge-center/org" className="hover:text-foreground">Org KB</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/knowledge-center/org" className="hover:text-foreground">Z-Objects</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-mono">{zobj.name}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Link href="/knowledge-center/org">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="page-title">{zobj.name}</h1>
                    <Badge variant="outline">{zobj.object_type}</Badge>
                    <Badge variant="outline">{zobj.module}</Badge>
                    {zobj.has_test_coverage && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                        <Shield className="h-3 w-3" />
                        Test Coverage
                      </Badge>
                    )}
                  </div>
                  <p className="page-description mt-1">{zobj.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Run Tests
                </Button>
                <Button size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              {/* Main Content */}
              <div className="space-y-6">
                <Tabs defaultValue="code" className="w-full">
                  <TabsList>
                    <TabsTrigger value="code">Source Code</TabsTrigger>
                    <TabsTrigger value="documentation">Documentation</TabsTrigger>
                    <TabsTrigger value="tests">Test Coverage</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="mt-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{zobj.name}.abap</span>
                          <Badge variant="secondary" className="text-xs">{zobj.lines_of_code} lines</Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </CardHeader>
                      <CardContent className="card-bleed-x card-bleed-b">
                        <pre className="bg-muted/50 p-4 overflow-x-auto text-sm font-mono">
                          <code>{sampleCode}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="documentation" className="mt-4">
                    <Card>
                      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                        <h2>Overview</h2>
                        <p>{zobj.description}</p>
                        
                        <h3>Purpose</h3>
                        <p>This custom Z-object extends standard SAP functionality for Star Cement-specific business requirements.</p>
                        
                        <h3>Usage</h3>
                        <p>Execute this report via transaction SE38 or call it from other programs using SUBMIT statement.</p>
                        
                        <h3>Dependencies</h3>
                        <ul>
                          <li>MARA - Material Master General Data</li>
                          <li>MARC - Plant-specific Material Data</li>
                          <li>Custom function modules from Z_SD_FUNCTIONS package</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="tests" className="mt-4">
                    <Card>
                      <CardContent>
                        {zobj.has_test_coverage ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="stat-value">85%</div>
                                <div className="text-sm text-muted-foreground">Test Coverage</div>
                              </div>
                              <Badge className="bg-emerald-500/10 text-emerald-600">Good</Badge>
                            </div>
                            <Progress value={85} className="h-2" />
                            
                            <div className="grid gap-4 sm:grid-cols-3 pt-4">
                              <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-xl font-bold text-emerald-600">12</div>
                                <div className="text-xs text-muted-foreground">Passing Tests</div>
                              </div>
                              <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-xl font-bold text-amber-600">2</div>
                                <div className="text-xs text-muted-foreground">Skipped</div>
                              </div>
                              <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-xl font-bold text-rose-600">0</div>
                                <div className="text-xs text-muted-foreground">Failing</div>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t">
                              <h4 className="font-medium mb-3">Linked Test Cases</h4>
                              <div className="space-y-2">
                                <Link href="#" className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm">TC_001: Validate material creation</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Passed</span>
                                </Link>
                                <Link href="#" className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm">TC_002: Test pricing calculation</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">Passed</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg">No Test Coverage</h3>
                            <p className="page-description mt-1">
                              This Z-object does not have associated test cases.
                            </p>
                            <Button className="mt-4">Create Test Case</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Modified by P.Sharma</span>
                                <span className="text-xs text-muted-foreground">2 days ago</span>
                              </div>
                              <p className="page-description mt-1">
                                Updated pricing logic for cement grade validation
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Modified by J.Rao</span>
                                <span className="text-xs text-muted-foreground">1 week ago</span>
                              </div>
                              <p className="page-description mt-1">
                                Added error handling for material type validation
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Created by M.Reddy</span>
                                <span className="text-xs text-muted-foreground">3 months ago</span>
                              </div>
                              <p className="page-description mt-1">
                                Initial version created for S/4HANA migration
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4 hidden lg:block">
                {/* Object Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Object Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span>{zobj.object_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Module</span>
                      <Badge variant="outline">{zobj.module}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-mono text-xs">{zobj.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines of Code</span>
                      <span>{zobj.lines_of_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport</span>
                      <span className="font-mono text-xs">{zobj.transport_request}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Last Modified */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Modified</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{formatDate(zobj.last_modified)}</div>
                        <div className="text-xs text-muted-foreground">by {zobj.modified_by}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Related Objects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Related Objects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {zobj.related_objects?.map(obj => (
                      <Link 
                        key={obj}
                        href="#"
                        className="flex items-center gap-2 text-sm hover:underline"
                      >
                        <Code2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">{obj}</span>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Linked Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span>Pricing Configuration Guide</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-2 text-sm hover:underline">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span>Material Master Setup</span>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
