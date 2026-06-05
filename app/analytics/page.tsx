'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Target, 
  Layers, 
  FileText, 
  ClipboardCheck,
  Package,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AnimatedNumber, staggerContainer, staggerItem } from '@/lib/animations'
import { 
  MOCK_COVERAGE_KPIS, 
  MOCK_COVERAGE_MATRIX, 
  MOCK_UNCOVERED_ZOBJECTS,
  type CoverageCell 
} from '@/lib/reports-mock-data'

const modules = ['SD', 'MM', 'FI', 'CO', 'PP']
const processes = ['OTC', 'PTP', 'RTR', 'HTH', 'STP']

function getCoverageColor(state: string): string {
  switch (state) {
    case 'high': return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
    case 'medium': return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30'
    case 'low': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
    default: return 'bg-muted/30 text-muted-foreground border-muted'
  }
}

export default function TestPackCoveragePage() {
  const [timeRange, setTimeRange] = React.useState('current')
  const [migrationScope, setMigrationScope] = React.useState('all')
  const [customerScope, setCustomerScope] = React.useState('global')
  const [selectedCell, setSelectedCell] = React.useState<CoverageCell | null>(null)
  
  const kpis = MOCK_COVERAGE_KPIS
  const matrix = MOCK_COVERAGE_MATRIX
  const uncoveredZobjects = MOCK_UNCOVERED_ZOBJECTS

  const getCell = (module: string, process: string): CoverageCell | undefined => {
    return matrix.find(c => c.module === module && c.process === process)
  }

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Test Pack Coverage" description="Coverage of your test library across SAP modules, business processes, and Z-objects." />

        {/* KPI Strip with Animations */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02]">
              <CardContent>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-primary/10"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Layers className="h-4 w-4 text-primary" />
                  </motion.div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={kpis.totalSuites} />
                    </p>
                    <p className="caption-text">Test Suites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02] bg-blue-50/80 border-0 shadow-sm hover:bg-blue-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-blue-100"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  <div>
                    <p className="stat-value">
                      <AnimatedNumber value={kpis.totalScenarios} />
                    </p>
                    <p className="caption-text">Scenarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02] bg-violet-50/80 border-0 shadow-sm hover:bg-violet-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-violet-100"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <ClipboardCheck className="h-4 w-4 text-violet-600" />
                  </motion.div>
                  <div>
                    <p className="stat-value">{kpis.totalCases}</p>
                    <p className="caption-text">Test Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02] bg-emerald-50/80 border-0 shadow-sm hover:bg-emerald-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <Package className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="stat-value">{kpis.modulesCovered.covered}/{kpis.modulesCovered.total}</p>
                    <p className="caption-text">Modules Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02] bg-cyan-50/80 border-0 shadow-sm hover:bg-cyan-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-100">
                    <Target className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <p className="stat-value">{kpis.processesCovered.covered}/{kpis.processesCovered.total}</p>
                    <p className="caption-text">Processes Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="transition-transform hover:scale-[1.02] bg-amber-50/80 border-0 shadow-sm hover:bg-amber-50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="stat-value">{kpis.zobjectCoverage}%</p>
                    <p className="caption-text">Z-Object Coverage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Snapshot</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Migration:</span>
            <Select value={migrationScope} onValueChange={setMigrationScope}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Migrations</SelectItem>
                <SelectItem value="star-cement">Star Cement S/4HANA</SelectItem>
                <SelectItem value="vertex">Vertex Industries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Scope:</span>
            <Select value={customerScope} onValueChange={setCustomerScope}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="customer">Customer-specific</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coverage Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Coverage Heatmap</CardTitle>
            <CardDescription>Modules x Business Processes. Click any cell to view covering Test Cases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-sm font-medium text-muted-foreground">Module</th>
                    {processes.map(process => (
                      <th key={process} className="p-2 text-center text-sm font-medium text-muted-foreground min-w-[100px]">
                        {process}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module}>
                      <td className="p-2 text-sm font-medium">{module}</td>
                      {processes.map(process => {
                        const cell = getCell(module, process)
                        if (!cell) return <td key={process} className="p-2" />
                        
                        return (
                          <td key={process} className="p-2">
                            <button
                              onClick={() => cell.state !== 'out-of-scope' && setSelectedCell(cell)}
                              disabled={cell.state === 'out-of-scope'}
                              className={cn(
                                'w-full p-3 rounded-lg border text-center transition-all',
                                getCoverageColor(cell.state),
                                cell.state !== 'out-of-scope' && 'hover:ring-2 hover:ring-primary/50 cursor-pointer'
                              )}
                            >
                              {cell.state === 'out-of-scope' ? (
                                <span className="text-xs">—</span>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-lg font-semibold">{cell.testCases}</p>
                                  <p className="text-xs opacity-70">{cell.coverage}%</p>
                                </div>
                              )}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30" />
                <span className="text-xs text-muted-foreground">{'>'}80% Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30" />
                <span className="text-xs text-muted-foreground">50-80% Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" />
                <span className="text-xs text-muted-foreground">{'<'}50% Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/30 border border-muted" />
                <span className="text-xs text-muted-foreground">Out of Scope</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drill-down Accordions */}
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="uncovered" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Z-objects without Test Coverage</span>
                <Badge variant="secondary" className="ml-2">{uncoveredZobjects.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {uncoveredZobjects.map(zobj => (
                  <div key={zobj.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Badge variant={zobj.riskScore === 'high' ? 'destructive' : zobj.riskScore === 'medium' ? 'default' : 'secondary'}>
                        {zobj.riskScore}
                      </Badge>
                      <div>
                        <p className="font-mono text-sm">{zobj.name}</p>
                        <p className="caption-text">{zobj.type} - {zobj.usageCount} usages</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Generate Test
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="recent" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Recently Added Coverage</span>
                <Badge variant="secondary" className="ml-2">Last 30 days</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">SD/OTC: Credit Memo Processing</p>
                    <p className="caption-text">4 Test Cases added - May 3, 2026</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-700">+12%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">FI/RTR: Month-End Close</p>
                    <p className="caption-text">6 Test Cases added - April 28, 2026</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-700">+8%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">MM/PTP: Invoice Verification</p>
                    <p className="caption-text">3 Test Cases added - April 22, 2026</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-700">+5%</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Cell Detail Sheet */}
        <Sheet open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>
                {selectedCell?.module} / {selectedCell?.process} Coverage
              </SheetTitle>
              <SheetDescription>
                {selectedCell?.testCases} Test Cases covering {selectedCell?.scopeItems} scope items
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <span className="text-sm text-muted-foreground">Coverage</span>
                <span className="stat-value">{selectedCell?.coverage}%</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Test Cases</p>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">TC-{selectedCell?.module}-{String(i).padStart(3, '0')}</p>
                      <p className="caption-text">Sample Test Case {i}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="#">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
    </AppShell>
  )
}
