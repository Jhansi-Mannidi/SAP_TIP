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
  ChevronRight,
  Sparkles,
  Gauge,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { KpiStatCard } from '@/components/design-system'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  AiAgentDetailSheet,
  AGENT_KIND_COLORS,
  STATUS_STYLES,
} from '@/components/system-admin/ai-agent-detail-sheet'
import { MOCK_AI_AGENTS, type AgentKind, type AgentStatus } from '@/lib/config-mock-data'

const STATUS_CONFIG: Record<AgentStatus, { icon: React.ElementType }> = {
  Active: { icon: CheckCircle2 },
  Disabled: { icon: XCircle },
  Maintenance: { icon: Wrench },
}

export default function AIAgentsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [kindFilter, setKindFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [selectedAgent, setSelectedAgent] = React.useState<(typeof MOCK_AI_AGENTS)[0] | null>(null)

  const activeCount = MOCK_AI_AGENTS.filter((a) => a.status === 'Active').length
  const totalTasks24h = MOCK_AI_AGENTS.reduce((sum, a) => sum + a.recent_tasks_24h, 0)
  const kindCount = new Set(MOCK_AI_AGENTS.map((a) => a.agent_kind)).size

  const filteredAgents = MOCK_AI_AGENTS.filter((agent) => {
    const matchesSearch =
      agent.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.agent_kind.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKind = kindFilter === 'all' || agent.agent_kind === kindFilter
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    return matchesSearch && matchesKind && matchesStatus
  })

  const hasActiveFilters =
    searchQuery.length > 0 || kindFilter !== 'all' || statusFilter !== 'all'

  const agentKinds = [...new Set(MOCK_AI_AGENTS.map((a) => a.agent_kind))] as AgentKind[]

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">AI Agents</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Voltus AI agents with capability scopes and service role bindings. Each agent has
                  a verifiable identity (DID) for audit.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <KpiStatCard label="Total Agents" value={MOCK_AI_AGENTS.length} icon={Bot} tone="brand" />
              <KpiStatCard label="Active" value={activeCount} icon={Sparkles} tone="success" />
              <KpiStatCard label="Tasks (24h)" value={totalTasks24h} icon={Activity} tone="info" />
              <KpiStatCard label="Agent Kinds" value={kindCount} icon={Gauge} tone="neutral" />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="Agent Kind" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Kinds</SelectItem>
                  {agentKinds.map((kind) => (
                    <SelectItem key={kind} value={kind}>
                      {kind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 md:px-6 py-4 md:py-6 space-y-3">
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.05] px-4 py-3 flex items-start gap-3">
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Agents are assigned via service roles and pairing rules. Thresholds control
              auto-promotion confidence for AI-driven decisions.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Showing{' '}
              <span className="font-medium text-foreground tabular-nums">{filteredAgents.length}</span>{' '}
              of{' '}
              <span className="font-medium text-foreground tabular-nums">
                {MOCK_AI_AGENTS.length}
              </span>{' '}
              agents
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setKindFilter('all')
                  setStatusFilter('all')
                }}
                className="text-xs text-brand hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Agent</TableHead>
                  <TableHead className="hidden sm:table-cell">Kind</TableHead>
                  <TableHead className="hidden lg:table-cell">DID</TableHead>
                  <TableHead className="hidden md:table-cell">Scopes</TableHead>
                  <TableHead className="hidden lg:table-cell">Tasks (24h)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[52px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => {
                  const StatusIcon = STATUS_CONFIG[agent.status].icon
                  const isSelected = selectedAgent?.id === agent.id

                  return (
                    <TableRow
                      key={agent.id}
                      className={cn(
                        'cursor-pointer group transition-colors',
                        isSelected && 'bg-brand/[0.06] hover:bg-brand/[0.08]',
                      )}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm truncate">{agent.display_name}</p>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:block shrink-0" />
                            </div>
                            <p className="caption-text sm:hidden">{agent.agent_kind}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn('h-6 text-[10px] border', AGENT_KIND_COLORS[agent.agent_kind])}
                        >
                          {agent.agent_kind}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell max-w-[160px]">
                        <div className="flex items-center gap-1">
                          <code className="text-[10px] bg-muted/50 px-2 py-1 rounded font-mono truncate">
                            {agent.did}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 opacity-60 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(agent.did)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {agent.capability_scopes.slice(0, 2).map((scope) => (
                            <Badge
                              key={scope}
                              variant="outline"
                              className="text-[10px] font-mono h-5 bg-muted/30"
                            >
                              {scope}
                            </Badge>
                          ))}
                          {agent.capability_scopes.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] h-5 tabular-nums">
                              +{agent.capability_scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm font-medium tabular-nums">{agent.recent_tasks_24h}</span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-6 gap-1 text-[10px] border',
                            STATUS_STYLES[agent.status],
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {agent.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-60 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAgent(agent)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure Thresholds
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="h-4 w-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
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
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
              <Bot className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-lg">No agents found</h3>
              <p className="page-description mt-1">Try adjusting your search or filters.</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('')
                    setKindFilter('all')
                    setStatusFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        <AiAgentDetailSheet
          agent={selectedAgent}
          open={!!selectedAgent}
          onOpenChange={(open) => !open && setSelectedAgent(null)}
        />
      </div>
    </AppShell>
  )
}
