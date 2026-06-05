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
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusBadge } from "@/components/status-badge"
import { KPIStrip } from "@/components/kpi-strip"
import { ApprovalSignatureChain } from "@/components/approval-signature-chain"
import { EvidenceBundleCard } from "@/components/evidence-bundle-card"
import { SignOffPanel } from "@/components/sign-off-panel"
import { 
  Search, 
  Filter, 
  Download,
  FileCheck,
  FileText,
  Image,
  Video,
  Archive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Stamp,
  Eye,
  Share2,
  FolderOpen,
  Calendar
} from "lucide-react"

// Mock evidence bundles matching EvidenceBundle interface
const evidenceBundles = [
  {
    id: "EVB-2024-001",
    name: "Order-to-Cash UAT Evidence Pack",
    manifest: {
      totalItems: 312,
      itemsByKind: { screenshot: 245, video: 20, api_trace: 0, action_log: 47, document: 0 }
    },
    signatureState: "signed" as const,
    signedBy: "Priya Sharma",
    signedAt: "2024-01-15T11:00:00Z",
    retentionUntil: "2025-01-15T00:00:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    sizeBytes: 1258291200
  },
  {
    id: "EVB-2024-002",
    name: "Procure-to-Pay Regression Evidence",
    manifest: {
      totalItems: 198,
      itemsByKind: { screenshot: 156, video: 4, api_trace: 0, action_log: 38, document: 0 }
    },
    signatureState: "unsigned" as const,
    retentionUntil: "2025-01-15T00:00:00Z",
    createdAt: "2024-01-15T09:15:00Z",
    sizeBytes: 524288000
  },
  {
    id: "EVB-2024-003",
    name: "Financial Close Evidence Package",
    manifest: {
      totalItems: 428,
      itemsByKind: { screenshot: 340, video: 26, api_trace: 0, action_log: 62, document: 0 }
    },
    signatureState: "verified" as const,
    signedBy: "Anjali Desai",
    signedAt: "2024-01-15T08:00:00Z",
    retentionUntil: "2025-01-14T00:00:00Z",
    createdAt: "2024-01-14T18:00:00Z",
    sizeBytes: 2147483648
  }
]

// Mock sign-off entities matching SignOffEntity interface
const signOffEntities = [
  {
    id: "SOE-001",
    type: "suite" as const,
    name: "Order-to-Cash UAT Evidence Pack",
    roles: [
      { role: "Test Lead", required: true, signed: true, signedBy: { id: "u1", name: "Priya Sharma" }, signedAt: "2024-01-15T11:00:00Z" },
      { role: "Business Owner", required: true, signed: false },
      { role: "QA Manager", required: true, signed: false }
    ],
    status: "partial" as const
  },
  {
    id: "SOE-002",
    type: "suite" as const,
    name: "Procure-to-Pay Regression Evidence",
    roles: [
      { role: "Test Lead", required: true, signed: false },
      { role: "Business Owner", required: true, signed: false }
    ],
    status: "pending" as const
  }
]

export default function EvidencePortalPage() {
  const [activeTab, setActiveTab] = useState("bundles")
  const [selectedBundle, setSelectedBundle] = useState<typeof evidenceBundles[0] | null>(null)

  const kpis = [
    { id: 'bundles', label: "Evidence Bundles", value: evidenceBundles.length },
    { id: 'pending', label: "Pending Sign-Off", value: signOffEntities.filter(e => e.status !== 'complete').length, trend: 'neutral' as const },
    { id: 'verified', label: "Verified", value: evidenceBundles.filter(b => b.signatureState === "verified").length, trend: 'up' as const, trendValue: '+1' },
    { id: 'items', label: "Total Evidence Items", value: evidenceBundles.reduce((sum, b) => sum + b.manifest.totalItems, 0) },
    { id: 'compliance', label: "Compliance Score", value: "96%", trend: 'up' as const, trendValue: '+2%' }
  ]

  return (
    <AppShell currentApp="evidence-portal">
              {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Evidence & Sign-Off Portal</h1>
            <p className="page-description">Manage test evidence packages and approval workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
            <Button size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Create Bundle
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <KPIStrip kpis={kpis} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="bundles">
                <Archive className="mr-2 h-4 w-4" />
                Evidence Bundles
              </TabsTrigger>
              <TabsTrigger value="signoffs">
                <Stamp className="mr-2 h-4 w-4" />
                Sign-Off Requests
                {signOffEntities.filter(e => e.status !== 'complete').length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {signOffEntities.filter(e => e.status !== 'complete').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="audit">
                <Shield className="mr-2 h-4 w-4" />
                Audit Log
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search bundles..." className="w-64 pl-9" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <TabsContent value="bundles" className="space-y-4">
            <div className="grid gap-4">
              {evidenceBundles.map((bundle) => (
                <EvidenceBundleCard 
                  key={bundle.id} 
                  bundle={bundle}
                  onSelect={() => setSelectedBundle(bundle)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signoffs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {signOffEntities.map((entity) => (
                <SignOffPanel 
                  key={entity.id}
                  entity={entity}
                  currentUserRole="Business Owner"
                />
              ))}
            </div>

            {signOffEntities.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="page-description">No pending sign-off requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete history of evidence and sign-off activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Bundle</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-sm text-muted-foreground">
                        2024-01-15 11:00:32
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">
                          Sign-Off Approved
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">EVB-2024-001</span>
                      </TableCell>
                      <TableCell>Priya Sharma</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        Test Lead approval completed
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm text-muted-foreground">
                        2024-01-15 10:45:18
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                          Evidence Added
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">EVB-2024-002</span>
                      </TableCell>
                      <TableCell>AI Agent</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        38 screenshots auto-captured
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-sm text-muted-foreground">
                        2024-01-15 10:30:00
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Bundle Created</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">EVB-2024-001</span>
                      </TableCell>
                      <TableCell>System</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        Auto-generated from test execution
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </AppShell>
  )
}
