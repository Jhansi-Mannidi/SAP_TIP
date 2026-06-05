'use client'

import * as React from 'react'
import { 
  GitBranch, 
  Plus,
  MoreHorizontal,
  GripVertical,
  Play,
  Settings,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronRight,
  FlaskConical,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import { MOCK_PAIRING_RULES } from '@/lib/config-mock-data'

export default function PairingRulesPage() {
  const [rules, setRules] = React.useState(MOCK_PAIRING_RULES)
  const [expandedRules, setExpandedRules] = React.useState<Set<string>>(new Set())
  const [testDialogOpen, setTestDialogOpen] = React.useState(false)
  const [selectedRuleForTest, setSelectedRuleForTest] = React.useState<string | null>(null)
  const [testContext, setTestContext] = React.useState('')
  const [testResult, setTestResult] = React.useState<{ matches: boolean; assignee?: string } | null>(null)
  
  const toggleExpand = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev)
      if (next.has(ruleId)) {
        next.delete(ruleId)
      } else {
        next.add(ruleId)
      }
      return next
    })
  }
  
  const toggleActive = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, is_active: !rule.is_active } : rule
    ))
  }
  
  const openTestDialog = (ruleId: string) => {
    setSelectedRuleForTest(ruleId)
    setTestContext(JSON.stringify({
      scenario: { module: 'SD', code: 'SC_OTC_001' },
      migration: { code: 'SC_S4_CUTOVER_2026' },
      defect: { severity: 'High' },
      task: { type: 'test_execution' },
    }, null, 2))
    setTestResult(null)
    setTestDialogOpen(true)
  }
  
  const runTest = () => {
    // Simulate test result
    const matches = Math.random() > 0.3
    setTestResult({
      matches,
      assignee: matches ? 'Jahnavi Rao' : undefined,
    })
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Pairing Rules</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Contextual auto-assignment of Service Roles. Evaluated at Task instantiation; first matching rule wins by priority.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>New Rule</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[80px]">Priority</TableHead>
                  <TableHead>Predicate</TableHead>
                  <TableHead>Target Role</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Fallback</TableHead>
                  <TableHead className="w-[80px]">Active</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <React.Fragment key={rule.id}>
                    <TableRow className={cn(!rule.is_active && 'opacity-50')}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {rule.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Collapsible open={expandedRules.has(rule.id)}>
                          <CollapsibleTrigger 
                            className="flex items-center gap-2 text-left hover:text-primary"
                            onClick={() => toggleExpand(rule.id)}
                          >
                            {expandedRules.has(rule.id) ? (
                              <ChevronDown className="h-4 w-4 shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0" />
                            )}
                            <span className="text-sm truncate max-w-[300px]">
                              {rule.predicate_display}
                            </span>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 pl-6">
                            <code className="text-xs bg-muted px-3 py-2 rounded block font-mono">
                              {rule.predicate}
                            </code>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {rule.target_role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rule.assignee_mode === 'specific' ? (
                            <span className="font-medium">{rule.assignee_name}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {rule.assignee_mode === 'first_available' ? 'First Available' : 'Round Robin'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.fallback_chain.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.fallback_chain.map((fallback, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {fallback}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={() => toggleActive(rule.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openTestDialog(rule.id)}
                          >
                            <FlaskConical className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openTestDialog(rule.id)}>
                                <FlaskConical className="h-4 w-4 mr-2" />
                                Test Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleActive(rule.id)}>
                                {rule.is_active ? (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {rules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No pairing rules</h3>
              <p className="page-description mt-1">
                Create a rule to auto-assign service roles
              </p>
            </div>
          )}
        </div>
        
        {/* Test Rule Dialog */}
        <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Test Rule against Sample Context</DialogTitle>
              <DialogDescription>
                Paste a sample context JSON to see if the rule matches and what assignee resolves to.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sample Context (JSON)</label>
                <Textarea
                  value={testContext}
                  onChange={(e) => setTestContext(e.target.value)}
                  className="font-mono text-sm h-48"
                  placeholder='{"scenario": {"module": "SD"}, ...}'
                />
              </div>
              
              {testResult && (
                <div className={cn(
                  'p-4 rounded-lg',
                  testResult.matches 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900' 
                    : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900'
                )}>
                  {testResult.matches ? (
                    <div>
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">Rule Matches!</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                        Resolved assignee: <span className="font-medium">{testResult.assignee}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="font-medium text-amber-700 dark:text-amber-400">Rule does not match</p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={runTest}>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
