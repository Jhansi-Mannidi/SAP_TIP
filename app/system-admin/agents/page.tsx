'use client'

import * as React from 'react'
import { 
  Bot,
  Search,
  MoreHorizontal,
  Settings,
  Activity,
  Power,
  Copy,
  Eye,
  CheckCircle2,
  XCircle,
  Wrench,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { MOCK_AI_AGENTS, type AgentKind, type AgentStatus } from '@/lib/config-mock-data'

const AGENT_KIND_COLORS: Record<AgentKind, string> = {
  'Classification': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Impact Analysis': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  'Test Generation': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Test Execution': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Test Data': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Healing': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  'Defect Triage': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Reporting': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Audit Pack Composer': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  'KB Curation': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
}

const STATUS_CONFIG: Record<AgentStatus, { icon: React.ElementType; className: string }> = {
  'Active': { icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400' },
  'Disabled': { icon: XCircle, className: 'text-muted-foreground' },
  'Maintenance': { icon: Wrench, className: 'text-amber-600 dark:text-amber-400' },
}

export default function AIAgentsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedAgent, setSelectedAgent] = React.useState<typeof MOCK_AI_AGENTS[0] | null>(null)
  
  const filteredAgents = MOCK_AI_AGENTS.filter(agent => 
    agent.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.agent_kind.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mock thresholds for drawer
  const mockThresholds = [
    { task_type: 'defect_classification', threshold: 0.85 },
    { task_type: 'failure_classification', threshold: 0.80 },
    { task_type: 'severity_prediction', threshold: 0.90 },
  ]

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">AI Agents</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Voltus AI Agents with capability scopes and Service Role bindings. Each agent has a verifiable identity (DID) for audit.
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Agent Kind</TableHead>
                  <TableHead>DID</TableHead>
                  <TableHead>Capability Scopes</TableHead>
                  <TableHead>Assignable Roles</TableHead>
                  <TableHead>Thresholds</TableHead>
                  <TableHead>Recent (24h)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => {
                  const StatusIcon = STATUS_CONFIG[agent.status].icon
                  
                  return (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 font-medium">
                              <Bot className="h-4 w-4 text-muted-foreground" />
                              {agent.display_name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Voltus AI Agent</p>
                              <p className="caption-text">
                                Capabilities: {agent.capability_scopes.join(', ')}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('font-normal', AGENT_KIND_COLORS[agent.agent_kind])}>
                          {agent.agent_kind}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate max-w-[120px]">
                            {agent.did}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => navigator.clipboard.writeText(agent.did)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {agent.capability_scopes.slice(0, 2).map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs font-mono">
                              {scope}
                            </Badge>
                          ))}
                          {agent.capability_scopes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.capability_scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agent.assignable_roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs font-mono">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto py-1 px-2"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          {agent.threshold_count} configured
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="font-medium">{agent.recent_tasks_24h}</span>
                        <span className="text-muted-foreground"> tasks</span>
                      </TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-1.5', STATUS_CONFIG[agent.status].className)}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm">{agent.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAgent(agent)}>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure Thresholds
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="h-4 w-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-amber-600">
                              <Power className="h-4 w-4 mr-2" />
                              {agent.status === 'Active' ? 'Disable' : 'Enable'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No agents found</h3>
              <p className="page-description mt-1">
                Try adjusting your search
              </p>
            </div>
          )}
        </div>
        
        {/* Thresholds Drawer */}
        <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            {selectedAgent && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {selectedAgent.display_name}
                  </SheetTitle>
                  <SheetDescription>
                    <Badge className={cn('font-normal', AGENT_KIND_COLORS[selectedAgent.agent_kind])}>
                      {selectedAgent.agent_kind}
                    </Badge>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Confidence Thresholds</h4>
                    <div className="space-y-3">
                      {mockThresholds.map((threshold) => (
                        <div key={threshold.task_type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-mono text-sm">{threshold.task_type}</p>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {(threshold.threshold * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Capability Scopes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capability_scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="font-mono">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">DID (Verifiable Identity)</h4>
                    <code className="text-xs bg-muted px-3 py-2 rounded block font-mono break-all">
                      {selectedAgent.did}
                    </code>
                  </div>
                  
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Thresholds
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  )
}
