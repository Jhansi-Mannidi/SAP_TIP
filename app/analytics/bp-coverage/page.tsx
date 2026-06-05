'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { 
  Target, 
  CheckCircle,
  Sparkles,
  XCircle,
  AlertTriangle,
  Zap,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_BP_COVERAGE_KPIS, MOCK_BP_COVERAGE_ITEMS, type BPCoverageItem } from '@/lib/reports-mock-data'

function getStatusColor(status: string): string {
  switch (status) {
    case 'passing': return 'bg-emerald-500'
    case 'healing': return 'bg-amber-500'
    case 'failing': return 'bg-red-500'
    case 'uncovered': return 'bg-slate-400'
    default: return 'bg-muted'
  }
}

function getStatusBgColor(status: string): string {
  switch (status) {
    case 'passing': return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30'
    case 'healing': return 'bg-amber-500/20 text-amber-700 border-amber-500/30'
    case 'failing': return 'bg-red-500/20 text-red-700 border-red-500/30'
    case 'uncovered': return 'bg-slate-500/20 text-slate-700 border-slate-500/30'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function BPCoveragePage() {
  const [migrationScope, setMigrationScope] = React.useState('star-cement')
  const [countryVariant, setCountryVariant] = React.useState('all')
  const [selectedItem, setSelectedItem] = React.useState<BPCoverageItem | null>(null)

  const kpis = MOCK_BP_COVERAGE_KPIS
  const items = MOCK_BP_COVERAGE_ITEMS

  // Group items by module
  const groupedByModule = items.reduce((acc, item) => {
    if (!acc[item.module]) acc[item.module] = []
    acc[item.module].push(item)
    return acc
  }, {} as Record<string, BPCoverageItem[]>)

  const uncoveredItems = items.filter(i => i.status === 'uncovered')

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Best Practice Compliance Coverage" description="SAP Best Practice Scope Items in scope and your test coverage of each." />

        {/* KPI Strip */}
        <StaggerGrid columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6" className="gap-4" fast>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="stat-value">{kpis.scopeItemsInScope}</p>
                  <p className="caption-text">In Scope</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.coveredPassing}</p>
                  <p className="caption-text">Passing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.coveredHealing}</p>
                  <p className="caption-text">Healing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.coveredFailing}</p>
                  <p className="caption-text">Failing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-500/10">
                  <AlertTriangle className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.notCovered}</p>
                  <p className="caption-text">Uncovered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${kpis.overallCoverage * 1.26} 126`}
                      className="text-emerald-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {kpis.overallCoverage}%
                  </span>
                </div>
                <div>
                  <p className="caption-text">Overall Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Migration:</span>
            <Select value={migrationScope} onValueChange={setMigrationScope}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star-cement">Star Cement S/4HANA</SelectItem>
                <SelectItem value="vertex">Vertex Industries</SelectItem>
                <SelectItem value="northwind">Northwind Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Country:</span>
            <Select value={countryVariant} onValueChange={setCountryVariant}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* BP Coverage Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Coverage Matrix</CardTitle>
            <CardDescription>BP Scope Items grouped by module. Click any cell for details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedByModule).map(([module, moduleItems]) => (
                <div key={module}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="font-semibold">{module}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {moduleItems.filter(i => i.status !== 'uncovered').length}/{moduleItems.length} covered
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={cn(
                          'px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                          'hover:ring-2 hover:ring-primary/50',
                          getStatusBgColor(item.status)
                        )}
                      >
                        <span className="font-mono">{item.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Covered + Passing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-xs text-muted-foreground">Covered + Healing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-xs text-muted-foreground">Covered + Failing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-400" />
                <span className="text-xs text-muted-foreground">Uncovered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Uncovered Items */}
        <Card>
          <CardHeader>
            <CardTitle>Top Uncovered BP Scope Items</CardTitle>
            <CardDescription>Ranked by frequency-of-use - high priority for coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uncoveredItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-slate-500/10">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-500/30 flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{item.code}</span>
                        <Badge variant="outline">{item.module}</Badge>
                      </div>
                      <p className="page-description">{item.name}</p>
                    </div>
                  </div>
                  <Button variant="default" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Scenario
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Item Detail Sheet */}
        <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>
                <span className="font-mono">{selectedItem?.code}</span> - {selectedItem?.name}
              </SheetTitle>
              <SheetDescription>
                {selectedItem?.module} Module
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusBgColor(selectedItem?.status || '')}>
                  {selectedItem?.status}
                </Badge>
              </div>
              
              {selectedItem?.status !== 'uncovered' ? (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <span className="text-sm text-muted-foreground">Last Pass Rate</span>
                    <span className="text-lg font-semibold">{selectedItem?.lastPassRate}%</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Linked Test Scenarios ({selectedItem?.linkedScenarios})</p>
                    {[1, 2, 3].slice(0, selectedItem?.linkedScenarios || 0).map(i => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="text-sm font-medium">Scenario {i} - {selectedItem?.name}</p>
                          <p className="caption-text">Last run: 2h ago</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-lg border border-dashed bg-muted/30 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="page-description mb-4">No test scenarios linked to this BP Scope Item</p>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Test Scenario
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
    </AppShell>
  )
}
