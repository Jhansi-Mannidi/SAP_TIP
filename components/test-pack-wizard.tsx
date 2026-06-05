'use client'

import * as React from 'react'
import {
  Package,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Info,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  BookOpen,
  Globe,
  Building2,
  Briefcase,
  Shield,
  X,
  ChevronDown,
  Search,
  AlertCircle,
  Lock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

// Wizard steps
const STEPS = [
  { id: 'basics', label: 'Basics', icon: Package },
  { id: 'suites', label: 'Suites & Scenarios', icon: Layers },
  { id: 'cases', label: 'Test Cases', icon: ClipboardCheck },
  { id: 'fixtures', label: 'Data Fixtures', icon: Database },
  { id: 'knowledge', label: 'Knowledge Articles', icon: BookOpen },
  { id: 'scope', label: 'Tenant Scope', icon: Globe },
  { id: 'review', label: 'Review & Sign', icon: Shield },
]

// Sample data for the wizard
const SAMPLE_SUITES = [
  {
    id: 'suite_1',
    name: 'Star Cement Cutover Validation Suite',
    code: 'SC_CUTOVER_VAL',
    scenarios: [
      { id: 'sc_1', name: 'OTC Happy Path Domestic', cases: 7, selected: true },
      { id: 'sc_2', name: 'OTC with Credit Hold', cases: 9, selected: true },
      { id: 'sc_3', name: 'PTP Standard Procurement', cases: 8, selected: true },
      { id: 'sc_4', name: 'RTR Month-End Close', cases: 12, selected: true },
    ],
    selected: true,
  },
  {
    id: 'suite_2',
    name: 'SD Core Regression Suite',
    code: 'SD_CORE_REG',
    scenarios: [
      { id: 'sc_5', name: 'Sales Order Creation', cases: 5, selected: false },
      { id: 'sc_6', name: 'Delivery Processing', cases: 6, selected: false },
      { id: 'sc_7', name: 'Billing Document', cases: 4, selected: false },
    ],
    selected: false,
  },
]

const SAMPLE_CASES = [
  { id: 'tc_1', code: 'TC_VA01_CREATE', name: 'Create Sales Order via VA01', excluded: false },
  { id: 'tc_2', code: 'TC_VERIFY_CUST', name: 'Verify Customer Master Data', excluded: false },
  { id: 'tc_3', code: 'TC_ASSERT_ATP', name: 'Assert ATP Confirmation', excluded: false },
  { id: 'tc_4', code: 'TC_ME21N_PO', name: 'Create Purchase Order via ME21N', excluded: false },
  { id: 'tc_5', code: 'TC_MIGO_GR', name: 'Goods Receipt via MIGO', excluded: false },
  { id: 'tc_6', code: 'TC_FB01_JE', name: 'Post Journal Entry via FB01', excluded: false },
  { id: 'tc_7', code: 'TC_SIGNOFF_QA', name: 'QA Lead Sign-off', excluded: false },
]

const SAMPLE_FIXTURES = [
  { id: 'fix_1', code: 'CUST_DOMESTIC_SET', name: 'Domestic Customer Master Set', pii: 'medium', selected: true },
  { id: 'fix_2', code: 'MAT_FINISHED_GOODS', name: 'Finished Goods Material Set', pii: 'none', selected: true },
  { id: 'fix_3', code: 'VEND_DOMESTIC_SET', name: 'Domestic Vendor Master Set', pii: 'low', selected: true },
  { id: 'fix_4', code: 'SO_SAMPLE_ORDERS', name: 'Sample Sales Orders', pii: 'none', selected: true },
  { id: 'fix_5', code: 'CUST_EXPORT_SET', name: 'Export Customer Master Set', pii: 'high', selected: false },
]

const SAMPLE_ARTICLES = [
  { id: 'kb_1', title: 'OTC Process Flow Overview', type: 'Domain', scope: 'global', selected: true },
  { id: 'kb_2', title: 'VA01 Field Mapping Guide', type: 'BP', scope: 'global', selected: true },
  { id: 'kb_3', title: 'Star Cement Specific Pricing Logic', type: 'Org', scope: 'org', selected: false },
  { id: 'kb_4', title: 'Credit Management Rules', type: 'Domain', scope: 'global', selected: true },
  { id: 'kb_5', title: 'Internal Testing Standards', type: 'Org', scope: 'org', selected: false },
]

interface TestPackWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TestPackWizard({ open, onOpenChange }: TestPackWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSealing, setIsSealing] = React.useState(false)
  const [sealComplete, setSealComplete] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: 'Star Cement Cutover Test Pack',
    code: 'SC_CUTOVER_PACK',
    description: 'Complete test coverage for Star Cement S/4HANA cutover validation including OTC, PTP, and RTR processes.',
    version: 'v1.2',
    audience: 'customer',
    tenantScope: 'customer',
  })
  
  const [suites, setSuites] = React.useState(SAMPLE_SUITES)
  const [cases, setCases] = React.useState(SAMPLE_CASES)
  const [fixtures, setFixtures] = React.useState(SAMPLE_FIXTURES)
  const [articles, setArticles] = React.useState(SAMPLE_ARTICLES)
  
  // Validation
  const hasOrgKbWithGlobalScope = formData.tenantScope === 'global' && 
    articles.some(a => a.selected && a.scope === 'org')
  
  const hasHighPiiWithGlobalScope = formData.tenantScope === 'global' &&
    fixtures.some(f => f.selected && f.pii === 'high')
  
  const hasValidationErrors = hasOrgKbWithGlobalScope || hasHighPiiWithGlobalScope
  
  // Calculate counts
  const selectedSuites = suites.filter(s => s.selected).length
  const selectedScenarios = suites.flatMap(s => s.scenarios).filter(sc => sc.selected).length
  const selectedCases = cases.filter(c => !c.excluded).length
  const selectedFixtures = fixtures.filter(f => f.selected).length
  const selectedArticles = articles.filter(a => a.selected).length
  
  const progress = ((currentStep + 1) / STEPS.length) * 100
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSeal = async () => {
    setIsSealing(true)
    // Simulate sealing process
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsSealing(false)
    setSealComplete(true)
  }
  
  const handleClose = () => {
    setCurrentStep(0)
    setSealComplete(false)
    setIsSealing(false)
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-4 md:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg md:text-xl">Create Test Pack</DialogTitle>
              <DialogDescription className="text-sm">
                Package test content for distribution
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Progress Strip - Left side on desktop, top on mobile */}
          <div className="shrink-0 border-b md:border-b-0 md:border-r md:w-56 bg-muted/30">
            {/* Mobile: Horizontal progress */}
            <div className="md:hidden p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{STEPS[currentStep].label}</span>
                <span className="text-xs text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Desktop: Vertical steps */}
            <div className="hidden md:block p-4">
              <div className="space-y-1">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = index === currentStep
                  const isComplete = index < currentStep
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                        isActive && 'bg-primary text-primary-foreground',
                        isComplete && !isActive && 'text-muted-foreground hover:bg-muted',
                        !isActive && !isComplete && 'text-muted-foreground/60'
                      )}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                        isComplete && !isActive && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
                        isActive && 'bg-primary-foreground/20',
                        !isActive && !isComplete && 'bg-muted'
                      )}>
                        {isComplete && !isActive ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <StepIcon className="h-3 w-3" />
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">{step.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-4 md:p-6">
                {/* Step 1: Basics */}
                {currentStep === 0 && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Pack Basics</h3>
                      <p className="page-description">
                        Define the basic information for your test pack
                      </p>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Pack Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter pack name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="code">Pack Code</Label>
                          <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="SC_PACK_001"
                            className="font-mono"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="version">Version</Label>
                          <Input
                            id="version"
                            value={formData.version}
                            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            placeholder="v1.0"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the purpose and contents of this test pack"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Intended Audience</Label>
                        <RadioGroup
                          value={formData.audience}
                          onValueChange={(value) => setFormData({ ...formData, audience: value })}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                          <Label
                            htmlFor="audience-internal"
                            className={cn(
                              'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                              formData.audience === 'internal' && 'border-primary bg-primary/5'
                            )}
                          >
                            <RadioGroupItem value="internal" id="audience-internal" />
                            <div>
                              <p className="font-medium text-sm">Internal</p>
                              <p className="caption-text">Team use only</p>
                            </div>
                          </Label>
                          
                          <Label
                            htmlFor="audience-customer"
                            className={cn(
                              'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                              formData.audience === 'customer' && 'border-primary bg-primary/5'
                            )}
                          >
                            <RadioGroupItem value="customer" id="audience-customer" />
                            <div>
                              <p className="font-medium text-sm">Customer</p>
                              <p className="caption-text">Specific customer</p>
                            </div>
                          </Label>
                          
                          <Label
                            htmlFor="audience-partner"
                            className={cn(
                              'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                              formData.audience === 'partner' && 'border-primary bg-primary/5'
                            )}
                          >
                            <RadioGroupItem value="partner" id="audience-partner" />
                            <div>
                              <p className="font-medium text-sm">Partner</p>
                              <p className="caption-text">SI partners</p>
                            </div>
                          </Label>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Suites & Scenarios */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Suites & Scenarios</h3>
                      <p className="page-description">
                        Select test suites or individual scenarios to include
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{selectedSuites} Suites</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{selectedScenarios} Scenarios</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {suites.map((suite, suiteIndex) => (
                        <Collapsible key={suite.id} defaultOpen={suite.selected}>
                          <div className={cn(
                            'border rounded-lg overflow-hidden',
                            suite.selected && 'border-primary/50'
                          )}>
                            <div className="flex items-center gap-3 p-3 bg-muted/30">
                              <Checkbox
                                checked={suite.selected}
                                onCheckedChange={(checked) => {
                                  const newSuites = [...suites]
                                  newSuites[suiteIndex].selected = checked as boolean
                                  newSuites[suiteIndex].scenarios = newSuites[suiteIndex].scenarios.map(
                                    sc => ({ ...sc, selected: checked as boolean })
                                  )
                                  setSuites(newSuites)
                                }}
                              />
                              <CollapsibleTrigger className="flex-1 flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{suite.name}</p>
                                  <p className="caption-text">{suite.code}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </CollapsibleTrigger>
                            </div>
                            
                            <CollapsibleContent>
                              <div className="border-t divide-y">
                                {suite.scenarios.map((scenario, scenarioIndex) => (
                                  <div key={scenario.id} className="flex items-center gap-3 p-3 pl-10">
                                    <Checkbox
                                      checked={scenario.selected}
                                      onCheckedChange={(checked) => {
                                        const newSuites = [...suites]
                                        newSuites[suiteIndex].scenarios[scenarioIndex].selected = checked as boolean
                                        setSuites(newSuites)
                                      }}
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm">{scenario.name}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {scenario.cases} cases
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Step 3: Test Cases */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Test Cases</h3>
                      <p className="page-description">
                        Cases pulled from selected scenarios. Optionally exclude specific cases.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{selectedCases} Cases included</span>
                      </div>
                      <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search cases..." className="pl-9 h-8 text-sm" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg divide-y">
                      {cases.map((testCase, index) => (
                        <div
                          key={testCase.id}
                          className={cn(
                            'flex items-center gap-3 p-3',
                            testCase.excluded && 'opacity-50 bg-muted/30'
                          )}
                        >
                          <Checkbox
                            checked={!testCase.excluded}
                            onCheckedChange={(checked) => {
                              const newCases = [...cases]
                              newCases[index].excluded = !checked
                              setCases(newCases)
                            }}
                          />
                          <Badge variant="outline" className="font-mono text-xs shrink-0">
                            {testCase.code}
                          </Badge>
                          <span className="text-sm flex-1 truncate">{testCase.name}</span>
                          {testCase.excluded && (
                            <Badge variant="secondary" className="text-xs">Excluded</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Step 4: Data Fixtures */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Data Fixtures</h3>
                      <p className="page-description">
                        Select test data fixtures to include in the pack
                      </p>
                    </div>
                    
                    {hasHighPiiWithGlobalScope && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>PII Level Warning</AlertTitle>
                        <AlertDescription>
                          High-PII fixtures cannot be included when Tenant Scope is Global. 
                          Either change scope or deselect high-PII fixtures.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedFixtures} Fixtures selected</span>
                    </div>
                    
                    <div className="border rounded-lg divide-y">
                      {fixtures.map((fixture, index) => (
                        <div
                          key={fixture.id}
                          className={cn(
                            'flex items-center gap-3 p-3',
                            !fixture.selected && 'opacity-60'
                          )}
                        >
                          <Checkbox
                            checked={fixture.selected}
                            onCheckedChange={(checked) => {
                              const newFixtures = [...fixtures]
                              newFixtures[index].selected = checked as boolean
                              setFixtures(newFixtures)
                            }}
                          />
                          <Badge variant="outline" className="font-mono text-xs shrink-0">
                            {fixture.code}
                          </Badge>
                          <span className="text-sm flex-1 truncate">{fixture.name}</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs',
                              fixture.pii === 'high' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                              fixture.pii === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
                              fixture.pii === 'low' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                              fixture.pii === 'none' && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            )}
                          >
                            PII: {fixture.pii}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Step 5: Knowledge Articles */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Knowledge Articles</h3>
                      <p className="page-description">
                        Bundle relevant knowledge base articles with the pack
                      </p>
                    </div>
                    
                    {hasOrgKbWithGlobalScope && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>IP Boundary Violation</AlertTitle>
                        <AlertDescription>
                          Org KB articles cannot be included when Tenant Scope is Global. 
                          Either change scope to Customer/Workspace or remove Org KB articles.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedArticles} Articles selected</span>
                    </div>
                    
                    <div className="border rounded-lg divide-y">
                      {articles.map((article, index) => (
                        <div
                          key={article.id}
                          className={cn(
                            'flex items-center gap-3 p-3',
                            !article.selected && 'opacity-60'
                          )}
                        >
                          <Checkbox
                            checked={article.selected}
                            onCheckedChange={(checked) => {
                              const newArticles = [...articles]
                              newArticles[index].selected = checked as boolean
                              setArticles(newArticles)
                            }}
                          />
                          <span className="text-sm flex-1">{article.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {article.type}
                            </Badge>
                            {article.scope === 'org' && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              >
                                <Lock className="h-3 w-3 mr-1" />
                                Org Only
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Org KB articles are organization-specific and cannot be distributed 
                        cross-tenant. They will be marked with a warning if scope is incompatible.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Step 6: Tenant Scope */}
                {currentStep === 5 && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Tenant Scope</h3>
                      <p className="page-description">
                        Define the distribution scope for this test pack
                      </p>
                    </div>
                    
                    <RadioGroup
                      value={formData.tenantScope}
                      onValueChange={(value) => setFormData({ ...formData, tenantScope: value })}
                      className="space-y-3"
                    >
                      <Label
                        htmlFor="scope-global"
                        className={cn(
                          'flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                          formData.tenantScope === 'global' && 'border-primary bg-primary/5'
                        )}
                      >
                        <RadioGroupItem value="global" id="scope-global" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <p className="font-medium">Global</p>
                          </div>
                          <p className="page-description mt-1">
                            Available to all tenants. Cannot contain Org KB or high-PII data.
                          </p>
                        </div>
                      </Label>
                      
                      <Label
                        htmlFor="scope-customer"
                        className={cn(
                          'flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                          formData.tenantScope === 'customer' && 'border-primary bg-primary/5'
                        )}
                      >
                        <RadioGroupItem value="customer" id="scope-customer" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <p className="font-medium">Customer-Specific</p>
                          </div>
                          <p className="page-description mt-1">
                            Restricted to specific customer tenants. Can include customer-scoped data.
                          </p>
                        </div>
                      </Label>
                      
                      <Label
                        htmlFor="scope-workspace"
                        className={cn(
                          'flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                          formData.tenantScope === 'workspace' && 'border-primary bg-primary/5'
                        )}
                      >
                        <RadioGroupItem value="workspace" id="scope-workspace" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <p className="font-medium">Workspace</p>
                          </div>
                          <p className="page-description mt-1">
                            Limited to current workspace only. Full access to all content types.
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                    
                    {hasValidationErrors && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Scope Validation Failed</AlertTitle>
                        <AlertDescription>
                          {hasOrgKbWithGlobalScope && (
                            <p>1 Org KB article cannot be included when Tenant Scope is Global. 
                               Either change scope or remove article.</p>
                          )}
                          {hasHighPiiWithGlobalScope && (
                            <p>High-PII fixtures cannot be included with Global scope.</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
                
                {/* Step 7: Review & Sign */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Review & Sign</h3>
                      <p className="page-description">
                        Review the pack contents and seal with your signature
                      </p>
                    </div>
                    
                    {hasValidationErrors && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Cannot Seal Pack</AlertTitle>
                        <AlertDescription>
                          Please resolve IP boundary violations before sealing.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {sealComplete ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Pack Sealed Successfully</h4>
                        <p className="page-description mb-6">
                          Your test pack has been signed and is ready for distribution.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="outline" onClick={handleClose}>
                            Close
                          </Button>
                          <Button>
                            Download Pack
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Summary Card */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{formData.name}</h4>
                              <p className="page-description mt-1">{formData.description}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Badge variant="outline" className="font-mono">{formData.version}</Badge>
                                <Badge variant="secondary" className="capitalize">{formData.tenantScope} Scope</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <Layers className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-semibold">{selectedSuites}</p>
                              <p className="caption-text">Suites</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-semibold">{selectedScenarios}</p>
                              <p className="caption-text">Scenarios</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <ClipboardCheck className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-semibold">{selectedCases}</p>
                              <p className="caption-text">Cases</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <Database className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-semibold">{selectedFixtures}</p>
                              <p className="caption-text">Fixtures</p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <BookOpen className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-lg font-semibold">{selectedArticles}</p>
                              <p className="caption-text">Articles</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Signature Info */}
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">Digital Signature</p>
                              <p className="caption-text mt-1">
                                Sealing this pack will sign it with your DID credentials, 
                                establishing provenance and integrity verification.
                              </p>
                              <p className="text-xs font-mono mt-2 text-muted-foreground">
                                Signing as: did:voltus:0x4f8a...
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Footer */}
            {!sealComplete && (
              <div className="shrink-0 border-t p-4 flex items-center justify-between bg-background">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                
                <div className="flex items-center gap-2">
                  {currentStep === STEPS.length - 1 ? (
                    <Button
                      onClick={handleSeal}
                      disabled={hasValidationErrors || isSealing}
                      className="gap-2"
                    >
                      {isSealing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sealing...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          Seal Pack
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
