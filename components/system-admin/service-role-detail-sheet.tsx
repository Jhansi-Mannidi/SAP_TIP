'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Bot,
  GitBranch,
  Lock,
  Settings,
  Shield,
  User,
  UserCircle,
  UserPlus,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  MOCK_AI_AGENTS,
  MOCK_PAIRING_RULES,
  type ActorClass,
  type ServiceRole,
} from '@/lib/config-mock-data'

const ACTOR_CLASS_CONFIG: Record<
  ActorClass,
  { icon: React.ElementType; badge: string; header: string }
> = {
  Human: {
    icon: User,
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
    header: 'bg-blue-500',
  },
  Agent: {
    icon: Bot,
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
    header: 'bg-violet-500',
  },
  Either: {
    icon: UserCircle,
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    header: 'bg-emerald-500',
  },
}

const HUMAN_MEMBERS = [
  { id: 'm1', name: 'Pradeep Sharma', email: 'p.sharma@starcement.com', initials: 'PS' },
  { id: 'm2', name: 'Jahnavi Rao', email: 'j.rao@starcement.com', initials: 'JR' },
  { id: 'm3', name: 'Karthik Iyer', email: 'k.iyer@starcement.com', initials: 'KI' },
  { id: 'm4', name: 'Rajiv Menon', email: 'r.menon@starcement.com', initials: 'RM' },
  { id: 'm5', name: 'Anita Desai', email: 'a.desai@starcement.com', initials: 'AD' },
  { id: 'm6', name: 'Suresh Patel', email: 's.patel@starcement.com', initials: 'SP' },
  { id: 'm7', name: 'Meera Nair', email: 'm.nair@starcement.com', initials: 'MN' },
  { id: 'm8', name: 'Vikram Singh', email: 'v.singh@starcement.com', initials: 'VS' },
]

function groupScopes(scopes: string[]): Record<string, string[]> {
  return scopes.reduce<Record<string, string[]>>((groups, scope) => {
    const [domain] = scope.split('.')
    if (!groups[domain]) groups[domain] = []
    groups[domain].push(scope)
    return groups
  }, {})
}

export function ServiceRoleDetailSheet({
  role,
  open,
  onOpenChange,
}: {
  role: ServiceRole | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!role) return null

  const actorConfig = ACTOR_CLASS_CONFIG[role.actor_class]
  const ActorIcon = actorConfig.icon
  const linkedRules = MOCK_PAIRING_RULES.filter((r) => r.target_role === role.code)
  const linkedAgents = MOCK_AI_AGENTS.filter((a) => a.assignable_roles.includes(role.code))
  const scopeGroups = groupScopes(role.capability_scopes)

  const members =
    role.actor_class === 'Agent'
      ? linkedAgents.map((agent) => ({
          id: agent.id,
          name: agent.display_name,
          subtitle: agent.did.slice(0, 28) + '…',
          initials: 'AI',
          isAgent: true,
        }))
      : HUMAN_MEMBERS.slice(0, Math.max(role.member_count, 1)).map((m) => ({
          id: m.id,
          name: m.name,
          subtitle: m.email,
          initials: m.initials,
          isAgent: false,
        }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Service Role Details</SheetTitle>
          <SheetDescription>View role members, scopes, and pairing rules</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col min-h-0">
          <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.08] via-background to-background px-5 sm:px-6 pt-5 pb-4">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
                  actorConfig.header,
                )}
              >
                <ActorIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-base leading-tight">{role.display_name}</h3>
                  {role.is_system_role && (
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
                <code className="text-xs text-muted-foreground font-mono mt-1 block">
                  {role.code}
                </code>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <Badge
                    variant="outline"
                    className={cn('h-6 gap-1 text-[10px] border', actorConfig.badge)}
                  >
                    <ActorIcon className="h-3 w-3" />
                    {role.actor_class}
                  </Badge>
                  <Badge variant="secondary" className="h-6 text-[10px]">
                    {role.is_system_role ? 'System Role' : 'Custom Role'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Members', value: role.member_count },
                { label: 'Rules', value: role.linked_rules_count },
                { label: 'Scopes', value: role.capability_scopes.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-center"
                >
                  <p className="text-lg font-semibold tabular-nums leading-none">{stat.value}</p>
                  <p className="caption-text mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-brand" />
                Assigned Members
                <Badge variant="secondary" className="h-4 text-[9px] ml-auto tabular-nums">
                  {role.member_count}
                </Badge>
              </h4>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]"
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                        member.isAgent
                          ? 'bg-violet-500/15 text-violet-700 dark:text-violet-400'
                          : 'bg-brand/15 text-brand',
                      )}
                    >
                      {member.isAgent ? <Bot className="h-4 w-4" /> : member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="caption-text truncate font-mono">{member.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Capability Scopes
              </h4>
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                {Object.entries(scopeGroups).map(([domain, scopes]) => (
                  <div key={domain}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      {domain}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="font-mono text-[10px] h-6 bg-background"
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                Linked Pairing Rules
                <Badge variant="secondary" className="h-4 text-[9px] ml-auto tabular-nums">
                  {linkedRules.length}
                </Badge>
              </h4>
              {linkedRules.length > 0 ? (
                <div className="space-y-2">
                  {linkedRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded-lg border border-border bg-card px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          Priority {rule.priority}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-5 text-[9px]',
                            rule.is_active
                              ? 'border-emerald-500/35 text-emerald-700 dark:text-emerald-400'
                              : 'text-muted-foreground',
                          )}
                        >
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm leading-snug">{rule.predicate_display}</p>
                      <p className="caption-text mt-1 capitalize">
                        {rule.assignee_mode.replace('_', ' ')}
                        {rule.assignee_name ? ` · ${rule.assignee_name}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center">
                  <GitBranch className="h-5 w-5 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No pairing rules target this role yet.
                  </p>
                  <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" asChild>
                    <Link href="/system-admin/pairing">Configure pairing rules</Link>
                  </Button>
                </div>
              )}
            </section>

            {role.is_system_role && (
              <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 flex items-start gap-3">
                <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  System roles are platform-defined and cannot be edited. Members and pairing rules
                  can still be managed.
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border bg-muted/20 px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 gap-2" asChild>
              <Link href="/system-admin/pairing">
                <GitBranch className="h-4 w-4" />
                Pairing Rules
              </Link>
            </Button>
            {!role.is_system_role ? (
              <Button className="flex-1 gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                <Settings className="h-4 w-4" />
                Edit Role
              </Button>
            ) : (
              <Button className="flex-1 gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                <UserPlus className="h-4 w-4" />
                Manage Members
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
