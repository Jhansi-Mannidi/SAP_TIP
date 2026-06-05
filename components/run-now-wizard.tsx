'use client'

import * as React from 'react'
import {
  Play,
  Check,
  ChevronRight,
  Search,
  Layers,
  FileText,
  Server,
  Users,
  Clock,
  Zap,
  Bot,
  User,
  AlertTriangle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface RunNowWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const steps = [
  { id: 1, label: 'Select Content', icon: Layers },
  { id: 2, label: 'Target System', icon: Server },
  { id: 3, label: 'Execution Options', icon: Zap },
  { id: 4, label: 'Review & Start', icon: Play },
]

const availableSuites = [
  { id: 'suite_1', name: 'Star Cement Cutover Validation Suite', scenarios: 47, cases: 312 },
  { id: 'suite_2', name: 'SD Core Regression Suite', scenarios: 32, cases: 186 },
  { id: 'suite_3', name: 'FI/CO Compliance Pack', scenarios: 28, cases: 156 },
  { id: 'suite_4', name: 'MM Regression Suite', scenarios: 24, cases: 142 },
]

const availableSystems = [
  { id: 'sys_dev', sid: 'S4D', name: 'Development', client: '100', status: 'online' },
  { id: 'sys_qas', sid: 'S4Q', name: 'Quality', client: '200', status: 'online' },
  { id: 'sys_pre', sid: 'S4P', name: 'Pre-Production', client: '300', status: 'online' },
]

const runnerPools = [
  { id: 'pool_1', name: 'Primary Pool', available: 8, total: 10 },
  { id: 'pool_2', name: 'High Priority Pool', available: 4, total: 4 },
]

export function RunNowWizard({ open, onOpenChange }: RunNowWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [selectedSuites, setSelectedSuites] = React.useState<string[]>([])
  const [selectedSystem, setSelectedSystem] = React.useState('')
  const [selectedPool, setSelectedPool] = React.useState('')
  const [executionMode, setExecutionMode] = React.useState('parallel')
  const [healingEnabled, setHealingEnabled] = React.useState(true)
  const [priority, setPriority] = React.useState('normal')
  const [isStarting, setIsStarting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredSuites = availableSuites.filter(suite =>
    suite.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalScenarios = selectedSuites.reduce((sum, id) => {
    const suite = availableSuites.find(s => s.id === id)
    return sum + (suite?.scenarios || 0)
  }, 0)

  const totalCases = selectedSuites.reduce((sum, id) => {
    const suite = availableSuites.find(s => s.id === id)
    return sum + (suite?.cases || 0)
  }, 0)

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSuites.length > 0
      case 2: return selectedSystem !== ''
      case 3: return selectedPool !== ''
      case 4: return true
      default: return false
    }
  }

  const handleStart = () => {
    setIsStarting(true)
    setTimeout(() => {
      setIsStarting(false)
      onOpenChange(false)
      // Reset state
      setCurrentStep(1)
      setSelectedSuites([])
      setSelectedSystem('')
      setSelectedPool('')
    }, 2000)
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedSuites([])
    setSelectedSystem('')
    setSelectedPool('')
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Run Now</DialogTitle>
          <DialogDescription>
            Configure and start a new test execution
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Progress Strip */}
          <div className="w-56 border-r bg-muted/30 p-4 hidden md:block">
            <div className="space-y-1">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <button
                    key={step.id}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    disabled={step.id > currentStep}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isActive && "bg-primary-foreground/20",
                      isCompleted && "bg-emerald-500",
                      !isActive && !isCompleted && "bg-muted"
                    )}>
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-6">
              {/* Step 1: Select Content */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search suites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredSuites.map((suite) => (
                      <div
                        key={suite.id}
                        className={cn(
                          "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                          selectedSuites.includes(suite.id) && "border-primary bg-primary/5"
                        )}
                        onClick={() => {
                          setSelectedSuites(prev =>
                            prev.includes(suite.id)
                              ? prev.filter(id => id !== suite.id)
                              : [...prev, suite.id]
                          )
                        }}
                      >
                        <Checkbox
                          checked={selectedSuites.includes(suite.id)}
                          onCheckedChange={() => {}}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{suite.name}</p>
                          <p className="page-description">
                            {suite.scenarios} scenarios, {suite.cases} test cases
                          </p>
                        </div>
                        <Layers className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>

                  {selectedSuites.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        Selected: {selectedSuites.length} suite(s), {totalScenarios} scenarios, {totalCases} cases
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Target System */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label>Select Target SAP System</Label>
                  <RadioGroup value={selectedSystem} onValueChange={setSelectedSystem}>
                    {availableSystems.map((system) => (
                      <div
                        key={system.id}
                        className={cn(
                          "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                          selectedSystem === system.id && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedSystem(system.id)}
                      >
                        <RadioGroupItem value={system.id} />
                        <Server className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{system.sid}</p>
                            <Badge variant="outline" className="text-xs">{system.name}</Badge>
                          </div>
                          <p className="page-description">Client {system.client}</p>
                        </div>
                        <Badge variant={system.status === 'online' ? 'default' : 'destructive'} className="bg-emerald-500">
                          {system.status}
                        </Badge>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Execution Options */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Runner Pool</Label>
                    <RadioGroup value={selectedPool} onValueChange={setSelectedPool}>
                      {runnerPools.map((pool) => (
                        <div
                          key={pool.id}
                          className={cn(
                            "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                            selectedPool === pool.id && "border-primary bg-primary/5"
                          )}
                          onClick={() => setSelectedPool(pool.id)}
                        >
                          <RadioGroupItem value={pool.id} />
                          <div className="flex-1">
                            <p className="font-medium">{pool.name}</p>
                            <p className="page-description">
                              {pool.available} of {pool.total} runners available
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Execution Mode</Label>
                    <Select value={executionMode} onValueChange={setExecutionMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parallel">Parallel (Fastest)</SelectItem>
                        <SelectItem value="sequential">Sequential</SelectItem>
                        <SelectItem value="priority">Priority-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Checkbox
                      checked={healingEnabled}
                      onCheckedChange={(checked) => setHealingEnabled(checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <p className="font-medium">Enable Auto-Healing</p>
                      </div>
                      <p className="page-description">
                        Automatically recover from transient failures using AI healing
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Start */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">Execution Summary</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="page-description">Suites</p>
                        <p className="font-medium">{selectedSuites.length} selected</p>
                      </div>
                      <div>
                        <p className="page-description">Scenarios</p>
                        <p className="font-medium">{totalScenarios}</p>
                      </div>
                      <div>
                        <p className="page-description">Test Cases</p>
                        <p className="font-medium">{totalCases}</p>
                      </div>
                      <div>
                        <p className="page-description">Est. Duration</p>
                        <p className="font-medium">~{Math.round(totalCases * 0.5)} min</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">Target System</h4>
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>{availableSystems.find(s => s.id === selectedSystem)?.sid}</span>
                      <Badge variant="outline">
                        {availableSystems.find(s => s.id === selectedSystem)?.name}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <h4 className="font-medium">Execution Options</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{executionMode} mode</Badge>
                      <Badge variant="secondary">{priority} priority</Badge>
                      {healingEnabled && <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">Auto-Healing ON</Badge>}
                    </div>
                  </div>

                  {priority === 'critical' && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Critical priority runs will preempt lower priority executions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Footer Actions */}
            <div className="p-4 border-t flex items-center justify-between">
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    Back
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleStart} disabled={isStarting} className="gap-2">
                    {isStarting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Start Execution
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
