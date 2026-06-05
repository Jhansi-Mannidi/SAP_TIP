'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  Layers,
  GitBranch,
  Building2,
  Code2,
  Target,
  Edit,
  Lock,
  Info,
  ExternalLink,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { MOCK_MIGRATIONS } from '@/lib/migration-mock-data'

const migration = MOCK_MIGRATIONS[0]

const MODULE_COVERAGE = [
  { code: 'SD', name: 'Sales & Distribution', coverage: 85, testCount: 124 },
  { code: 'MM', name: 'Materials Management', coverage: 78, testCount: 98 },
  { code: 'FI', name: 'Financial Accounting', coverage: 92, testCount: 156 },
  { code: 'CO', name: 'Controlling', coverage: 88, testCount: 67 },
  { code: 'PP', name: 'Production Planning', coverage: 71, testCount: 89 },
  { code: 'WM', name: 'Warehouse Management', coverage: 65, testCount: 45 },
]

const BP_COVERAGE = [
  { code: 'OTC', name: 'Order to Cash', scopeItems: 12, coverage: 82 },
  { code: 'PTP', name: 'Procure to Pay', scopeItems: 8, coverage: 75 },
  { code: 'RTR', name: 'Record to Report', scopeItems: 6, coverage: 91 },
  { code: 'P2P', name: 'Plan to Produce', scopeItems: 5, coverage: 68 },
]

const SCOPE_ITEMS = [
  { id: 'bps_1', code: 'BD3', name: 'Sales Order Processing', coverage: 95 },
  { id: 'bps_2', code: '1FR', name: 'Accounts Receivable', coverage: 88 },
  { id: 'bps_3', code: '2OM', name: 'Purchasing', coverage: 72 },
  { id: 'bps_4', code: 'J58', name: 'Inventory Management', coverage: 81 },
  { id: 'bps_5', code: 'BNX', name: 'Financial Closing', coverage: 65 },
  { id: 'bps_6', code: '1FS', name: 'General Ledger', coverage: 90 },
  { id: 'bps_7', code: '4D1', name: 'Production Planning', coverage: 78 },
  { id: 'bps_8', code: 'BMD', name: 'Quality Management', coverage: 85 },
]

export default function ScopePage() {
  const isAfterRealization = migration.current_phase === 'Test_Prep' || 
    migration.current_phase === 'Cutover' || 
    migration.current_phase === 'Hypercare' ||
    migration.current_phase === 'Closed'

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="p-4 md:p-6">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Link href="/migration-cockpit" className="hover:text-foreground">Migrations</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href={`/migration-cockpit/${migration.id}`} className="hover:text-foreground">{migration.name}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">Scope</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Migration Scope</h1>
                <p className="page-description mt-1">
                  Modules, business processes, and organizational units in scope
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        disabled={isAfterRealization}
                      >
                        {isAfterRealization ? <Lock className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        Edit Scope
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isAfterRealization && (
                    <TooltipContent>
                      <p>Scope changes require approval after Realization phase</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 space-y-6">
          {isAfterRealization && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The migration is in {migration.current_phase.replace('_', ' ')} phase. Scope modifications require formal approval from Migration Manager and Solution Architect.
              </AlertDescription>
            </Alert>
          )}

          <StaggerGrid columns="grid-cols-1 lg:grid-cols-2" className="gap-6" fast>
            {/* Modules in Scope */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Modules in Scope</CardTitle>
                </div>
                <CardDescription>{MODULE_COVERAGE.length} SAP modules selected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {MODULE_COVERAGE.map(module => (
                    <div key={module.code} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
                      <Badge variant="outline" className="font-mono">{module.code}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {module.coverage}% coverage · {module.testCount} tests
                        </div>
                      </div>
                      <div className={cn(
                        'h-2 w-2 rounded-full ml-2',
                        module.coverage >= 80 ? 'bg-emerald-500' : module.coverage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      )} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Processes in Scope */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Business Processes in Scope</CardTitle>
                </div>
                <CardDescription>{BP_COVERAGE.length} business process areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {BP_COVERAGE.map(bp => (
                    <div key={bp.code} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
                      <Badge variant="secondary" className="font-mono">{bp.code}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">{bp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {bp.scopeItems} scope items · {bp.coverage}% coverage
                        </div>
                      </div>
                      <div className={cn(
                        'h-2 w-2 rounded-full ml-2',
                        bp.coverage >= 80 ? 'bg-emerald-500' : bp.coverage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      )} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Organizational Units */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Organizational Units in Scope</CardTitle>
                </div>
                <CardDescription>{migration.scope.org_units.length} organizational units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {migration.scope.org_units.map(unit => (
                    <div key={unit.code} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded">{unit.code}</code>
                        <span className="font-medium text-sm">{unit.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{unit.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Z-Objects */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Custom Z-Objects in Scope</CardTitle>
                </div>
                <CardDescription>{migration.scope.zobject_count} custom objects identified</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <StaggerGrid columns="grid-cols-2" className="gap-4 text-center" fast>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-3xl font-bold">{migration.scope.zobject_count}</div>
                      <div className="text-sm text-muted-foreground">Total Z-Objects</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-3xl font-bold">18</div>
                      <div className="text-sm text-muted-foreground">Require Analysis</div>
                    </div>
                  </StaggerGrid>
                  <Link href="/knowledge-center/org">
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Z-Objects Inventory
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </StaggerGrid>

          {/* BP Scope Items Coverage Matrix */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">BP Scope Items Coverage</CardTitle>
              </div>
              <CardDescription>Test coverage for each business process scope item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SCOPE_ITEMS.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-32 flex items-center gap-2">
                      <code className="text-xs font-mono text-muted-foreground">{item.code}</code>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className={cn(
                          'text-sm font-medium',
                          item.coverage >= 80 ? 'text-emerald-600' : item.coverage >= 60 ? 'text-amber-600' : 'text-red-600'
                        )}>
                          {item.coverage}%
                        </span>
                      </div>
                      <Progress 
                        value={item.coverage} 
                        className={cn(
                          'h-2',
                          item.coverage >= 80 ? '[&>div]:bg-emerald-500' : 
                          item.coverage >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
