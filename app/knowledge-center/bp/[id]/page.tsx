'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  Globe,
  Factory,
  TestTube2,
  FileText,
  ArrowRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { MOCK_BP_SCOPE_ITEMS } from '@/lib/kb-mock-data'

const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸',
  'DE': '🇩🇪',
  'IN': '🇮🇳',
  'GB': '🇬🇧',
  'CN': '🇨🇳',
}

const BP_COLORS: Record<string, string> = {
  'OTC': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'PTP': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'RTR': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'HTR': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'ATR': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const MODULE_COLORS: Record<string, string> = {
  'SD': 'bg-blue-500',
  'MM': 'bg-emerald-500',
  'FI': 'bg-violet-500',
  'CO': 'bg-amber-500',
  'PP': 'bg-rose-500',
}

// Mock linked scenarios for this scope item
const MOCK_LINKED_SCENARIOS = [
  { id: 'ts_1', name: 'Standard OTC Flow - Domestic', lastPassRate: 98.5 },
  { id: 'ts_2', name: 'OTC with Credit Check', lastPassRate: 95.0 },
  { id: 'ts_3', name: 'OTC Returns Processing', lastPassRate: 100.0 },
]

// Mock migrations that have this in scope
const MOCK_MIGRATIONS_IN_SCOPE = [
  { id: 'mig_1', name: 'Star Cement S/4 Migration', status: 'active' },
  { id: 'mig_2', name: 'Regional Consolidation', status: 'planned' },
]

export default function ScopeItemDetailPage() {
  const params = useParams()
  const itemId = params.id as string
  
  const scopeItem = MOCK_BP_SCOPE_ITEMS.find(item => item.id === itemId)

  if (!scopeItem) {
    return (
      <AppShell currentApp="knowledge-center">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="section-title mb-2">Scope item not found</h2>
            <Link href="/knowledge-center/bp">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scope Items
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="page-breadcrumb mb-4">
              <Link href="/knowledge-center/bp" className="hover:text-foreground transition-colors">
                BP KB
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/knowledge-center/bp" className="hover:text-foreground transition-colors">
                Scope Items
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{scopeItem.code}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-xl shrink-0">
                  {scopeItem.code}
                </div>
                <div>
                  <h1 className="page-title">{scopeItem.title}</h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className={cn("text-xs", BP_COLORS[scopeItem.businessProcess])}>
                      {scopeItem.businessProcess}
                    </Badge>
                    <div className={cn(
                      "w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold",
                      MODULE_COLORS[scopeItem.module] || 'bg-slate-500'
                    )}>
                      {scopeItem.module}
                    </div>
                    {scopeItem.coverageStatus === 'covered' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Covered
                      </Badge>
                    ) : scopeItem.coverageStatus === 'partial' ? (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Partial Coverage
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Circle className="h-3 w-3" />
                        Not Covered
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Test Scenario
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View on SAP BP Explorer</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <div className="px-4 md:px-6">
              <TabsList className="h-auto bg-transparent p-0 border-b-0">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="process-steps" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Process Steps
                </TabsTrigger>
                <TabsTrigger value="variants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Variants
                </TabsTrigger>
                <TabsTrigger value="coverage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Coverage
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  Linked Scenarios
                </TabsTrigger>
              </TabsList>
            </div>
        
            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="page-description">{scopeItem.description}</p>
                  </CardContent>
                </Card>

                <StaggerGrid columns="grid-cols-1 md:grid-cols-3" className="gap-4" fast>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">Business Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={cn("text-sm", BP_COLORS[scopeItem.businessProcess])}>
                        {scopeItem.businessProcess}
                      </Badge>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">SAP Module</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={cn(
                        "w-10 h-8 rounded flex items-center justify-center text-white text-sm font-bold",
                        MODULE_COLORS[scopeItem.module] || 'bg-slate-500'
                      )}>
                        {scopeItem.module}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-muted-foreground">T-Codes Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {scopeItem.tcodesCovered.map((tcode) => (
                          <Badge key={tcode} variant="outline" className="text-xs font-mono">
                            {tcode}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </StaggerGrid>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flow Narrative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="page-description">
                      This scope item covers the end-to-end {scopeItem.businessProcess} process starting from initial document creation 
                      through to completion. The process involves {scopeItem.processSteps.length} key steps utilizing transactions: {scopeItem.tcodesCovered.join(', ')}.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="process-steps" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Process Steps</CardTitle>
                    <CardDescription>Ordered list of process steps with associated transaction codes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scopeItem.processSteps.length > 0 ? (
                      <div className="space-y-4">
                        {scopeItem.processSteps.map((step, index) => (
                          <div key={step.order} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                              {step.order}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{step.name}</span>
                                {step.tcode && (
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {step.tcode}
                                  </Badge>
                                )}
                              </div>
                              {index < scopeItem.processSteps.length - 1 && (
                                <div className="ml-4 mt-2 mb-2">
                                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="page-description">No process steps defined for this scope item.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Country Variants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {scopeItem.countryVariants.map((country) => (
                        <div key={country} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                          <span className="text-lg">{COUNTRY_FLAGS[country] || ''}</span>
                          <span className="font-medium">{country}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Factory className="h-5 w-5" />
                      Industry Variants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {scopeItem.industryVariants.length > 0 ? (
                        scopeItem.industryVariants.map((industry) => (
                          <Badge key={industry} variant="secondary" className="text-sm">
                            {industry}
                          </Badge>
                        ))
                      ) : (
                        <p className="page-description">No industry-specific variants</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coverage" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Migrations with This Scope Item</CardTitle>
                    <CardDescription>List of migrations that include this scope item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_MIGRATIONS_IN_SCOPE.map((migration) => (
                        <div key={migration.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{migration.name}</p>
                            <p className="page-description capitalize">{migration.status}</p>
                          </div>
                          <Badge variant={migration.status === 'active' ? 'default' : 'secondary'}>
                            {migration.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TestTube2 className="h-5 w-5" />
                      Linked Test Scenarios
                    </CardTitle>
                    <CardDescription>Test scenarios that cover this scope item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_LINKED_SCENARIOS.map((scenario) => (
                        <div key={scenario.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <Link href={`/test-library/scenarios/${scenario.id}`} className="font-medium hover:text-primary hover:underline">
                              {scenario.name}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Last Pass Rate:</span>
                            <Badge className={cn(
                              scenario.lastPassRate >= 95 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                              scenario.lastPassRate >= 80 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}>
                              {scenario.lastPassRate}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
