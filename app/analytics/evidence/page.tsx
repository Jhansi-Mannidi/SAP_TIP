'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Archive,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Play,
  Download,
  FileCheck,
  Image,
  Video,
  FileText,
  MonitorSmartphone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { MOCK_EVIDENCE_BUNDLES, type EvidenceBundle } from '@/lib/reports-mock-data'

function getBundleKindIcon(kind: string) {
  switch (kind) {
    case 'suite_execution': return Archive
    case 'case_execution': return Play
    case 'scenario_execution': return FileText
    case 'defect': return ShieldAlert
    case 'decision_log_entry': return FileCheck
    case 'audit_pack': return Shield
    default: return Archive
  }
}

function getSignatureIcon(status: string) {
  switch (status) {
    case 'verified': return { icon: ShieldCheck, color: 'text-emerald-500' }
    case 'unverified': return { icon: Shield, color: 'text-amber-500' }
    case 'failed': return { icon: ShieldX, color: 'text-red-500' }
    default: return { icon: Shield, color: 'text-muted-foreground' }
  }
}

function getRetentionColor(until: string): string {
  const daysLeft = Math.ceil((new Date(until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (daysLeft < 30) return 'text-red-600'
  if (daysLeft < 90) return 'text-amber-600'
  return 'text-muted-foreground'
}

export default function EvidenceLockerPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [bundleKind, setBundleKind] = React.useState('all')
  const [retentionStatus, setRetentionStatus] = React.useState('all')
  const [signatureState, setSignatureState] = React.useState('all')
  const [selectedBundles, setSelectedBundles] = React.useState<string[]>([])

  const bundles = MOCK_EVIDENCE_BUNDLES

  const toggleBundle = (id: string) => {
    setSelectedBundles(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedBundles(prev => 
      prev.length === bundles.length ? [] : bundles.map(b => b.id)
    )
  }

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Evidence Locker" description="Searchable archive of all signed evidence bundles. Retention-policy-managed; signature-verifiable." />

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Migration, Suite, Scenario, Case, Defect, date range, or signature key ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Kind:</span>
            <Select value={bundleKind} onValueChange={setBundleKind}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kinds</SelectItem>
                <SelectItem value="case_execution">Case Execution</SelectItem>
                <SelectItem value="scenario_execution">Scenario Execution</SelectItem>
                <SelectItem value="suite_execution">Suite Execution</SelectItem>
                <SelectItem value="defect">Defect</SelectItem>
                <SelectItem value="decision_log_entry">Decision Log</SelectItem>
                <SelectItem value="audit_pack">Audit Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Retention:</span>
            <Select value={retentionStatus} onValueChange={setRetentionStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Signature:</span>
            <Select value={signatureState} onValueChange={setSignatureState}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBundles.length > 0 && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <span className="text-sm font-medium">{selectedBundles.length} selected</span>
            <Button size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Initiate Audit Pack Export
            </Button>
          </div>
        )}

        {/* Evidence Table */}
        <Card padding="flush">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-4 text-left">
                      <Checkbox 
                        checked={selectedBundles.length === bundles.length}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Bundle ID</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Kind</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Parent Entity</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Items</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Retention</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Signature</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Size</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bundles.map(bundle => {
                    const KindIcon = getBundleKindIcon(bundle.kind)
                    const { icon: SigIcon, color: sigColor } = getSignatureIcon(bundle.signatureStatus)
                    
                    return (
                      <tr key={bundle.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <Checkbox 
                            checked={selectedBundles.includes(bundle.id)}
                            onCheckedChange={() => toggleBundle(bundle.id)}
                          />
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs">{bundle.id}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="gap-1">
                            <KindIcon className="h-3 w-3" />
                            {bundle.kind.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <button className="text-sm text-primary hover:underline">
                            {bundle.parentEntity}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Image className="h-3 w-3" />
                              {bundle.itemCounts.screenshots}
                            </Badge>
                            {bundle.itemCounts.videos > 0 && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Video className="h-3 w-3" />
                                {bundle.itemCounts.videos}
                              </Badge>
                            )}
                            {bundle.itemCounts.screenModels > 0 && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <MonitorSmartphone className="h-3 w-3" />
                                {bundle.itemCounts.screenModels}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{formatRelativeTime(bundle.createdAt)}</span>
                        </td>
                        <td className="p-4">
                          <span className={cn('text-sm', getRetentionColor(bundle.retentionUntil))}>
                            {bundle.retentionUntil}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <SigIcon className={cn('h-5 w-5 mx-auto', sigColor)} />
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{bundle.size}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            {bundle.kind.includes('execution') && (
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm text-muted-foreground">Showing 1-6 of 30 bundles</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </AppShell>
  )
}
