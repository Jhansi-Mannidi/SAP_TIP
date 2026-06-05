'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { AuditTrailTable } from '@/components/audit-trail-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Pencil,
  Copy,
  TestTube2,
  Archive,
  MoreHorizontal,
  Database,
  Globe,
  Building2,
  Briefcase,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  ClipboardCheck,
  ExternalLink,
  Play,
  Loader2,
} from 'lucide-react'

import { 
  MOCK_FIXTURE_DETAIL, 
  MOCK_TEST_SCENARIOS,
  MOCK_TEST_CASES,
  type PIILevel,
  type KNA1Field,
} from '@/lib/mock-data'

// PII level badge
function PIILevelBadge({ level, size = 'default' }: { level: PIILevel; size?: 'default' | 'sm' }) {
  const config: Record<PIILevel, { icon: React.ElementType; bg: string; text: string; label: string }> = {
    'none': { icon: ShieldCheck, bg: 'bg-slate-100', text: 'text-slate-600', label: 'None' },
    'low': { icon: Shield, bg: 'bg-blue-50', text: 'text-blue-600', label: 'Low' },
    'medium': { icon: ShieldAlert, bg: 'bg-amber-50', text: 'text-amber-600', label: 'Medium' },
    'high': { icon: ShieldX, bg: 'bg-red-50', text: 'text-red-600', label: 'High' },
  }
  
  const { icon: Icon, bg, text, label } = config[level]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        bg, text, 'border-transparent gap-1',
        size === 'sm' && 'text-xs px-1.5 py-0'
      )}
    >
      <Icon className={cn('h-3 w-3', size === 'sm' && 'h-2.5 w-2.5')} />
      {label}
    </Badge>
  )
}

// Tenant scope badge
function TenantScopeBadge({ scope }: { scope: string }) {
  const config: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
    'Global': { icon: Globe, bg: 'bg-indigo-50', text: 'text-indigo-700' },
    'Customer': { icon: Building2, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'Workspace': { icon: Briefcase, bg: 'bg-slate-100', text: 'text-slate-700' },
  }
  
  const { icon: Icon, bg, text } = config[scope] || config['Workspace']
  
  return (
    <Badge variant="outline" className={cn(bg, text, 'border-transparent gap-1')}>
      <Icon className="h-3 w-3" />
      {scope}
    </Badge>
  )
}

// Data kind badge
function DataKindBadge({ kind }: { kind: string }) {
  return (
    <Badge variant="outline" className="font-mono text-xs capitalize">
      {kind}
    </Badge>
  )
}

