'use client'

import * as React from 'react'
import { 
  FileCheck,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Layers,
  Shield,
  PenTool,
  Eye,
  Lock,
  Users,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock Sign-Off Data
const SIGNOFF_SECTIONS = [
  {
    id: 'exec_summary',
    title: 'Executive Summary',
    status: 'Complete',
    signed_by: 'P.Sharma',
    signed_at: '2026-05-06T16:00:00',
    items: [
      { name: 'Migration Overview', status: 'Complete' },
      { name: 'Key Milestones Achieved', status: 'Complete' },
      { name: 'Risk Summary', status: 'Complete' },
    ]
  },
  {
    id: 'test_evidence',
    title: 'Test Execution Evidence',
    status: 'Complete',
    signed_by: 'J.Rao',
    signed_at: '2026-05-06T14:30:00',
    items: [
      { name: 'Test Suite Results', status: 'Complete', count: 47 },
      { name: 'Test Scenario Reports', status: 'Complete', count: 188 },
      { name: 'Defect Resolution Summary', status: 'Complete', count: 23 },
      { name: 'Screenshots & Recordings', status: 'Complete', count: 312 },
    ]
  },
  {
    id: 'data_migration',
    title: 'Data Migration Evidence',
    status: 'Complete',
    signed_by: 'Data Lead',
    signed_at: '2026-05-06T12:00:00',
    items: [
      { name: 'Extraction Reports', status: 'Complete' },
      { name: 'Transformation Logs', status: 'Complete' },
      { name: 'Load Validation Reports', status: 'Complete' },
      { name: 'Reconciliation Summaries', status: 'Complete' },
    ]
  },
  {
    id: 'cutover_evidence',
    title: 'Cutover Execution Evidence',
    status: 'In Progress',
    signed_by: null,
    signed_at: null,
    items: [
      { name: 'Cutover Task Completion', status: 'Complete' },
      { name: 'System Snapshots', status: 'Complete' },
      { name: 'Go-Live Checklist', status: 'In Progress' },
      { name: 'Rollback Plan Verification', status: 'Pending' },
    ]
  },
  {
    id: 'stakeholder_signoff',
    title: 'Stakeholder Sign-Offs',
    status: 'Pending',
    signed_by: null,
    signed_at: null,
    items: [
      { name: 'IT Director Approval', status: 'Pending', assignee: 'R.Agarwal' },
      { name: 'Business Owner Approval', status: 'Pending', assignee: 'V.Mehta' },
      { name: 'QA Lead Certification', status: 'Complete', assignee: 'J.Rao' },
      { name: 'Compliance Sign-Off', status: 'Pending', assignee: 'Legal Team' },
    ]
  },
]

const AUDIT_ARTIFACTS = [
  { id: 'art_1', name: 'Full Test Execution Report', type: 'PDF', size: '4.2 MB', generated_at: '2026-05-06T16:00:00' },
  { id: 'art_2', name: 'Data Migration Evidence Pack', type: 'ZIP', size: '156 MB', generated_at: '2026-05-06T14:00:00' },
  { id: 'art_3', name: 'Defect Resolution Summary', type: 'PDF', size: '2.1 MB', generated_at: '2026-05-06T12:00:00' },
  { id: 'art_4', name: 'Screenshot Evidence Archive', type: 'ZIP', size: '892 MB', generated_at: '2026-05-06T10:00:00' },
  { id: 'art_5', name: 'Cutover Execution Log', type: 'PDF', size: '1.8 MB', generated_at: '2026-05-05T20:00:00' },
]

const statusConfig = {
  Complete: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
  'In Progress': { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: Clock },
  Pending: { color: 'bg-muted text-muted-foreground', icon: Clock },
}

export default function SignOffPackPage() {
  const completeSections = SIGNOFF_SECTIONS.filter(s => s.status === 'Complete').length
  const totalSections = SIGNOFF_SECTIONS.length
  const progress = Math.round((completeSections / totalSections) * 100)

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">Sign-Off Pack</h1>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {progress}% Complete
                  </Badge>
                </div>
                <p className="page-description mt-1">
                  Migration evidence and stakeholder approvals for audit compliance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button className="gap-2" disabled={progress < 100}>
                  <Download className="h-4 w-4" />
                  Generate Pack
                </Button>
              </div>
            </div>
            
            {/* Progress Overview */}
            <Card className="mt-4">
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Star Cement S/4HANA Migration</p>
                      <p className="page-description">Sign-Off Pack Assembly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="stat-value text-emerald-600 dark:text-emerald-400">{completeSections}</p>
                      <p className="caption-text">Sections Complete</p>
                    </div>
                    <div className="text-center">
                      <p className="stat-value text-blue-600 dark:text-blue-400">{totalSections - completeSections}</p>
                      <p className="caption-text">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="stat-value">3</p>
                      <p className="caption-text">Signatures Needed</p>
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="mt-4 h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs defaultValue="sections" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              <TabsTrigger value="signatures">Signatures</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sections" className="space-y-4">
              {SIGNOFF_SECTIONS.map((section) => {
                const StatusIcon = statusConfig[section.status as keyof typeof statusConfig].icon
                const completeItems = section.items.filter(i => i.status === 'Complete').length
                
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            section.status === 'Complete' ? 'bg-emerald-500/10' :
                            section.status === 'In Progress' ? 'bg-blue-500/10' : 'bg-muted'
                          )}>
                            <FileText className={cn(
                              'h-5 w-5',
                              section.status === 'Complete' ? 'text-emerald-500' :
                              section.status === 'In Progress' ? 'text-blue-500' : 'text-muted-foreground'
                            )} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{section.title}</CardTitle>
                            <CardDescription className="mt-0.5">
                              {completeItems} of {section.items.length} items complete
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={cn('gap-1', statusConfig[section.status as keyof typeof statusConfig].color)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {section.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {section.items.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              {item.status === 'Complete' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : item.status === 'In Progress' ? (
                                <Clock className="h-4 w-4 text-blue-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                              )}
                              <span className="text-sm">{item.name}</span>
                              {'count' in item && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.count} items
                                </Badge>
                              )}
                            </div>
                            {'assignee' in item && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Users className="h-3 w-3" />
                                {item.assignee}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {section.signed_by && (
                        <div className="mt-4 pt-3 border-t flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <PenTool className="h-4 w-4" />
                            <span>Signed by {section.signed_by}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(section.signed_at!).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
            
            <TabsContent value="artifacts">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Artifacts</CardTitle>
                  <CardDescription>Downloadable evidence files for audit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {AUDIT_ARTIFACTS.map((artifact) => (
                      <div 
                        key={artifact.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{artifact.name}</p>
                            <p className="caption-text">
                              {artifact.type} - {artifact.size} - Generated {new Date(artifact.generated_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signatures">
              <Card>
                <CardHeader>
                  <CardTitle>Required Signatures</CardTitle>
                  <CardDescription>Stakeholder approvals needed for sign-off completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { role: 'IT Director', name: 'R.Agarwal', status: 'Pending', section: 'Executive Summary' },
                      { role: 'Business Owner', name: 'V.Mehta', status: 'Pending', section: 'Go-Live Approval' },
                      { role: 'QA Lead', name: 'J.Rao', status: 'Signed', section: 'Test Evidence', signed_at: '2026-05-06T14:30:00' },
                      { role: 'Compliance Officer', name: 'Legal Team', status: 'Pending', section: 'Regulatory Compliance' },
                    ].map((sig, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border',
                          sig.status === 'Signed' ? 'bg-emerald-500/5 border-emerald-500/20' : ''
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            sig.status === 'Signed' ? 'bg-emerald-500/10' : 'bg-muted'
                          )}>
                            {sig.status === 'Signed' ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <PenTool className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{sig.role}</p>
                            <p className="page-description">{sig.name} - {sig.section}</p>
                          </div>
                        </div>
                        {sig.status === 'Signed' ? (
                          <div className="text-right">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Signed
                            </Badge>
                            <p className="caption-text mt-1">
                              {new Date(sig.signed_at!).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-2">
                            <PenTool className="h-4 w-4" />
                            Request Signature
                          </Button>
                        )}
                      </div>
                    ))}
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
