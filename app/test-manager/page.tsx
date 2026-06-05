"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { StatusBadge, PriorityBadge } from "@/components/status-badge"
import { EntityCodeLink } from "@/components/entity-code-link"
import { KPIStrip } from "@/components/kpi-strip"
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  FolderTree, 
  Play, 
  Copy,
  Trash2,
  Edit,
  ChevronRight,
  ChevronDown,
  FileCode,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Upload,
  Download,
  RefreshCw
} from "lucide-react"

// Mock data for test suites
const testSuites = [
  {
    id: "TS-001",
    name: "Order-to-Cash E2E",
    description: "Complete O2C process validation",
    testCases: 47,
    passRate: 94.2,
    lastRun: "2024-01-15T10:30:00Z",
    status: "Pass" as const,
    module: "SD",
    priority: "P1" as const,
    owner: "Priya Sharma",
    tags: ["regression", "critical-path", "o2c"]
  },
  {
    id: "TS-002",
    name: "Procure-to-Pay Regression",
    description: "P2P cycle with GR/IR clearing",
    testCases: 38,
    passRate: 87.5,
    lastRun: "2024-01-15T09:15:00Z",
    status: "Fail" as const,
    module: "MM",
    priority: "P1" as const,
    owner: "Rahul Verma",
    tags: ["regression", "p2p"]
  },
  {
    id: "TS-003",
    name: "Financial Close Activities",
    description: "Month-end close procedures",
    testCases: 62,
    passRate: 100,
    lastRun: "2024-01-14T18:00:00Z",
    status: "Pass" as const,
    module: "FICO",
    priority: "P2" as const,
    owner: "Anjali Desai",
    tags: ["financial", "month-end"]
  },
  {
    id: "TS-004",
    name: "Plant Maintenance Workflows",
    description: "PM order lifecycle tests",
    testCases: 29,
    passRate: 0,
    lastRun: null,
    status: "NotRun" as const,
    module: "PM",
    priority: "P3" as const,
    owner: "Vikram Singh",
    tags: ["pm", "maintenance"]
  },
  {
    id: "TS-005",
    name: "HR Master Data Sync",
    description: "Employee master data validation",
    testCases: 18,
    passRate: 78.3,
    lastRun: "2024-01-15T11:00:00Z",
    status: "Healed" as const,
    module: "HCM",
    priority: "P2" as const,
    owner: "Meera Patel",
    tags: ["hr", "master-data"]
  }
]

const testCases = [
  {
    id: "TC-001-001",
    name: "Create Sales Order VA01",
    suiteId: "TS-001",
    steps: 12,
    status: "Pass" as const,
    lastRun: "2024-01-15T10:30:00Z",
    duration: "45s",
    tcode: "VA01",
    healingApplied: false
  },
  {
    id: "TC-001-002",
    name: "Delivery Creation VL01N",
    suiteId: "TS-001",
    steps: 8,
    status: "Pass" as const,
    lastRun: "2024-01-15T10:31:00Z",
    duration: "32s",
    tcode: "VL01N",
    healingApplied: false
  },
  {
    id: "TC-001-003",
    name: "Post Goods Issue VL02N",
    suiteId: "TS-001",
    steps: 6,
    status: "Pass" as const,
    lastRun: "2024-01-15T10:32:00Z",
    duration: "28s",
    tcode: "VL02N",
    healingApplied: true
  },
  {
    id: "TC-001-004",
    name: "Create Billing VF01",
    suiteId: "TS-001",
    steps: 10,
    status: "Fail" as const,
    lastRun: "2024-01-15T10:33:00Z",
    duration: "52s",
    tcode: "VF01",
    healingApplied: false
  },
  {
    id: "TC-001-005",
    name: "Release to Accounting VF02",
    suiteId: "TS-001",
    steps: 5,
    status: "Pass" as const,
    lastRun: "2024-01-15T10:34:00Z",
    duration: "18s",
    tcode: "VF02",
    healingApplied: false
  }
]

