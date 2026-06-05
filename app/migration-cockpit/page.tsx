'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Rocket, 
  Plus, 
  Clock,
  LayoutGrid,
  List,
  Search,
  Bug,
  Activity,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { StaggerGrid, StaggerItem } from '@/components/design-system'

import { MOCK_MIGRATIONS, type Migration, type MigrationKind } from '@/lib/migration-mock-data'

const KIND_COLORS: Record<MigrationKind, string> = {
  Brownfield: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Greenfield: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Bluefield: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Upgrade: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  Rollout: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
}

function getCutoverColor(days: number): string {
  if (days < 0) return 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30'
  if (days < 14) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
  if (days <= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
  return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30'
}

function MigrationCard({ migration }: { migration: Migration }) {
  const cutoverColor = getCutoverColor(migration.days_to_cutover)
  
  return (
    <Link href={`/migration-cockpit/${migration.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 min-w-0">
              <code className="text-xs font-mono text-muted-foreground">{migration.code}</code>
              <CardTitle className="text-base leading-tight">{migration.name}</CardTitle>
            </div>
            <Badge variant="outline" className="shrink-0">{migration.current_phase.replace('_', ' ')}</Badge>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Badge className={cn('text-xs', KIND_COLORS[migration.kind])}>{migration.kind}</Badge>
            <Badge className={cn('text-xs font-medium', cutoverColor)}>
              <Clock className="h-3 w-3 mr-1" />
              {migration.days_to_cutover < 0 
                ? `${Math.abs(migration.days_to_cutover)}d overdue`
                : `${migration.days_to_cutover}d to cutover`
              }
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Mini Scorecard */}
          <StaggerGrid columns="grid-cols-5" className="gap-2 text-center" fast>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{migration.scorecard.bp_coverage_pct}%</div>
              <div className="text-[10px] text-muted-foreground leading-tight">BP Coverage</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{migration.scorecard.si_closed_pct}%</div>
              <div className="text-[10px] text-muted-foreground leading-tight">SI Closed</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{migration.scorecard.abap_closed_pct}%</div>
              <div className="text-[10px] text-muted-foreground leading-tight">ABAP Closed</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{migration.scorecard.regression_pass_rate}%</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Pass Rate</div>
            </div>
            <div className="space-y-1">
              <div className={cn('text-lg font-semibold', migration.scorecard.open_critical_defects > 0 && 'text-red-600 dark:text-red-400')}>
                {migration.scorecard.open_critical_defects}
              </div>
              <div className="text-[10px] text-muted-foreground leading-tight">Critical</div>
            </div>
          </StaggerGrid>
          
          {/* Team */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10">{migration.team.migration_manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <div className="font-medium truncate max-w-[100px]">{migration.team.migration_manager.name}</div>
                <div className="text-muted-foreground">Manager</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-blue-100 dark:bg-blue-900/30">{migration.team.cio.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <div className="font-medium truncate max-w-[80px]">{migration.team.cio.name}</div>
                <div className="text-muted-foreground">CIO</div>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">{migration.team.sponsoring_si}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MigrationsListPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [kindFilter, setKindFilter] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid')
  
  const filteredMigrations = MOCK_MIGRATIONS.filter(m => {
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !m.code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (stateFilter !== 'all' && m.state !== stateFilter) return false
    if (kindFilter !== 'all' && m.kind !== kindFilter) return false
    return true
  })

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Migrations</h1>
                <p className="page-description mt-1">
                  All ECC→S/4HANA migrations, upgrades, and rollouts you have access to.
                </p>
              </div>
              <Link href="/migration-cockpit/new">
                <Button className="gap-2 shrink-0">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Migration</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <StaggerItem>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Rocket className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="stat-value">{MOCK_MIGRATIONS.length}</div>
                    <div className="text-xs text-muted-foreground">Total Migrations</div>
                  </div>
                </div>
              </Card>
              </StaggerItem>
              <StaggerItem>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="stat-value">{MOCK_MIGRATIONS.filter(m => m.state === 'Active').length}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                </div>
              </Card>
              </StaggerItem>
              <StaggerItem>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="stat-value">{MOCK_MIGRATIONS.filter(m => m.days_to_cutover <= 30 && m.days_to_cutover > 0).length}</div>
                    <div className="text-xs text-muted-foreground">Cutover Soon</div>
                  </div>
                </div>
              </Card>
              </StaggerItem>
              <StaggerItem>
              <Card>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Bug className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="stat-value">{MOCK_MIGRATIONS.reduce((acc, m) => acc + m.scorecard.open_critical_defects, 0)}</div>
                    <div className="text-xs text-muted-foreground">Critical Defects</div>
                  </div>
                </div>
              </Card>
              </StaggerItem>
            </StaggerGrid>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search migrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On_Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Kind" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Kinds</SelectItem>
                  <SelectItem value="Brownfield">Brownfield</SelectItem>
                  <SelectItem value="Greenfield">Greenfield</SelectItem>
                  <SelectItem value="Bluefield">Bluefield</SelectItem>
                  <SelectItem value="Upgrade">Upgrade</SelectItem>
                  <SelectItem value="Rollout">Rollout</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {viewMode === 'grid' ? (
            <StaggerGrid columns="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredMigrations.map(migration => (
                <StaggerItem key={migration.id}>
                  <MigrationCard migration={migration} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Migration</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Cutover</TableHead>
                    <TableHead className="text-center">BP %</TableHead>
                    <TableHead className="text-center">SI %</TableHead>
                    <TableHead className="text-center">Pass Rate</TableHead>
                    <TableHead className="text-center">Critical</TableHead>
                    <TableHead>SI Partner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMigrations.map(migration => (
                    <TableRow key={migration.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/migration-cockpit/${migration.id}`} className="block">
                          <code className="text-xs text-muted-foreground">{migration.code}</code>
                          <div className="font-medium">{migration.name}</div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', KIND_COLORS[migration.kind])}>{migration.kind}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{migration.current_phase.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', getCutoverColor(migration.days_to_cutover))}>
                          {migration.days_to_cutover}d
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{migration.scorecard.bp_coverage_pct}%</TableCell>
                      <TableCell className="text-center font-medium">{migration.scorecard.si_closed_pct}%</TableCell>
                      <TableCell className="text-center font-medium">{migration.scorecard.regression_pass_rate}%</TableCell>
                      <TableCell className={cn('text-center font-medium', migration.scorecard.open_critical_defects > 0 && 'text-red-600')}>
                        {migration.scorecard.open_critical_defects}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{migration.team.sponsoring_si}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
          
          {filteredMigrations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Rocket className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No migrations found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