export default function DataFixtureDetailPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('payload')
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false)
  const [isTesting, setIsTesting] = React.useState(false)
  const [testResults, setTestResults] = React.useState<Record<string, 'pass' | 'fail' | null>>({})
  const [editedPayload, setEditedPayload] = React.useState<KNA1Field[]>(MOCK_FIXTURE_DETAIL.payload)
  const [piiLevels, setPiiLevels] = React.useState<Record<string, PIILevel>>(
    Object.fromEntries(MOCK_FIXTURE_DETAIL.payload.map(f => [f.field, f.pii_level]))
  )
  
  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])
  
  const fixture = MOCK_FIXTURE_DETAIL
  
  // Check for PII validation error
  const hasHighPIIGlobalError = React.useMemo(() => {
    const hasHighPII = Object.values(piiLevels).some(level => level === 'high')
    return hasHighPII && fixture.tenant_scope === 'Global'
  }, [piiLevels, fixture.tenant_scope])
  
  // Get scenarios/cases using this fixture
  const usedScenarios = MOCK_TEST_SCENARIOS.filter(s => 
    fixture.used_in_scenarios.includes(s.id)
  )
  const usedTestCases = MOCK_TEST_CASES.filter(tc => 
    fixture.used_in_test_cases.includes(tc.id)
  )
  
  // Handle field value change
  const handleFieldChange = (field: string, value: string) => {
    setEditedPayload(prev => 
      prev.map(f => f.field === field ? { ...f, value } : f)
    )
  }
  
  // Handle PII level change
  const handlePIIChange = (field: string, level: PIILevel) => {
    setPiiLevels(prev => ({ ...prev, [field]: level }))
  }
  
  // Run test in system
  const handleTestInSystem = async () => {
    setIsTesting(true)
    setTestResults({})
    
    // Simulate testing each field
    for (const field of editedPayload) {
      await new Promise(r => setTimeout(r, 300))
      setTestResults(prev => ({
        ...prev,
        [field.field]: Math.random() > 0.15 ? 'pass' : 'fail'
      }))
    }
    
    setIsTesting(false)
  }
  
  if (isLoading) {
    return (
      <AppShell currentApp="test-repository">
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AppShell>
    )
  }
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="p-6 space-y-4">
            {/* Breadcrumb & Back */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/test-repository/data">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Data Fixtures
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-mono text-muted-foreground">{fixture.code}</span>
            </div>
            
            {/* Title Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="page-title">{fixture.name}</h1>
                    <p className="page-description">{fixture.code}</p>
                  </div>
                </div>
                
                {/* Metadata badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <DataKindBadge kind={fixture.data_kind} />
                  <Badge variant="outline" className="font-mono text-xs">
                    {fixture.sap_object_type}
                  </Badge>
                  <TenantScopeBadge scope={fixture.tenant_scope} />
                  <PIILevelBadge level={fixture.has_pii} />
                  <StatusBadge status={fixture.state} />
                  <Badge variant="outline" className="font-mono text-xs">
                    v{fixture.version}
                  </Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setIsTestModalOpen(true)}
                >
                  <TestTube2 className="h-4 w-4 mr-2" />
                  Test in System
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Archive className="h-4 w-4 mr-2" />
                      Mark Deprecated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-6">
            <TabsList className="h-12 bg-transparent p-0 gap-6">
              <TabsTrigger 
                value="payload"
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Payload
              </TabsTrigger>
              <TabsTrigger 
                value="pii"
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                PII Flags
                {hasHighPIIGlobalError && (
                  <AlertTriangle className="h-4 w-4 ml-1 text-destructive" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="usage"
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Usage
                <Badge variant="secondary" className="ml-2 text-xs">
                  {usedScenarios.length + usedTestCases.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="audit"
                className="h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Audit
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Payload Tab */}
          <TabsContent value="payload" className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    KNA1 Customer Master Fields
                  </CardTitle>
                  <CardDescription>
                    {fixture.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {editedPayload.map(field => (
                      <div key={field.field} className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            {field.field}
                          </span>
                          <span>{field.label}</span>
                          {field.required && (
                            <span className="text-destructive">*</span>
                          )}
                          {field.pii_level !== 'none' && (
                            <PIILevelBadge level={field.pii_level} size="sm" />
                          )}
                        </Label>
                        
                        {field.dataType === 'select' && field.options ? (
                          <Select 
                            value={field.value}
                            onValueChange={(val) => handleFieldChange(field.field, val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            value={field.value}
                            onChange={(e) => handleFieldChange(field.field, e.target.value)}
                            className="font-mono"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* PII Flags Tab */}
          <TabsContent value="pii" className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl space-y-6">
              {/* PII Validation Error */}
              {hasHighPIIGlobalError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>PII Validation Error</AlertTitle>
                  <AlertDescription>
                    PII-high fixtures cannot be global. Reduce the tenant scope to Customer or Workspace, 
                    or lower the PII level on all high-PII fields.
                  </AlertDescription>
                </Alert>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Per-Field PII Classification
                  </CardTitle>
                  <CardDescription>
                    Set the PII sensitivity level for each field. High-PII fields are masked in logs 
                    and cannot be used in globally-scoped fixtures.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editedPayload.map(field => (
                      <div 
                        key={field.field} 
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border',
                          piiLevels[field.field] === 'high' && 'bg-red-50/50 border-red-200',
                          piiLevels[field.field] === 'medium' && 'bg-amber-50/50 border-amber-200',
                          piiLevels[field.field] === 'low' && 'bg-blue-50/50 border-blue-200',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{field.label}</p>
                            <p className="caption-text">{field.field}</p>
                          </div>
                          <div className="text-sm text-muted-foreground font-mono max-w-[200px] truncate">
                            {field.value || '-'}
                          </div>
                        </div>
                        
                        <Select 
                          value={piiLevels[field.field]}
                          onValueChange={(val) => handlePIIChange(field.field, val as PIILevel)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3 text-slate-500" />
                                None
                              </div>
                            </SelectItem>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <Shield className="h-3 w-3 text-blue-500" />
                                Low
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <ShieldAlert className="h-3 w-3 text-amber-500" />
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <ShieldX className="h-3 w-3 text-red-500" />
                                High
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* PII Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">PII Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <StaggerGrid columns="grid-cols-4" className="gap-4" fast>
                    {(['none', 'low', 'medium', 'high'] as PIILevel[]).map(level => {
                      const count = Object.values(piiLevels).filter(l => l === level).length
                      return (
                        <div key={level} className="text-center p-3 rounded-lg bg-muted/50">
                          <PIILevelBadge level={level} />
                          <p className="stat-value mt-2">{count}</p>
                          <p className="caption-text">fields</p>
                        </div>
                      )
                    })}
                  </StaggerGrid>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Usage Tab */}
          <TabsContent value="usage" className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl space-y-6">
              {/* Scenarios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Used in Scenarios
                    <Badge variant="secondary">{usedScenarios.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usedScenarios.length === 0 ? (
                    <p className="page-description">Not used in any scenarios</p>
                  ) : (
                    <div className="space-y-2">
                      {usedScenarios.map(scenario => (
                        <div 
                          key={scenario.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm">{scenario.name}</p>
                            <p className="caption-text">{scenario.code}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/test-repository/scenarios/${scenario.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Test Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Used in Test Cases
                    <Badge variant="secondary">{usedTestCases.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usedTestCases.length === 0 ? (
                    <p className="page-description">Not used in any test cases</p>
                  ) : (
                    <div className="space-y-2">
                      {usedTestCases.map(tc => (
                        <div 
                          key={tc.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm">{tc.name}</p>
                            <p className="caption-text">{tc.code}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/test-repository/tasks/${tc.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Audit Tab */}
          <TabsContent value="audit" className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl">
              <AuditTrailTable events={fixture.audit_events} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Test in System Modal */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Test Fixture in SAP System</DialogTitle>
            <DialogDescription>
              Validate fixture data against a target SAP system and client.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
              <div className="space-y-2">
                <Label>Target System</Label>
                <Select defaultValue="SC4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SC4">SC4 (S/4 Sandbox)</SelectItem>
                    <SelectItem value="SCQ">SCQ (S/4 QAS)</SelectItem>
                    <SelectItem value="SCD">SCD (S/4 DEV)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select defaultValue="100">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="300">300</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </StaggerGrid>
            
            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-2 max-h-[300px] overflow-auto">
                <Label>Validation Results</Label>
                <div className="border rounded-lg divide-y">
                  {editedPayload.map(field => (
                    <div 
                      key={field.field}
                      className={cn(
                        'flex items-center justify-between p-2 text-sm',
                        testResults[field.field] === 'pass' && 'bg-emerald-50',
                        testResults[field.field] === 'fail' && 'bg-red-50',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          {field.field}
                        </span>
                        <span>{field.label}</span>
                      </div>
                      {testResults[field.field] === null && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {testResults[field.field] === 'pass' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                      {testResults[field.field] === 'fail' && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)}>
              Close
            </Button>
            <Button onClick={handleTestInSystem} disabled={isTesting}>
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Validation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