export default function TestManagerPage() {
  const [selectedSuites, setSelectedSuites] = useState<string[]>([])
  const [expandedSuites, setExpandedSuites] = useState<string[]>(["TS-001"])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("suites")

  const toggleSuiteExpand = (suiteId: string) => {
    setExpandedSuites(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    )
  }

  const toggleSuiteSelect = (suiteId: string) => {
    setSelectedSuites(prev =>
      prev.includes(suiteId)
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    )
  }

  const kpis = [
    { id: 'total-suites', label: "Total Suites", value: testSuites.length },
    { id: 'total-cases', label: "Total Cases", value: testSuites.reduce((sum, s) => sum + s.testCases, 0) },
    { id: 'avg-pass-rate', label: "Avg Pass Rate", value: "91.2%", trend: 'up' as const, trendValue: '+2.3%' },
    { id: 'failed-today', label: "Failed Today", value: 3, trend: 'down' as const },
    { id: 'auto-healed', label: "Auto-Healed", value: 7, trend: 'up' as const, trendValue: '+3' }
  ]

  return (
    <AppShell currentApp="test-manager">
              {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Test Manager</h1>
            <p className="page-description">Manage test suites, cases, and step definitions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Suite
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <KPIStrip kpis={kpis} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="suites">Test Suites</TabsTrigger>
              <TabsTrigger value="cases">Test Cases</TabsTrigger>
              <TabsTrigger value="steps">Step Library</TabsTrigger>
              <TabsTrigger value="data">Test Data</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search suites, cases, steps..." 
                  className="w-80 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <TabsContent value="suites" className="space-y-4">
            {/* Bulk Actions */}
            {selectedSuites.length > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedSuites.length} suite(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Run Selected
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Suites Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedSuites.length === testSuites.length}
                        onCheckedChange={(checked) => {
                          setSelectedSuites(checked ? testSuites.map(s => s.id) : [])
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Suite</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testSuites.map((suite) => (
                    <>
                      <TableRow 
                        key={suite.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleSuiteExpand(suite.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedSuites.includes(suite.id)}
                            onCheckedChange={() => toggleSuiteSelect(suite.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {expandedSuites.includes(suite.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <EntityCodeLink 
                              kind="Suite" 
                              code={suite.id} 
                              name={suite.name}
                              href={`/test-manager/suites/${suite.id}`}
                            />
                            <span className="text-xs text-muted-foreground">{suite.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{suite.module}</Badge>
                        </TableCell>
                        <TableCell>{suite.testCases}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={suite.passRate} className="h-2 w-16" />
                            <span className="text-sm">{suite.passRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {suite.lastRun ? (
                            <span className="text-sm text-muted-foreground">
                              {new Date(suite.lastRun).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={suite.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={suite.priority} />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{suite.owner}</span>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Run Suite
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Test Cases */}
                      {expandedSuites.includes(suite.id) && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={11} className="p-0">
                            <div className="border-l-2 border-primary/30 ml-6 pl-4 py-2">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Test Case</TableHead>
                                    <TableHead>T-Code</TableHead>
                                    <TableHead>Steps</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Healing</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {testCases
                                    .filter(tc => tc.suiteId === suite.id)
                                    .map((tc) => (
                                      <TableRow key={tc.id}>
                                        <TableCell>
                                          <EntityCodeLink 
                                            kind="TestCase" 
                                            code={tc.id} 
                                            name={tc.name}
                                            href={`/test-manager/cases/${tc.id}`}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <span className="font-mono text-sm text-muted-foreground">
                                            {tc.tcode}
                                          </span>
                                        </TableCell>
                                        <TableCell>{tc.steps}</TableCell>
                                        <TableCell>
                                          <span className="text-sm text-muted-foreground">{tc.duration}</span>
                                        </TableCell>
                                        <TableCell>
                                          <StatusBadge status={tc.status} />
                                        </TableCell>
                                        <TableCell>
                                          {tc.healingApplied && (
                                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                              <Sparkles className="mr-1 h-3 w-3" />
                                              Healed
                                            </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="cases">
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>View and manage individual test cases across all suites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="page-description">Test cases view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps">
            <Card>
              <CardHeader>
                <CardTitle>Step Library</CardTitle>
                <CardDescription>Reusable step definitions and action templates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="page-description">Step library view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Test Data</CardTitle>
                <CardDescription>Manage test data sets and parameterization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="page-description">Test data view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </AppShell>
  )
}
