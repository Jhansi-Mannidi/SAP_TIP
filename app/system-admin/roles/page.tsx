'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Lock,
  Eye,
  Settings,
  Bot,
  User,
  UserCircle,
  ChevronRight,
  GitBranch,
  Shield,
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
import { ServiceRoleDetailSheet } from '@/components/system-admin/service-role-detail-sheet'
import { MOCK_SERVICE_ROLES, type ActorClass } from '@/lib/config-mock-data'

const ACTOR_CLASS_CONFIG: Record<ActorClass, { icon: React.ElementType; className: string }> = {
  Human: {
    icon: User,
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
  },
  Agent: {
    icon: Bot,
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
  },
  Either: {
    icon: UserCircle,
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  },
}

export default function ServiceRolesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actorClassFilter, setActorClassFilter] = React.useState<string>('all')
  const [systemRoleFilter, setSystemRoleFilter] = React.useState<string>('all')
  const [selectedRole, setSelectedRole] = React.useState<(typeof MOCK_SERVICE_ROLES)[0] | null>(
    null,
  )

  const humanCount = MOCK_SERVICE_ROLES.filter((r) => r.actor_class === 'Human').length
  const agentCount = MOCK_SERVICE_ROLES.filter((r) => r.actor_class === 'Agent').length
  const customCount = MOCK_SERVICE_ROLES.filter((r) => !r.is_system_role).length

  const filteredRoles = MOCK_SERVICE_ROLES.filter((role) => {
    const matchesSearch =
      role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActorClass = actorClassFilter === 'all' || role.actor_class === actorClassFilter
    const matchesSystemRole =
      systemRoleFilter === 'all' ||
      (systemRoleFilter === 'system' && role.is_system_role) ||
      (systemRoleFilter === 'custom' && !role.is_system_role)
    return matchesSearch && matchesActorClass && matchesSystemRole
  })

  const hasActiveFilters =
    searchQuery.length > 0 || actorClassFilter !== 'all' || systemRoleFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setActorClassFilter('all')
    setSystemRoleFilter('all')
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Service Roles</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Named functional responsibilities filled by persons or AI agents. Bound to tasks
                  via pairing rules.
                </p>
              </div>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/system-admin/roles/new">
                  <Plus className="h-4 w-4" />
                  <span>New Custom Role</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <KpiStatCard label="Total Roles" value={MOCK_SERVICE_ROLES.length} icon={Users} tone="brand" />
              <KpiStatCard label="Human Roles" value={humanCount} icon={User} tone="info" />
              <KpiStatCard label="Agent Roles" value={agentCount} icon={Bot} tone="neutral" />
              <KpiStatCard label="Custom Roles" value={customCount} icon={Shield} tone="success" />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <Select value={actorClassFilter} onValueChange={setActorClassFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9">
                  <SelectValue placeholder="Actor Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Either">Either</SelectItem>
                </SelectContent>
              </Select>

              <Select value={systemRoleFilter} onValueChange={setSystemRoleFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9">
                  <SelectValue placeholder="Role Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="system">System Roles</SelectItem>
                  <SelectItem value="custom">Custom Roles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Showing{' '}
              <span className="font-medium text-foreground tabular-nums">{filteredRoles.length}</span>{' '}
              of{' '}
              <span className="font-medium text-foreground tabular-nums">
                {MOCK_SERVICE_ROLES.length}
              </span>{' '}
              roles
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
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
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Actor Class</TableHead>
                  <TableHead className="hidden md:table-cell">Capability Scopes</TableHead>
                  <TableHead className="hidden lg:table-cell">Members</TableHead>
                  <TableHead className="hidden lg:table-cell">Rules</TableHead>
                  <TableHead className="hidden md:table-cell w-[70px]">Type</TableHead>
                  <TableHead className="w-[52px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => {
                  const ActorIcon = ACTOR_CLASS_CONFIG[role.actor_class].icon
                  const isSelected = selectedRole?.id === role.id

                  return (
                    <TableRow
                      key={role.id}
                      className={cn(
                        'cursor-pointer group transition-colors',
                        isSelected && 'bg-brand/[0.06] hover:bg-brand/[0.08]',
                      )}
                      onClick={() => setSelectedRole(role)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                              role.actor_class === 'Human' && 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
                              role.actor_class === 'Agent' && 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
                              role.actor_class === 'Either' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                            )}
                          >
                            <ActorIcon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm truncate">{role.display_name}</p>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:block shrink-0" />
                            </div>
                            <code className="text-[11px] text-muted-foreground font-mono truncate block">
                              {role.code}
                            </code>
                            <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'h-5 gap-0.5 text-[9px] border',
                                  ACTOR_CLASS_CONFIG[role.actor_class].className,
                                )}
                              >
                                <ActorIcon className="h-2.5 w-2.5" />
                                {role.actor_class}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-6 gap-1 text-[10px] border',
                            ACTOR_CLASS_CONFIG[role.actor_class].className,
                          )}
                        >
                          <ActorIcon className="h-3 w-3" />
                          {role.actor_class}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell max-w-[220px]">
                        <div className="flex flex-wrap gap-1">
                          {role.capability_scopes.slice(0, 2).map((scope) => (
                            <Badge
                              key={scope}
                              variant="outline"
                              className="text-[10px] font-mono h-5 bg-muted/30"
                            >
                              {scope}
                            </Badge>
                          ))}
                          {role.capability_scopes.length > 2 && (
                            <Badge variant="secondary" className="text-[10px] h-5 tabular-nums">
                              +{role.capability_scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {role.member_count}
                        </span>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
                          <GitBranch className="h-3.5 w-3.5 opacity-60" />
                          {role.linked_rules_count}
                        </span>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {role.is_system_role ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>System role (not editable)</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Badge variant="outline" className="h-5 text-[9px] border-brand/30 text-brand">
                            Custom
                          </Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => setSelectedRole(role)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {!role.is_system_role && (
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredRoles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-lg">No roles found</h3>
              <p className="page-description mt-1 max-w-sm">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Create a custom role to extend platform responsibilities.'}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button size="sm" className="mt-4 gap-2" asChild>
                  <Link href="/system-admin/roles/new">
                    <Plus className="h-4 w-4" />
                    New Custom Role
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <ServiceRoleDetailSheet
          role={selectedRole}
          open={!!selectedRole}
          onOpenChange={(open) => !open && setSelectedRole(null)}
        />
      </div>
    </AppShell>
  )
}
