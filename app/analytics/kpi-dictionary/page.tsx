'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { 
  BookOpen,
  Search,
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Sparkles,
  Download,
} from 'lucide-react'

// Mock KPI definitions
const MOCK_KPIS = [
  {
    category: 'Test Execution',
    icon: Activity,
    kpis: [
      { name: 'Pass Rate', formula: '(Passed Cases / Total Cases) × 100', description: 'Percentage of test cases that passed during execution', target: '≥ 95%', frequency: 'Per Run' },
      { name: 'Execution Duration', formula: 'End Time - Start Time', description: 'Total time taken to complete a test run', target: 'Within SLA', frequency: 'Per Run' },
      { name: 'Cases per Hour', formula: 'Total Cases / Execution Hours', description: 'Throughput measure of test execution speed', target: '≥ 50', frequency: 'Per Run' },
      { name: 'Failure Rate', formula: '(Failed Cases / Total Cases) × 100', description: 'Percentage of test cases that failed', target: '< 5%', frequency: 'Per Run' },
    ]
  },
  {
    category: 'Test Coverage',
    icon: Target,
    kpis: [
      { name: 'Process Coverage', formula: '(Covered Processes / Total Processes) × 100', description: 'Percentage of business processes with test coverage', target: '≥ 90%', frequency: 'Weekly' },
      { name: 'Transaction Coverage', formula: '(Covered TCodes / Total TCodes) × 100', description: 'Percentage of SAP transactions with test coverage', target: '≥ 85%', frequency: 'Weekly' },
      { name: 'Scope Item Coverage', formula: '(Tested SIs / In-Scope SIs) × 100', description: 'Percentage of scope items validated by tests', target: '100%', frequency: 'Per Phase' },
    ]
  },
  {
    category: 'Defect Management',
    icon: AlertTriangle,
    kpis: [
      { name: 'Defect Density', formula: 'Total Defects / Test Cases Executed', description: 'Average number of defects per test case', target: '< 0.1', frequency: 'Weekly' },
      { name: 'Defect Resolution Time', formula: 'Avg(Resolved Date - Created Date)', description: 'Average time to resolve defects', target: '< 48 hours', frequency: 'Weekly' },
      { name: 'Defect Aging', formula: 'Days Since Created (Open Defects)', description: 'Age distribution of open defects', target: '< 7 days', frequency: 'Daily' },
      { name: 'Reopen Rate', formula: '(Reopened Defects / Closed Defects) × 100', description: 'Percentage of defects reopened after closure', target: '< 5%', frequency: 'Weekly' },
    ]
  },
  {
    category: 'Healing & Automation',
    icon: Sparkles,
    kpis: [
      { name: 'Healing Success Rate', formula: '(Successful Healings / Total Healings) × 100', description: 'Percentage of successful self-healing interventions', target: '≥ 85%', frequency: 'Per Run' },
      { name: 'Automation Rate', formula: '(Automated Cases / Total Cases) × 100', description: 'Percentage of test cases that are automated', target: '≥ 85%', frequency: 'Weekly' },
      { name: 'Promotion Acceptance', formula: '(Approved Promotions / Total Promotions) × 100', description: 'Rate of healing promotions accepted to IR', target: '≥ 70%', frequency: 'Weekly' },
    ]
  },
  {
    category: 'Resource Utilization',
    icon: Users,
    kpis: [
      { name: 'Runner Utilization', formula: '(Active Time / Available Time) × 100', description: 'Percentage of time runners are actively executing', target: '≥ 70%', frequency: 'Daily' },
      { name: 'Queue Wait Time', formula: 'Avg(Start Time - Queued Time)', description: 'Average time runs wait in queue before starting', target: '< 15 min', frequency: 'Per Run' },
      { name: 'Agent Efficiency', formula: 'Cases Executed / Agent Hours', description: 'Test cases executed per agent hour', target: '≥ 20', frequency: 'Daily' },
    ]
  },
]

export default function KPIDictionaryPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredCategories = MOCK_KPIS.map(cat => ({
    ...cat,
    kpis: cat.kpis.filter(kpi => 
      kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kpi.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.kpis.length > 0)

  const totalKPIs = MOCK_KPIS.reduce((sum, cat) => sum + cat.kpis.length, 0)

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">KPI Dictionary</h1>
            <p className="page-description">{totalKPIs} metrics across {MOCK_KPIS.length} categories with definitions and targets</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Dictionary
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search KPIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* KPI Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.category}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{category.category}</CardTitle>
                      <CardDescription>{category.kpis.length} metrics</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {category.kpis.map((kpi, idx) => (
                      <AccordionItem key={idx} value={`${category.category}-${idx}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{kpi.name}</span>
                            <Badge variant="outline" className="text-xs">{kpi.frequency}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div>
                              <p className="page-description">Description</p>
                              <p className="text-sm">{kpi.description}</p>
                            </div>
                            <div>
                              <p className="page-description">Formula</p>
                              <code className="text-sm bg-muted px-2 py-1 rounded">{kpi.formula}</code>
                            </div>
                            <div>
                              <p className="page-description">Target</p>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {kpi.target}
                              </Badge>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
