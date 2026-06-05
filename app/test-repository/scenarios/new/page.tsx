'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  FileText, 
  Layers,
  Settings,
  TestTube2,
  Plus,
  X,
  Wand2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'basics', title: 'Basic Info', icon: FileText },
  { id: 'configuration', title: 'Configuration', icon: Settings },
  { id: 'test-cases', title: 'Test Cases', icon: TestTube2 },
  { id: 'review', title: 'Review', icon: Check },
]

const modules = [
  { value: 'SD', label: 'Sales & Distribution' },
  { value: 'MM', label: 'Materials Management' },
  { value: 'FI', label: 'Finance' },
  { value: 'CO', label: 'Controlling' },
  { value: 'PP', label: 'Production Planning' },
  { value: 'HR', label: 'Human Resources' },
]

const processes = [
  { value: 'OTC', label: 'Order to Cash', module: 'SD' },
  { value: 'PTP', label: 'Procure to Pay', module: 'MM' },
  { value: 'RTR', label: 'Record to Report', module: 'FI' },
  { value: 'HTH', label: 'Hire to Retire', module: 'HR' },
]

export default function NewScenarioPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isGenerating, setIsGenerating] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    code: '',
    description: '',
    module: '',
    process: '',
    priority: 'medium',
    tags: [] as string[],
    testCases: [] as { id: string; name: string; description: string }[],
  })

  const [newTag, setNewTag] = React.useState('')
  const [newCase, setNewCase] = React.useState({ name: '', description: '' })

  const progress = ((currentStep + 1) / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name && formData.code && formData.module
      case 1:
        return formData.process && formData.priority
      case 2:
        return formData.testCases.length > 0
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleAddTestCase = () => {
    if (newCase.name) {
      setFormData(prev => ({
        ...prev,
        testCases: [...prev.testCases, { 
          id: `tc_${Date.now()}`, 
          name: newCase.name, 
          description: newCase.description 
        }]
      }))
      setNewCase({ name: '', description: '' })
    }
  }

  const handleRemoveTestCase = (id: string) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter(tc => tc.id !== id)
    }))
  }

  const handleGenerateWithAI = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormData(prev => ({
      ...prev,
      testCases: [
        { id: 'tc_1', name: 'Verify Order Creation', description: 'Create a standard sales order with customer and material' },
        { id: 'tc_2', name: 'Check Pricing Determination', description: 'Validate that correct pricing procedure is applied' },
        { id: 'tc_3', name: 'Validate Availability Check', description: 'Ensure ATP check returns correct dates' },
        { id: 'tc_4', name: 'Verify Credit Check', description: 'Check credit limit validation for customer' },
      ]
    }))
    setIsGenerating(false)
  }

  const handleSubmit = () => {
    // In a real app, this would save to the backend
    router.push('/test-repository/scenarios')
  }

  const StepIcon = steps[currentStep].icon

  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/test-repository/scenarios">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="page-title">Create New Scenario</h1>
            <p className="page-description">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  index < currentStep ? 'bg-primary text-primary-foreground' :
                  index === currentStep ? 'bg-primary/20 text-primary border border-primary' :
                  'bg-muted text-muted-foreground'
                )}>
                  {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{steps[currentStep].title}</CardTitle>
                    <CardDescription>
                      {currentStep === 0 && 'Enter the basic information for your test scenario'}
                      {currentStep === 1 && 'Configure process mapping and priority settings'}
                      {currentStep === 2 && 'Add test cases to your scenario'}
                      {currentStep === 3 && 'Review and create your scenario'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Scenario Name *</Label>
                        <Input
                          id="name"
                          placeholder="e.g., OTC Happy Path Domestic"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="code">Scenario Code *</Label>
                        <Input
                          id="code"
                          placeholder="e.g., SC_OTC_001"
                          value={formData.code}
                          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this scenario tests..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Module *</Label>
                      <Select value={formData.module} onValueChange={(v) => setFormData(prev => ({ ...prev, module: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SAP module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map(m => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.value} - {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Configuration */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Business Process *</Label>
                      <Select value={formData.process} onValueChange={(v) => setFormData(prev => ({ ...prev, process: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business process" />
                        </SelectTrigger>
                        <SelectContent>
                          {processes.map(p => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.value} - {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority *</Label>
                      <Select value={formData.priority} onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Test Cases */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="page-description">
                        {formData.testCases.length} test case(s) added
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateWithAI}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                            </motion.div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="space-y-2">
                        <Label>Test Case Name</Label>
                        <Input
                          placeholder="e.g., Verify Order Creation"
                          value={newCase.name}
                          onChange={(e) => setNewCase(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="What does this test case verify?"
                          value={newCase.description}
                          onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <Button onClick={handleAddTestCase} disabled={!newCase.name}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Case
                      </Button>
                    </div>

                    {formData.testCases.length > 0 && (
                      <div className="space-y-2">
                        {formData.testCases.map((tc, index) => (
                          <motion.div
                            key={tc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{tc.name}</p>
                              {tc.description && (
                                <p className="caption-text mt-1">{tc.description}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveTestCase(tc.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Code</Label>
                        <p className="font-mono">{formData.code}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Module</Label>
                        <p>{formData.module}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Process</Label>
                        <p>{formData.process}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Priority</Label>
                        <Badge variant="outline" className="capitalize">{formData.priority}</Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Test Cases</Label>
                        <p>{formData.testCases.length} case(s)</p>
                      </div>
                    </div>
                    {formData.description && (
                      <div>
                        <Label className="text-muted-foreground">Description</Label>
                        <p className="text-sm mt-1">{formData.description}</p>
                      </div>
                    )}
                    {formData.tags.length > 0 && (
                      <div>
                        <Label className="text-muted-foreground">Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
