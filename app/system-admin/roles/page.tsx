'use client'

import * as React from 'react'
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

import { MOCK_SERVICE_ROLES, type ActorClass } from '@/lib/config-mock-data'

const ACTOR_CLASS_CONFIG: Record<ActorClass, { icon: React.ElementType; className: string }> = {
  Human: { icon: User, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  Agent: { icon: Bot, className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' },
  Either: { icon: UserCircle, className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
}

export default function ServiceRolesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actorClassFilter, setActorClassFilter] = React.useState<string>('all')
  const [systemRoleFilter, setSystemRoleFilter] = React.useState<string>('all')
  const [selectedRole, setSelectedRole] = React.useState<typeof MOCK_SERVICE_ROLES[0] | null>(null)
  
  const filteredRoles = MOCK_SERVICE_ROLES.filter(role => {
    const matchesSearch = role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActorClass = actorClassFilter === 'all' || role.actor_class === actorClassFilter
    const matchesSystemRole = systemRoleFilter === 'all' ||
                              (systemRoleFilter === 'system' && role.is_system_role) ||
                              (systemRoleFilter === 'custom' && !role.is_system_role)
    return matchesSearch && matchesActorClass && matchesSystemRole
  })

  // Mock members for the drawer
  const mockMembers = [
    { id: 1, name: 'Pradeep Sharma', email: 'p.sharma@starcement.com', type: 'Human' },
    { id: 2, name: 'Jahnavi Rao', email: 'j.rao@starcement.com', type: 'Human' },
  ]

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Service Roles</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Named functional responsibilities filled by Persons or AI Agents. Bound to Tasks via Pairing Rules.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>New Custom Role</span>
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={actorClassFilter} onValueChange={setActorClassFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
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
                <SelectTrigger className="w-full sm:w-[150px]">
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
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Actor Class</TableHead>
                  <TableHead>Capability Scopes</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Linked Rules</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => {
                  const ActorIcon = ACTOR_CLASS_CONFIG[role.actor_class].icon
                  
                  return (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono font-medium">{role.code}</TableCell>
                      <TableCell>{role.display_name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={cn('gap-1', ACTOR_CLASS_CONFIG[role.actor_class].className)}
                        >
                          <ActorIcon className="h-3 w-3" />
                          {role.actor_class}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {role.capability_scopes.slice(0, 2).map((scope) => (
                            <Badge key={scope} variant="outline" className="text-xs font-mono">
                              {scope}
                            </Badge>
                          ))}
                          {role.capability_scopes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.capability_scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto py-1 px-2"
                          onClick={() => setSelectedRole(role)}
                        >
                          {role.member_count} members
                        </Button>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.linked_rules_count} rules
                      </TableCell>
                      <TableCell>
                        {role.is_system_role ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>System role (not editable)</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedRole(role)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Members
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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No roles found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
        
        {/* Members Drawer */}
        <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            {selectedRole && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span>{selectedRole.display_name}</span>
                    {selectedRole.is_system_role && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </SheetTitle>
                  <SheetDescription>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{selectedRole.code}</code>
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Assigned Members ({selectedRole.member_count})</h4>
                    <div className="space-y-3">
                      {mockMembers.slice(0, selectedRole.member_count).map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {member.type === 'Human' ? (
                              <User className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Bot className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="page-description">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Capability Scopes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.capability_scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="font-mono">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  )
}
